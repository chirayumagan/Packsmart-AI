"""
physics_engine.py — Physics-Informed Shelf-Life & Permeation Engine for PackSmart AI.

Models:
  1. Arrhenius Temperature-Dependent Shelf Life Kinetics:
     k(T) = k_ref * exp( (-Ea / R) * (1/T - 1/T_ref) )
     SL(T) = SL_base * (k_ref / k(T_transit))

  2. Respiration & Anaerobic Suffocation Kinetics:
     Whole respiring produce (e.g. Alphonso Mango, Mushroom, Fresh Produce) requires minimum
     oxygen permeability (OTR > 500 cm³/m²/day). Zero-permeability or hermetic foil laminates
     lead to O₂ depletion (< 1%) and ethanol fermentation/suffocation, penalizing score to 0.

  3. Lipid Oxidation & Moisture Migration Kinetics:
     High-fat dry snacks (e.g. Aloo Bhujia, Namkeen) & dairy suffer from free radical lipid oxidation.
     High-OTR films accelerate rancidity; high-barrier films extend shelf-life.
"""
import math
from typing import Dict, Any, Tuple

# Reference Temperature = 20°C (293.15 K)
T_REF_K = 293.15

# Activation energy ratio (Ea / R) for standard food quality degradation
EA_OVER_R = 5000.0

# Transit route ambient/operating temperature mapping in Kelvin
TRANSIT_TEMP_K = {
    "local": 305.15,      # 32°C Summer / ambient Indian local mandi transit
    "interstate": 301.15, # 28°C Ambient truck distribution
    "cold_chain": 277.15, # 4°C Refrigerated express transport
}

# Material sustainability rating (1.0 - 10.0 scale)
SUSTAINABILITY_SCORES = {
    "pla": 9.5,
    "pla-bio": 9.5,
    "paper": 9.0,
    "bopp": 7.5,
    "ldpe": 7.0,
    "hdpe": 6.5,
    "pp": 6.0,
    "map": 5.5,
    "bopp-map": 5.5,
    "pet": 5.0,
    "met-pet-evoh": 4.0,
    "retort": 3.5,
    "alu": 3.0,
}


def get_sustainability_score(material_slug: str) -> float:
    """Return sustainability score (1.0 - 10.0 scale) for a material slug."""
    slug_l = material_slug.lower()
    for key, val in SUSTAINABILITY_SCORES.items():
        if key in slug_l:
            return val
    return 6.0


def calculate_arrhenius_shelf_life(base_days: int, transit_route: str) -> Tuple[float, float, str]:
    """
    Calculate temperature-adjusted shelf life using Arrhenius kinetics.

    Returns:
        (adjusted_days, rate_factor, range_str)
    """
    t_transit = TRANSIT_TEMP_K.get(transit_route, 301.15)
    
    # k(T) / k(T_ref) = exp( (-Ea/R) * (1/T_transit - 1/T_ref) )
    rate_factor = math.exp(-EA_OVER_R * ((1.0 / t_transit) - (1.0 / T_REF_K)))
    
    # Shelf life varies inversely with degradation rate
    adjusted_days = max(1.0, float(base_days) / rate_factor)
    
    # Physical window range (±12%)
    min_days = max(1, int(round(adjusted_days * 0.88)))
    max_days = int(round(adjusted_days * 1.12))
    range_str = f"{min_days} – {max_days} Days"
    
    return adjusted_days, rate_factor, range_str


def evaluate_physics_compatibility(
    category: str,
    form: str,
    material_name: str,
    material_slug: str,
    otr_class: str,
    wvtr_class: str
) -> Dict[str, Any]:
    """
    Evaluate respiration, lipid oxidation, and moisture physics constraints.

    Returns dict with penalties, anaerobic flags, oxidation flags, and physics notes.
    """
    is_respiring_produce = (category == "Fresh Produce" and form == "Whole")
    is_lipid_sensitive = (category in ["Dry Snacks", "Dairy", "Meat"])
    
    name_lower = material_name.lower()
    slug_lower = material_slug.lower()
    
    # Check for zero/near-zero OTR foil/retort materials
    is_zero_permeability_foil = any(
        k in name_lower or k in slug_lower
        for k in ["aluminium", "alu", "retort", "met-pet", "foil"]
    )
    
    # Check for high-permeability films
    is_high_otr = (otr_class == "low_barrier" or "paper" in slug_lower or "ldpe" in slug_lower)

    anaerobic_suffocation_flag = False
    lipid_oxidation_flag = False
    penalty_multiplier = 1.0
    physics_rationale = ""

    # Physics Rule 1: Respiring whole produce in hermetic foil -> Anaerobic Suffocation
    if is_respiring_produce and is_zero_permeability_foil:
        anaerobic_suffocation_flag = True
        penalty_multiplier = 0.0  # Completely non-viable
        physics_rationale = (
            "CRITICAL RISK: Zero oxygen permeability causes rapid O₂ depletion (< 1%), "
            "triggering ethanol fermentation, tissue breakdown, and anaerobic suffocation."
        )

    # Physics Rule 2: High-fat snacks in high-OTR packaging -> Lipid Oxidation Rancidity
    elif is_lipid_sensitive and is_high_otr:
        lipid_oxidation_flag = True
        penalty_multiplier = 0.35  # Severe penalty
        physics_rationale = (
            "QUALITY WARNING: High oxygen transmission rate (OTR) accelerates lipid "
            "hydrolysis and free radical oxidation, causing off-flavors and rancidity."
        )

    else:
        if is_respiring_produce:
            physics_rationale = (
                "Permeable micro-barrier maintains ideal equilibrium headspace (O₂ ~3-5%, CO₂ ~5-10%), "
                "suppressing respiration rate without inducing anaerobic fermentation."
            )
        else:
            physics_rationale = (
                "High moisture and oxygen barrier limits water activity (aw) drift and "
                "prevents oxidative degradation during transit."
            )

    return {
        "penalty_multiplier": penalty_multiplier,
        "anaerobic_suffocation_flag": anaerobic_suffocation_flag,
        "lipid_oxidation_flag": lipid_oxidation_flag,
        "physics_rationale": physics_rationale,
    }

