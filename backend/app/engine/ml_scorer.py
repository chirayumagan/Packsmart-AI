"""
ml_scorer.py — Weighted scoring function for PackSmart AI.

Uses pure Python min-max normalization (no scikit-learn dependency)
so the app starts instantly without heavy C extension loading.

Scoring formula:
    score = 0.4 * (1 - norm_cost) + 0.6 * norm_shelf_life

Weight rationale:
  - Shelf life (60%) prioritised for food safety.
  - Lower cost (40%) improves farmer economics.

Returns the Top 3 materials by score with rank assigned.
"""
from typing import List, Dict, Any
from app.models import PackagingMaterial


def _normalize(values: List[float]) -> List[float]:
    """Min-max normalize a list of floats to [0, 1]."""
    mn, mx = min(values), max(values)
    if mx == mn:
        return [0.5] * len(values)
    return [(v - mn) / (mx - mn) for v in values]


def score_and_rank(materials: List[PackagingMaterial]) -> List[Dict[str, Any]]:
    """
    Score and rank filtered packaging materials.

    Args:
        materials: FSSAI-compliant, barrier-matched materials (post rule engine).

    Returns:
        List of dicts (up to 3) with material + score + rank, sorted by score desc.
    """
    if not materials:
        return []

    costs = [float(m.cost_per_unit_inr) for m in materials]
    shelf_lives = [float(m.shelf_life_days) for m in materials]

    norm_costs = _normalize(costs)
    norm_shelf = _normalize(shelf_lives)

    # Weighted composite score
    scored = []
    for i, mat in enumerate(materials):
        score = 0.4 * (1.0 - norm_costs[i]) + 0.6 * norm_shelf[i]
        scored.append({"material": mat, "score": round(score, 4)})

    # Sort descending, take top 3
    scored.sort(key=lambda x: x["score"], reverse=True)
    top3 = scored[:3]

    for rank, item in enumerate(top3, start=1):
        item["rank"] = rank

    return top3
