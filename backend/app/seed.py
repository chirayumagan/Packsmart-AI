"""
seed.py — Idempotent database seed script for PackSmart AI (Supabase/PostgreSQL).

The tables and ENUM types are already created by Supabase migrations.
This script only inserts data if rows don't already exist (ON CONFLICT DO NOTHING).

Usage (from backend/ directory with venv activated):
  python -m app.seed
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Step 1: Import ORM models
# ---------------------------------------------------------------------------
from sqlalchemy import text
from app.database import engine
from app.models import FoodProfile, PackagingMaterial, Commodity, Supplier, BarrierClass, MoistureLevel, RespirationRate
from sqlalchemy.orm import Session

# ---------------------------------------------------------------------------
# Step 2: Verify connectivity (no CREATE DATABASE — Supabase manages this)
# ---------------------------------------------------------------------------
try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("[seed] Connected to Supabase PostgreSQL successfully.")
except Exception as e:
    print(f"[seed] ERROR connecting to database: {e}")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Step 3: Seed food_profiles (8 realistic combinations — idempotent)
# ---------------------------------------------------------------------------
food_profiles = [
    FoodProfile(
        category="Fresh Produce", form="Whole",
        moisture_level=MoistureLevel.high,
        respiration_rate=RespirationRate.high,
        required_otr_class=BarrierClass.low_barrier,
        required_wvtr_class=BarrierClass.low_barrier,
    ),
    FoodProfile(
        category="Fresh Produce", form="Cut/Processed",
        moisture_level=MoistureLevel.high,
        respiration_rate=RespirationRate.high,
        required_otr_class=BarrierClass.medium_barrier,
        required_wvtr_class=BarrierClass.medium_barrier,
    ),
    FoodProfile(
        category="Dairy", form="Liquid",
        moisture_level=MoistureLevel.high,
        respiration_rate=RespirationRate.none,
        required_otr_class=BarrierClass.high_barrier,
        required_wvtr_class=BarrierClass.high_barrier,
    ),
    FoodProfile(
        category="Dairy", form="Whole",
        moisture_level=MoistureLevel.medium,
        respiration_rate=RespirationRate.none,
        required_otr_class=BarrierClass.high_barrier,
        required_wvtr_class=BarrierClass.medium_barrier,
    ),
    FoodProfile(
        category="Dry Snacks", form="Whole",
        moisture_level=MoistureLevel.low,
        respiration_rate=RespirationRate.none,
        required_otr_class=BarrierClass.medium_barrier,
        required_wvtr_class=BarrierClass.medium_barrier,
    ),
    FoodProfile(
        category="Dry Snacks", form="Powder",
        moisture_level=MoistureLevel.low,
        respiration_rate=RespirationRate.none,
        required_otr_class=BarrierClass.high_barrier,
        required_wvtr_class=BarrierClass.high_barrier,
    ),
    FoodProfile(
        category="Meat", form="Whole",
        moisture_level=MoistureLevel.high,
        respiration_rate=RespirationRate.medium,
        required_otr_class=BarrierClass.high_barrier,
        required_wvtr_class=BarrierClass.high_barrier,
    ),
    FoodProfile(
        category="Meat", form="Cut/Processed",
        moisture_level=MoistureLevel.high,
        respiration_rate=RespirationRate.low,
        required_otr_class=BarrierClass.high_barrier,
        required_wvtr_class=BarrierClass.high_barrier,
    ),
]

# ---------------------------------------------------------------------------
# Step 4: Seed packaging_materials (10 materials — 1 deliberately non-FSSAI)
# ---------------------------------------------------------------------------
packaging_materials = [
    PackagingMaterial(
        name="Micro-perforated BOPP Film",
        description="Allows vital oxygen exchange and prevents CO2/moisture build-up to stop anaerobic spoilage. Ideal for local delivery.",
        otr_class=BarrierClass.low_barrier,
        wvtr_class=BarrierClass.low_barrier,
        cost_per_unit_inr=1.50,
        shelf_life_days=15,
        is_fssai_approved=True,
        suitable_transit="local",
    ),
    PackagingMaterial(
        name="Modified Atmosphere Packaging (MAP) Film",
        description="This smart film locks in the right mix of gases around your produce, "
                    "slowing down spoilage significantly during inter-state truck journeys of 2-4 days.",
        otr_class=BarrierClass.medium_barrier,
        wvtr_class=BarrierClass.medium_barrier,
        cost_per_unit_inr=3.20,
        shelf_life_days=21,
        is_fssai_approved=True,
        suitable_transit="local,interstate",
    ),
    PackagingMaterial(
        name="Multi-layer Retort Pouch",
        description="A high-strength pouch that can withstand heat sterilisation. "
                    "Completely blocks oxygen and moisture — perfect for processed meats, dairy, or wet foods "
                    "that need a very long shelf life.",
        otr_class=BarrierClass.high_barrier,
        wvtr_class=BarrierClass.high_barrier,
        cost_per_unit_inr=8.00,
        shelf_life_days=180,
        is_fssai_approved=True,
        suitable_transit="local,interstate,cold_chain",
    ),
    PackagingMaterial(
        name="HDPE Woven Sack",
        description="A tough woven plastic sack ideal for bulk dry produce like whole grains or "
                    "root vegetables for very short local hauls. Low cost, high puncture resistance.",
        otr_class=BarrierClass.low_barrier,
        wvtr_class=BarrierClass.low_barrier,
        cost_per_unit_inr=0.80,
        shelf_life_days=7,
        is_fssai_approved=True,
        suitable_transit="local",
    ),
    PackagingMaterial(
        name="Aluminium Foil Laminate",
        description="The gold standard for barrier protection. This metalised laminate blocks "
                    "100% of oxygen, moisture, and light — ideal for powdered dairy, spices, and "
                    "processed foods that need very long shelf life.",
        otr_class=BarrierClass.high_barrier,
        wvtr_class=BarrierClass.high_barrier,
        cost_per_unit_inr=6.50,
        shelf_life_days=365,
        is_fssai_approved=True,
        suitable_transit="local,interstate,cold_chain",
    ),
    PackagingMaterial(
        name="PP Twist Film",
        description="A semi-rigid polypropylene film that provides moderate moisture and oxygen "
                    "protection. Great for dry snacks, namkeen, and biscuits during interstate transport.",
        otr_class=BarrierClass.medium_barrier,
        wvtr_class=BarrierClass.medium_barrier,
        cost_per_unit_inr=2.10,
        shelf_life_days=30,
        is_fssai_approved=True,
        suitable_transit="local,interstate",
    ),
    PackagingMaterial(
        name="PET/PE Laminate Pouch",
        description="A strong, clear laminate pouch with high barrier properties. "
                    "Used widely for packaged paneer, cut meat, and liquid dairy. "
                    "Maintains seal integrity even in cold chain transport.",
        otr_class=BarrierClass.high_barrier,
        wvtr_class=BarrierClass.high_barrier,
        cost_per_unit_inr=4.20,
        shelf_life_days=90,
        is_fssai_approved=True,
        suitable_transit="local,interstate,cold_chain",
    ),
    PackagingMaterial(
        name="Kraft Paper Bag",
        description="A simple, eco-friendly paper bag suitable for very short local delivery of "
                    "dry goods like peanuts or whole spices. Biodegradable but offers minimal barrier protection.",
        otr_class=BarrierClass.low_barrier,
        wvtr_class=BarrierClass.low_barrier,
        cost_per_unit_inr=0.60,
        shelf_life_days=5,
        is_fssai_approved=True,
        suitable_transit="local",
    ),
    PackagingMaterial(
        name="Industrial Shrink Wrap (Non-Food Grade)",
        description="[NOT FOR FOOD USE] Industrial-grade shrink wrap not cleared for food contact. "
                    "Included only to demonstrate FSSAI hard-gate filtering.",
        otr_class=BarrierClass.high_barrier,
        wvtr_class=BarrierClass.high_barrier,
        cost_per_unit_inr=1.20,
        shelf_life_days=999,
        is_fssai_approved=False,
        suitable_transit="local,interstate,cold_chain",
    ),
    PackagingMaterial(
        name="Bio-degradable PLA Film",
        description="An eco-friendly plant-based film that offers medium barrier protection. "
                    "A great sustainable choice for dry snacks and whole produce with moderate "
                    "transit distances. Compostable after use.",
        otr_class=BarrierClass.medium_barrier,
        wvtr_class=BarrierClass.medium_barrier,
        cost_per_unit_inr=5.00,
        shelf_life_days=14,
        is_fssai_approved=True,
        suitable_transit="local,interstate",
    ),
]

# ---------------------------------------------------------------------------
# Step 5: Insert food_profiles and packaging_materials (skip if exists)
# ---------------------------------------------------------------------------
with Session(engine) as session:
    # Use merge-on-name for packaging_materials (unique constraint on name)
    for fp in food_profiles:
        exists = (
            session.query(FoodProfile)
            .filter_by(category=fp.category, form=fp.form)
            .first()
        )
        if not exists:
            session.add(fp)

    for pm in packaging_materials:
        exists = session.query(PackagingMaterial).filter_by(name=pm.name).first()
        if not exists:
            session.add(pm)

    session.commit()

print(f"[seed] food_profiles: up to {len(food_profiles)} rows ensured.")
print(f"[seed] packaging_materials: up to {len(packaging_materials)} rows ensured.")

# ---------------------------------------------------------------------------
# Step 6: Seed 15+ Indian Commodities
# ---------------------------------------------------------------------------
with Session(engine) as session:
    commodities = [
        Commodity(name='Alphonso Mango / Hapus', description='High ethylene, sensitive to CO2 accumulation', category='Fresh Produce', form='Whole'),
        Commodity(name='Nashik Red Onion / Pyaaz', description='Low moisture, needs high ventilation/breathability', category='Fresh Produce', form='Whole'),
        Commodity(name='Desi Tomato', description='High moisture, moderate respiration, sensitive to mold', category='Fresh Produce', form='Whole'),
        Commodity(name='Shimla Apple', description='Cold storage friendly, high skin sensitivity', category='Fresh Produce', form='Whole'),
        Commodity(name='Fresh Button Mushroom', description='Extremely high respiration, requires anti-fog micro-perforation', category='Fresh Produce', form='Whole'),
        Commodity(name='Fresh Malai Paneer', description='High water activity, prone to yeast/mold, needs vacuum/gas flush', category='Dairy', form='Solid / Block'),
        Commodity(name='Desi Ghee / Butter', description='High fat content, vulnerable to photo-oxidation and rancidity', category='Dairy', form='Liquid'),
        Commodity(name='Mawa / Khoya', description='Moderate moisture, short ambient life, needs high barrier pouch', category='Dairy', form='Solid / Block'),
        Commodity(name='Bikaneri Aloo Bhujia / Namkeen', description='High fat, crispy, strictly needs < 1 g/m2/day WVTR', category='Dry Snacks', form='Whole / Loose'),
        Commodity(name='Roasted Makhana (Fox Nuts)', description='Highly hygroscopic, prone to moisture absorption', category='Dry Snacks', form='Whole / Loose'),
        Commodity(name='Chakki Fresh Atta (Wheat Flour)', description='Dry powder, needs moisture resistance and insect barrier', category='Dry Snacks', form='Powder / Ground'),
        Commodity(name='Export Quality Basmati Rice', description='Low moisture, needs heavy-gauge puncture resistance', category='Dry Snacks', form='Whole / Loose'),
        Commodity(name='Guntur Red Chilli Powder', description='Sensitive to color fading from light and volatile oil loss', category='Dry Snacks', form='Powder / Ground'),
        Commodity(name='Salem Turmeric (Haldi Powder)', description='Light-sensitive curcumin protection', category='Dry Snacks', form='Powder / Ground'),
    ]
    for c in commodities:
        exists = session.query(Commodity).filter_by(name=c.name).first()
        if not exists:
            session.add(c)

    # ---------------------------------------------------------------------------
    # Step 7: Seed Suppliers
    # ---------------------------------------------------------------------------
    suppliers = [
        Supplier(name='EcoPack Industries', location='Vapi, Gujarat', specialization='Biodegradable PLA & Kraft Paper Laminates', moq=3000, is_fssai_verified=True, is_bis_certified=True, material_ids='pla'),
        Supplier(name='Bharat FlexiFilms', location='Daman & Diu', specialization='Multi-layer Met-PET & Vacuum Pouches', moq=10000, is_fssai_verified=True, is_bis_certified=False, material_ids='met-pet'),
        Supplier(name='Maratha Packaging Solutions', location='Pune, Maharashtra', specialization='Micro-perforated BOPP & Anti-fog Films', moq=5000, is_fssai_verified=True, is_bis_certified=True, material_ids='bopp'),
        Supplier(name='Ganga Polyfilms', location='Faridabad, NCR', specialization='Heavy-duty LDPE & Grain Storage Liners', moq=2500, is_fssai_verified=True, is_bis_certified=False, material_ids='ldpe'),
        Supplier(name='Deccan EcoWraps', location='Coimbatore, Tamil Nadu', specialization='Compostable Cassava/Cornstarch Bags', moq=1000, is_fssai_verified=True, is_bis_certified=True, material_ids='pla'),
    ]
    for s in suppliers:
        exists = session.query(Supplier).filter_by(name=s.name).first()
        if not exists:
            session.add(s)

    session.commit()
    print(f'[seed] commodities: up to {len(commodities)} rows ensured.')
    print(f'[seed] suppliers: up to {len(suppliers)} rows ensured.')

print("[seed] SUCCESS! Supabase database seeding complete!")
