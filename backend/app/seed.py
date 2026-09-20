"""
seed.py — Database seed script for PackSmart AI.

Run this once to:
  1. Create the MySQL database (if not exists).
  2. Drop & recreate all tables (clean slate).
  3. Insert realistic mock data for food_profiles and packaging_materials.

Usage (from backend/ directory with venv activated):
  python -m app.seed
"""
import os
import sys
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Step 0: Create the database itself (connect without specifying a DB name)
# ---------------------------------------------------------------------------
load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "packsmart_db")

import pymysql
from urllib.parse import quote_plus  # noqa: F401 (used for DATABASE_URL in database.py)

try:
    conn = pymysql.connect(host=DB_HOST, port=int(DB_PORT), user=DB_USER, password=DB_PASSWORD)
    with conn.cursor() as cur:
        cur.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    conn.commit()
    conn.close()
    print(f"[seed] Database '{DB_NAME}' ensured.")
except Exception as e:
    print(f"[seed] ERROR creating database: {e}")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Step 1: Import ORM models (now that DB exists)
# ---------------------------------------------------------------------------
from sqlalchemy import text
from app.database import engine, Base
from app.models import FoodProfile, PackagingMaterial, Commodity, Supplier, BarrierClass, MoistureLevel, RespirationRate
from sqlalchemy.orm import Session

# ---------------------------------------------------------------------------
# Step 2: Drop & recreate all tables
# ---------------------------------------------------------------------------
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("[seed] Tables dropped and recreated.")

# ---------------------------------------------------------------------------
# Step 3: Seed food_profiles (8 realistic combinations)
# ---------------------------------------------------------------------------
food_profiles = [
    FoodProfile(
        category="Fresh Produce", form="Whole",
        moisture_level=MoistureLevel.high,
        respiration_rate=RespirationRate.high,
        required_otr_class=BarrierClass.low_barrier,   # needs gas exchange — breathable film
        required_wvtr_class=BarrierClass.low_barrier,
    ),
    FoodProfile(
        category="Fresh Produce", form="Cut/Processed",
        moisture_level=MoistureLevel.high,
        respiration_rate=RespirationRate.high,
        required_otr_class=BarrierClass.medium_barrier,  # cut surface needs more protection
        required_wvtr_class=BarrierClass.medium_barrier,
    ),
    FoodProfile(
        category="Dairy", form="Liquid",
        moisture_level=MoistureLevel.high,
        respiration_rate=RespirationRate.none,
        required_otr_class=BarrierClass.high_barrier,   # no oxygen — prevents oxidation & spoilage
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
        required_otr_class=BarrierClass.high_barrier,   # powder oxidises quickly
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
        is_fssai_approved=False,   # ← HARD EXCLUDED
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
# Step 5: Insert all rows
# ---------------------------------------------------------------------------
with Session(engine) as session:
    session.add_all(food_profiles)
    session.add_all(packaging_materials)
    session.commit()

print(f"[seed] Inserted {len(food_profiles)} food profiles.")
print(f"[seed] Inserted {len(packaging_materials)} packaging materials.")
print("[seed] SUCCESS! Database seeding complete!")

# ---------------------------------------------------------------------------
# Step 6: Seed 15+ Indian Commodities
# ---------------------------------------------------------------------------
with Session(engine) as session:
    commodities = [
        # Fresh Produce
        Commodity(name='Alphonso Mango / Hapus', description='High ethylene, sensitive to CO2 accumulation', category='Fresh Produce', form='Whole'),
        Commodity(name='Nashik Red Onion / Pyaaz', description='Low moisture, needs high ventilation/breathability', category='Fresh Produce', form='Whole'),
        Commodity(name='Desi Tomato', description='High moisture, moderate respiration, sensitive to mold', category='Fresh Produce', form='Whole'),
        Commodity(name='Shimla Apple', description='Cold storage friendly, high skin sensitivity', category='Fresh Produce', form='Whole'),
        Commodity(name='Fresh Button Mushroom', description='Extremely high respiration, requires anti-fog micro-perforation', category='Fresh Produce', form='Whole'),
        # Dairy & Traditional Sweets
        Commodity(name='Fresh Malai Paneer', description='High water activity, prone to yeast/mold, needs vacuum/gas flush', category='Dairy', form='Solid / Block'),
        Commodity(name='Desi Ghee / Butter', description='High fat content, vulnerable to photo-oxidation and rancidity', category='Dairy', form='Liquid'),
        Commodity(name='Mawa / Khoya', description='Moderate moisture, short ambient life, needs high barrier pouch', category='Dairy', form='Solid / Block'),
        # Snacks, Bakery & Dry Commodities
        Commodity(name='Bikaneri Aloo Bhujia / Namkeen', description='High fat, crispy, strictly needs < 1 g/m2/day WVTR', category='Dry Snacks', form='Whole / Loose'),
        Commodity(name='Roasted Makhana (Fox Nuts)', description='Highly hygroscopic, prone to moisture absorption', category='Dry Snacks', form='Whole / Loose'),
        Commodity(name='Chakki Fresh Atta (Wheat Flour)', description='Dry powder, needs moisture resistance and insect barrier', category='Dry Snacks', form='Powder / Ground'),
        Commodity(name='Export Quality Basmati Rice', description='Low moisture, needs heavy-gauge puncture resistance', category='Dry Snacks', form='Whole / Loose'),
        # Spices & Grains
        Commodity(name='Guntur Red Chilli Powder', description='Sensitive to color fading from light and volatile oil loss', category='Dry Snacks', form='Powder / Ground'),
        Commodity(name='Salem Turmeric (Haldi Powder)', description='Light-sensitive curcumin protection', category='Dry Snacks', form='Powder / Ground'),
    ]
    session.add_all(commodities)

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
    session.add_all(suppliers)
    session.commit()
    print(f'[seed] Inserted {len(commodities)} commodities and {len(suppliers)} suppliers.')

