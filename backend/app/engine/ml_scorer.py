"""
ml_scorer.py — Physics-Informed Multi-Objective Optimization (MOO) Engine for PackSmart AI.

Upgraded from basic weighted heuristic to an industry-grade MOO Scorer:
  1. Arrhenius Temperature-Dependent Shelf-Life Kinetics:
     Adjusts food degradation rates based on ambient transit route temperature (local, interstate, cold_chain).

  2. Respiration & Lipid Oxidation Physics Constraints:
     Enforces OTR/WVTR physics compatibility, penalizing anaerobic suffocation (multiplier 0.0)
     and lipid oxidation rancidity (multiplier 0.35).

  3. Eco-Sustainability Rating:
     Incorporates polymer lifecycle & bio-degradability metrics (PLA, Paper, BOPP, etc.).

  4. Pareto Dominance & Compromise Multi-Attribute Utility Function:
     Identifies non-dominated Pareto-optimal solutions across [Shelf Life, Cost Efficiency, Eco-Sustainability, Physics Fit],
     and ranks candidates using a scalarized multi-objective utility formulation.
"""
from typing import List, Dict, Any, Tuple
from app.models import PackagingMaterial, FoodProfile
from app.engine.physics_engine import (
    calculate_arrhenius_shelf_life,
    evaluate_physics_compatibility,
    get_sustainability_score,
)


def _slugify(name: str) -> str:
    """Map material name to canonical material slug."""
    name_l = name.lower()
    if "bopp" in name_l: return "bopp"
    if "pla" in name_l: return "pla"
    if "ldpe" in name_l: return "ldpe"
    if "aluminium" in name_l or "alu" in name_l: return "alu"
    if "retort" in name_l: return "retort"
    if "map" in name_l or "modified atmosphere" in name_l: return "map"
    if "kraft" in name_l or "paper" in name_l: return "paper"
    if "hdpe" in name_l: return "hdpe"
    if "pp" in name_l: return "pp"
    return "pet"


def _normalize(values: List[float]) -> List[float]:
    """Min-max normalize a list of floats to [0, 1]."""
    if not values:
        return []
    mn, mx = min(values), max(values)
    if mx == mn:
        return [0.5] * len(values)
    return [(v - mn) / (mx - mn) for v in values]


