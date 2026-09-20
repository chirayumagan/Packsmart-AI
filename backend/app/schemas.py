"""
schemas.py — Pydantic request/response models for PackSmart AI API.
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class RecommendationRequest(BaseModel):
    """
    Payload from the frontend wizard — only user-visible selections.
    No technical parameters.
    """
    category: str       # "Fresh Produce" | "Dairy" | "Dry Snacks" | "Meat"
    form: str           # "Whole" | "Cut/Processed" | "Powder" | "Liquid"
    transit_route: str  # "local" | "interstate" | "cold_chain"


class PackagingRecommendation(BaseModel):
    """A single ranked packaging recommendation card."""
    id: str
    rank: int
    name: str
    cost_per_unit_inr: float
    shelf_life_days: int
    is_fssai_approved: bool
    description: str
    score: float
    technical_specs: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class RecommendationResponse(BaseModel):
    """Top-3 recommendations returned to the frontend."""
    recommendations: List[PackagingRecommendation]
    food_category: str
    food_form: str
    transit_route: str
