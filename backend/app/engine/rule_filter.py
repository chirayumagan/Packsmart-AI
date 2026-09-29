"""
rule_filter.py — Hard-gate rule engine for PackSmart AI.

Rules applied in order:
  1. HARD: is_fssai_approved must be True.
  2. HARD: Material OTR capability must meet or exceed food's required OTR class.
  3. HARD: Material WVTR capability must meet or exceed food's required WVTR class.
  4. SOFT:  Material must support the chosen transit route.

The barrier class ordering is: low_barrier < medium_barrier < high_barrier.
A material with a HIGHER barrier class always satisfies a LOWER requirement.
"""
from typing import List
from app.models import FoodProfile, PackagingMaterial

# Ordering map: higher index = stronger barrier
BARRIER_ORDER = {
    "low_barrier": 0,
    "medium_barrier": 1,
    "high_barrier": 2,
}


def _meets_barrier(material_class: str, required_class: str, category: str = "", form: str = "") -> bool:
    """Return True if the material's barrier class satisfies the food's requirement."""
    # Produce (Whole) MUST NOT have a high barrier (like airtight foil) to prevent anaerobic spoilage.
    # It needs breathable (low_barrier) or micro-vented/MAP (medium_barrier) films.
    if category == "Fresh Produce" and form == "Whole":
        if required_class == "low_barrier":
            return material_class in ["low_barrier", "medium_barrier"]
            
    # For others, a higher barrier (lower transmission) is acceptable
    return BARRIER_ORDER[material_class] >= BARRIER_ORDER[required_class]


def apply_rules(
    food_profile: FoodProfile,
    materials: List[PackagingMaterial],
    transit_route: str,
) -> List[PackagingMaterial]:
    """
    Filter materials based on FSSAI compliance, barrier compatibility,
    and transit route suitability.
    """
    hard_passed = []

    for mat in materials:
        # Rule 1 — FSSAI hard gate
        if not mat.is_fssai_approved:
            continue

        # Rule 2 — OTR compatibility
        if not _meets_barrier(mat.otr_class.value, food_profile.required_otr_class.value, food_profile.category, food_profile.form):
            continue

        # Rule 3 — WVTR compatibility
        if not _meets_barrier(mat.wvtr_class.value, food_profile.required_wvtr_class.value, food_profile.category, food_profile.form):
            continue

        hard_passed.append(mat)

    # Rule 4 — Transit route suitability (soft filter)
    transit_passed = []
    for mat in hard_passed:
        suitable = [t.strip() for t in mat.suitable_transit.split(",")]
        if transit_route in suitable:
            transit_passed.append(mat)

    # Return transit-specific matches if available, otherwise fallback to hard-gate barrier-safe materials
    return transit_passed if transit_passed else hard_passed

