"""
searcher.py — 3-layer hybrid food search engine.

Layer 1: Exact match in keyword dictionary (case-insensitive, stripped)
Layer 2: Fuzzy match using rapidfuzz (handles typos, partial words)
Layer 3: Return top-N ranked suggestions with confidence scores

Supports all 10 Indian languages in keyword_map.py.
"""
from typing import List, Dict, Any
from rapidfuzz import process, fuzz
from app.food_search.keyword_map import FOOD_KEYWORD_MAP

# Pre-build a list of all keys for fuzzy matching
ALL_KEYS = list(FOOD_KEYWORD_MAP.keys())

FUZZY_THRESHOLD = 60   # Minimum similarity score (0-100) to include a result
MAX_RESULTS = 5        # Maximum suggestions to return


def search_food(query: str) -> List[Dict[str, Any]]:
    """
    Search for food products across all languages.
    """
    if not query or not query.strip():
        return []

    q = query.strip().lower()
    results = []
    seen = set()  # Deduplicate by (category, form)

    CATEGORY_FORMS = {
        "Fresh Produce": ["Whole", "Cut/Processed"],
        "Dairy": ["Liquid", "Whole"],
        "Dry Snacks": ["Whole", "Powder"],
        "Meat": ["Whole", "Cut/Processed"]
    }

    def add_result(display_name, category, form, confidence, matched_keyword):
        key = (category, form)
        if key not in seen:
            seen.add(key)
            results.append({
                "food_name": display_name if form == "Whole" or form == "Liquid" else f"{display_name} ({form})",
                "category": category,
                "form": form,
                "confidence": confidence,
                "matched_keyword": matched_keyword,
            })

    # ─── Layer 1: Exact match ─────────────────────────────────────────────────
    if q in FOOD_KEYWORD_MAP:
        display, category, _ = FOOD_KEYWORD_MAP[q]
        for f in CATEGORY_FORMS.get(category, ["Whole"]):
            add_result(display, category, f, 1.0, q)

    if query.strip() in FOOD_KEYWORD_MAP:
        display, category, _ = FOOD_KEYWORD_MAP[query.strip()]
        for f in CATEGORY_FORMS.get(category, ["Whole"]):
            add_result(display, category, f, 1.0, query.strip())

    if len(results) >= MAX_RESULTS:
        return results[:MAX_RESULTS]

    # ─── Layer 2: Fuzzy match ─────────────────────────────────────────────────
    # Use token_set_ratio to handle partial matches and word order differences
    fuzzy_matches = process.extract(
        q,
        ALL_KEYS,
        scorer=fuzz.token_set_ratio,
        limit=20,
    )

    for matched_key, score, _ in fuzzy_matches:
        if score < FUZZY_THRESHOLD:
            continue
        display, category, _ = FOOD_KEYWORD_MAP[matched_key]
        for f in CATEGORY_FORMS.get(category, ["Whole"]):
            add_result(display, category, f, round(score / 100, 2), matched_key)
        if len(results) >= MAX_RESULTS:
            break

    # Sort by confidence descending
    results.sort(key=lambda x: x["confidence"], reverse=True)
    return results[:MAX_RESULTS]