def score_and_rank(
    materials: List[PackagingMaterial],
    food_profile: FoodProfile = None,
    transit_route: str = "local",
) -> List[Dict[str, Any]]:
    """
    Score and rank packaging materials using Physics-Informed Multi-Objective Optimization (MOO).

    Args:
        materials: FSSAI-compliant, barrier-matched candidate materials.
        food_profile: The target food profile (category, form, OTR/WVTR requirements).
        transit_route: "local" | "interstate" | "cold_chain"

    Returns:
        List of dicts (up to 3) sorted by MOO score desc with rank assigned.
    """
    if not materials:
        return []

    category = food_profile.category if food_profile else "Fresh Produce"
    form = food_profile.form if food_profile else "Whole"

    # Step 1: Compute physics, Arrhenius shelf life, and sustainability for each material
    evaluations = []
    for mat in materials:
        slug = _slugify(mat.name)
        
        # Arrhenius kinetics: temperature-adjusted shelf life
        adj_days, rate_factor, range_str = calculate_arrhenius_shelf_life(
            base_days=mat.shelf_life_days,
            transit_route=transit_route,
        )
        
        # Physics compatibility & penalisation (anaerobic suffocation, lipid oxidation)
        phys_comp = evaluate_physics_compatibility(
            category=category,
            form=form,
            material_name=mat.name,
            material_slug=slug,
            otr_class=mat.otr_class.value,
            wvtr_class=mat.wvtr_class.value,
        )
        
        # Eco-Sustainability rating (1.0 to 10.0 scale)
        sust_score = get_sustainability_score(slug)

        evaluations.append({
            "material": mat,
            "slug": slug,
            "cost_inr": float(mat.cost_per_unit_inr),
            "base_shelf_days": mat.shelf_life_days,
            "arrhenius_days": adj_days,
            "arrhenius_days_int": max(1, int(round(adj_days))),
            "arrhenius_range": range_str,
            "rate_factor": rate_factor,
            "sustainability_score": sust_score,
            "penalty_multiplier": phys_comp["penalty_multiplier"],
            "anaerobic_suffocation_flag": phys_comp["anaerobic_suffocation_flag"],
            "lipid_oxidation_flag": phys_comp["lipid_oxidation_flag"],
            "physics_rationale": phys_comp["physics_rationale"],
        })

    # Step 2: Build multi-objective vectors [f_shelf, f_cost, f_sust, f_phys]
    costs = [e["cost_inr"] for e in evaluations]
    shelf_lives = [e["arrhenius_days"] for e in evaluations]
    susts = [e["sustainability_score"] for e in evaluations]

    norm_costs = _normalize(costs)
    norm_shelves = _normalize(shelf_lives)
    norm_susts = [s / 10.0 for s in susts]

    for i, e in enumerate(evaluations):
        # f1: Shelf-life protection utility (higher is better)
        e["f_shelf"] = norm_shelves[i]
        # f2: Cost efficiency utility (lower cost is better -> 1 - norm_cost)
        e["f_cost"] = 1.0 - norm_costs[i]
        # f3: Eco-sustainability utility (higher is better)
        e["f_sust"] = norm_susts[i]
        # f4: Physics fit factor (higher is better)
        e["f_phys"] = e["penalty_multiplier"]

    # Step 3: Pareto Dominance Classification
    n = len(evaluations)
    for i in range(n):
        e_i = evaluations[i]
        is_dominated = False
        vec_i = (e_i["f_shelf"], e_i["f_cost"], e_i["f_sust"], e_i["f_phys"])

        for j in range(n):
            if i == j:
                continue
            e_j = evaluations[j]
            vec_j = (e_j["f_shelf"], e_j["f_cost"], e_j["f_sust"], e_j["f_phys"])

            # Candidate j dominates i if j is >= i in all objectives and strictly > in at least one
            if all(v_j >= v_i for v_j, v_i in zip(vec_j, vec_i)) and any(v_j > v_i for v_j, v_i in zip(vec_j, vec_i)):
                is_dominated = True
                break

        e_i["is_pareto_optimal"] = not is_dominated

    # Step 4: Scalarized Multi-Attribute Utility Function (MOO Compromise Scoring)
    # Weights: Shelf Life (35%), Cost Efficiency (30%), Eco-Sustainability (20%), Physics Fit (15%)
    W_SHELF, W_COST, W_SUST, W_PHYS = 0.35, 0.30, 0.20, 0.15

    for e in evaluations:
        raw_utility = (
            W_SHELF * e["f_shelf"] +
            W_COST * e["f_cost"] +
            W_SUST * e["f_sust"] +
            W_PHYS * e["f_phys"]
        )

        # Pareto frontier bonus
        pareto_bonus = 0.05 if e["is_pareto_optimal"] else 0.0
        
        # Apply physics safety penalty multiplier
        moo_score = (raw_utility + pareto_bonus) * e["penalty_multiplier"]
        
        # Normalize and clip score to [0.05, 0.98] unless penalty is 0.0
        if e["penalty_multiplier"] == 0.0:
            final_score = 0.0
        else:
            final_score = round(min(0.98, max(0.05, moo_score)), 4)

        e["moo_score"] = final_score

    # Step 5: Sort descending by MOO score, pick top 3
    evaluations.sort(key=lambda x: x["moo_score"], reverse=True)
    top3 = evaluations[:3]

    results = []
    for rank, item in enumerate(top3, start=1):
        results.append({
            "material": item["material"],
            "score": item["moo_score"],
            "rank": rank,
            "arrhenius_days": item["arrhenius_days_int"],
            "arrhenius_range": item["arrhenius_range"],
            "physics_rationale": item["physics_rationale"],
            "sustainability_score": item["sustainability_score"],
            "is_pareto_optimal": item["is_pareto_optimal"],
        })

    return results

