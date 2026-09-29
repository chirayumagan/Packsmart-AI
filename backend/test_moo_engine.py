"""
test_moo_engine.py — Direct test script for Physics-Informed Multi-Objective Optimization (MOO) Engine.
"""
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from app.database import SessionLocal
from app.models import FoodProfile, PackagingMaterial
from app.engine.rule_filter import apply_rules
from app.engine.ml_scorer import score_and_rank

db = SessionLocal()

scenarios = [
    ("Fresh Produce", "Cut/Processed", "local"),
    ("Fresh Produce", "Whole", "local"),
    ("Dry Snacks", "Whole", "interstate"),
    ("Dairy", "Liquid", "cold_chain"),
    ("Meat", "Cut/Processed", "interstate"),
]

print("======================================================================")
print("     PACKSMART AI — PHYSICS-INFORMED MOO ENGINE VALIDATION TEST       ")
print("======================================================================\n")

for cat, form, route in scenarios:
    food_profile = db.query(FoodProfile).filter_by(category=cat, form=form).first()
    if not food_profile:
        print(f"FAILED: No FoodProfile for {cat} - {form}")
        continue

    all_materials = db.query(PackagingMaterial).all()
    filtered = apply_rules(food_profile, all_materials, route)
    ranked = score_and_rank(filtered, food_profile, route)

    print(f"--- Scenario: [{cat} | {form} | Route: {route}] ---")
    print(f"Filtered materials count: {len(filtered)}")
    for r in ranked:
        mat = r["material"]
        print(
            f"  Rank #{r['rank']} | {mat.name} (ID: {mat.id})\n"
            f"     Score: {r['score']} | Arrhenius Shelf Life: {r['arrhenius_days']} days ({r['arrhenius_range']})\n"
            f"     Cost: Rs.{mat.cost_per_unit_inr} | Sustainability: {r['sustainability_score']}/10 | Pareto Optimal: {r['is_pareto_optimal']}\n"
            f"     Physics Note: {r['physics_rationale']}\n"
        )
    print()

db.close()
