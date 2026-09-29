"""
main.py — FastAPI application entry point for PackSmart AI.

Endpoints:
  GET  /health               -> Health check
  GET  /api/categories       -> Returns the 4 food categories for the wizard
  POST /api/identify-food    -> Smart multilingual food name search
  POST /api/recommend        -> Main hybrid-engine recommendation endpoint
"""
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db, engine, Base
from app.models import FoodProfile, PackagingMaterial
from app.schemas import RecommendationRequest, RecommendationResponse, PackagingRecommendation
from app.engine.rule_filter import apply_rules
from app.engine.ml_scorer import score_and_rank
from app.food_search.searcher import search_food


class FoodSearchRequest(BaseModel):
    query: str


# ---------------------------------------------------------------------------
# Technical spec lookup table keyed by material name (partial match)
# Provides OTR / WVTR / Gauge / Seal Temp for each known material type.
# ---------------------------------------------------------------------------
TECH_SPECS_BY_MATERIAL: dict[str, dict] = {
    "micro-perforated bopp": {
        "otr": "1,200 – 1,800 cm³/m²/day", "wvtr": "8 – 12 g/m²/day",
        "gauge": "35 – 40 µm", "seal_temp": "110°C – 120°C",
    },
    "modified atmosphere packaging": {
        "otr": "800 – 1,200 cm³/m²/day", "wvtr": "6 – 10 g/m²/day",
        "gauge": "50 – 70 µm", "seal_temp": "120°C – 140°C",
    },
    "multi-layer retort pouch": {
        "otr": "< 0.5 cm³/m²/day", "wvtr": "< 0.5 g/m²/day",
        "gauge": "110 – 130 µm", "seal_temp": "160°C – 180°C",
    },
    "hdpe woven sack": {
        "otr": "> 5,000 cm³/m²/day", "wvtr": "> 50 g/m²/day",
        "gauge": "90 – 120 µm (woven)", "seal_temp": "N/A (sewn seam)",
    },
    "aluminium foil laminate": {
        "otr": "< 0.01 cm³/m²/day", "wvtr": "< 0.1 g/m²/day",
        "gauge": "12 µm Al + 50 µm PE", "seal_temp": "140°C – 160°C",
    },
    "pp twist film": {
        "otr": "1,500 – 3,000 cm³/m²/day", "wvtr": "3 – 6 g/m²/day",
        "gauge": "20 – 30 µm", "seal_temp": "130°C – 150°C",
    },
    "pet/pe laminate pouch": {
        "otr": "20 – 50 cm³/m²/day", "wvtr": "1 – 3 g/m²/day",
        "gauge": "75 – 100 µm", "seal_temp": "140°C – 160°C",
    },
    "kraft paper bag": {
        "otr": "> 10,000 cm³/m²/day", "wvtr": "> 100 g/m²/day",
        "gauge": "70 – 90 gsm paper", "seal_temp": "N/A (glued/stitched)",
    },
    "bio-degradable pla film": {
        "otr": "800 – 2,200 cm³/m²/day", "wvtr": "12 – 20 g/m²/day",
        "gauge": "40 – 50 µm", "seal_temp": "125°C – 140°C",
    },
    "ldpe stretch film": {
        "otr": "3,000 – 4,000 cm³/m²/day", "wvtr": "22 – 30 g/m²/day",
        "gauge": "20 – 30 µm", "seal_temp": "90°C – 100°C",
    },
}


def get_tech_specs(material_name: str) -> dict:
    """Return technical specs for a material, using partial-name matching."""
    name_lower = material_name.lower()
    for key, specs in TECH_SPECS_BY_MATERIAL.items():
        if key in name_lower:
            return specs
    # Fallback generic specs
    return {
        "otr": "See manufacturer datasheet",
        "wvtr": "See manufacturer datasheet",
        "gauge": "See manufacturer datasheet",
        "seal_temp": "See manufacturer datasheet",
    }


# ---------------------------------------------------------------------------
# Lifespan: create tables on startup (non-blocking after import completes)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: verify Supabase connectivity (schema is managed via migrations — do NOT call create_all)
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    yield
    # Shutdown: nothing to clean up

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = FastAPI(
    title="PackSmart AI API",
    description="Intelligent Food Packaging Recommendation System — SIH 26236",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow requests from the React dev server (Vite default: 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "PackSmart AI"}


@app.get("/api/categories")
def get_categories():
    """Return the 4 food categories and their available forms for the wizard."""
    return {
        "categories": [
            {
                "id": "Fresh Produce",
                "label": "Fresh Produce",
                "emoji": "🥬",
                "forms": ["Whole", "Cut/Processed"],
            },
            {
                "id": "Dairy",
                "label": "Dairy",
                "emoji": "🥛",
                "forms": ["Whole", "Liquid"],
            },
            {
                "id": "Dry Snacks",
                "label": "Dry Snacks",
                "emoji": "🍿",
                "forms": ["Whole", "Powder"],
            },
            {
                "id": "Meat",
                "label": "Meat",
                "emoji": "🥩",
                "forms": ["Whole", "Cut/Processed"],
            },
        ],
        "transit_routes": [
            {
                "id": "local",
                "label": "Local Auto",
                "subtitle": "< 50 km - Same Day",
                "emoji": "🛺",
            },
            {
                "id": "interstate",
                "label": "Inter-State Truck",
                "subtitle": "2-4 Days Transit",
                "emoji": "🚛",
            },
            {
                "id": "cold_chain",
                "label": "Cold Chain Express",
                "subtitle": "Refrigerated - Any Distance",
                "emoji": "❄️",
            },
        ],
    }


@app.post("/api/identify-food")
def identify_food(request: FoodSearchRequest):
    """
    Smart multilingual food search.
    Accepts food name in any Indian language or transliteration.
    Returns matched category + form + confidence score.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    matches = search_food(request.query)

    if not matches:
        return {
            "matches": [],
            "message": "No match found. Please use the visual wizard to select your food type.",
        }

    return {
        "matches": matches,
        "message": f"Found {len(matches)} match(es) for '{request.query}'",
    }


@app.post("/api/recommend", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest, db: Session = Depends(get_db)):
    """
    Main recommendation endpoint.
    1. Look up the FoodProfile matching category + form.
    2. Load all PackagingMaterials.
    3. Apply rule engine filter.
    4. Run ML scorer on filtered materials.
    5. Return top 3.
    """
    # Step 1: Look up food profile
    food_profile = (
        db.query(FoodProfile)
        .filter(
            FoodProfile.category == request.category,
            FoodProfile.form == request.form,
        )
        .first()
    )

    if not food_profile:
        raise HTTPException(
            status_code=404,
            detail=f"No food profile found for category='{request.category}' form='{request.form}'. "
                   f"Please select a valid combination.",
        )

    # Step 2: Load all materials
    all_materials = db.query(PackagingMaterial).all()

    # Step 3: Rule engine filter
    filtered = apply_rules(food_profile, all_materials, request.transit_route)

    if not filtered:
        raise HTTPException(
            status_code=422,
            detail="No FSSAI-compliant materials found for this combination. "
                   "Please try a different transit route or food form.",
        )

    # Step 4: ML scorer -> top 3
    ranked = score_and_rank(filtered)

    def _slugify(name: str) -> str:
        name_l = name.lower()
        if "bopp" in name_l: return "bopp"
        if "pla" in name_l: return "pla"
        if "ldpe" in name_l: return "ldpe"
        if "aluminium" in name_l: return "alu"
        if "retort" in name_l: return "retort"
        if "map" in name_l or "modified atmosphere" in name_l: return "map"
        if "kraft" in name_l: return "paper"
        if "hdpe" in name_l: return "hdpe"
        if "pp" in name_l: return "pp"
        return "pet"

    # Step 5: Build response
    recommendations = [
        PackagingRecommendation(
            id=_slugify(item["material"].name),
            rank=item["rank"],
            name=item["material"].name,
            cost_per_unit_inr=float(item["material"].cost_per_unit_inr),
            shelf_life_days=item["material"].shelf_life_days,
            is_fssai_approved=item["material"].is_fssai_approved,
            description=item["material"].description,
            score=item["score"],
            technical_specs=get_tech_specs(item["material"].name),
        )
        for item in ranked
    ]

    return RecommendationResponse(
        recommendations=recommendations,
        food_category=request.category,
        food_form=request.form,
        transit_route=request.transit_route,
    )

# ---------------------------------------------------------------------------
# Expert Mode Simulation Endpoint
# ---------------------------------------------------------------------------
class ExpertAnalysisRequest(BaseModel):
    commodityPreset: str
    waterActivity: float
    fatContent: float
    o2Percent: float
    co2Percent: float
    respirationRate: float
    tempMin: float
    tempMax: float
    rhMin: float
    rhMax: float
    punctureRating: str
    equipment: str
    gaugeMin: float
    gaugeMax: float
    sealTempMin: float
    sealTempMax: float

@app.post("/api/expert-analyze")
def expert_analyze(request: ExpertAnalysisRequest):
    """
    Mock handler for complex expert calculations. 
    In a production system, this would run multi-layer laminate permeation math.
    """
    import asyncio
    # Return a success flag; the frontend uses its rich mock data for presentation.
    return {"status": "success", "message": "Expert analysis complete", "simulated_aw": request.waterActivity}
