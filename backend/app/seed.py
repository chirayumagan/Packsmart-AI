"""
seed.py — Idempotent database seed script for PackSmart AI (Supabase/PostgreSQL).

The tables and ENUM types are already created by Supabase migrations.
This script only inserts data if rows don't already exist (query-before-insert).

Scientific data sources:
  - FSSAI Food Safety & Standards Act 2006 + FSS Regulations
  - ICAR Post-Harvest Technology of Horticultural Crops (2018)
  - NHB Cold Chain Guidelines 2022
  - CIPHET Packaging Standards for Agricultural Commodities
  - Codex CAC/RCP 44-1995 (Code of Hygienic Practice for Refrigerated Packed Foods)

Usage (from backend/ directory with venv activated):
  python -m app.seed
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

from sqlalchemy import text
from app.database import engine
from app.models import (
    FoodProfile, PackagingMaterial, Commodity, Supplier,
    BarrierClass, MoistureLevel, RespirationRate,
)
from sqlalchemy.orm import Session

# ---------------------------------------------------------------------------
# Connectivity check
# ---------------------------------------------------------------------------
try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("[seed] Connected to Supabase PostgreSQL successfully.")
except Exception as e:
    print(f"[seed] ERROR connecting to database: {e}")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _upsert_commodity(session: Session, c: Commodity):
    """Insert commodity only if name doesn't already exist."""
    exists = session.query(Commodity).filter_by(name=c.name).first()
    if not exists:
        session.add(c)


# ---------------------------------------------------------------------------
# food_profiles (8 rows — idempotent)
# ---------------------------------------------------------------------------
food_profiles = [
    FoodProfile(category="Fresh Produce", form="Whole",         moisture_level=MoistureLevel.high,   respiration_rate=RespirationRate.high,   required_otr_class=BarrierClass.low_barrier,    required_wvtr_class=BarrierClass.low_barrier),
    FoodProfile(category="Fresh Produce", form="Cut/Processed", moisture_level=MoistureLevel.high,   respiration_rate=RespirationRate.high,   required_otr_class=BarrierClass.medium_barrier, required_wvtr_class=BarrierClass.medium_barrier),
    FoodProfile(category="Dairy",         form="Liquid",        moisture_level=MoistureLevel.high,   respiration_rate=RespirationRate.none,   required_otr_class=BarrierClass.high_barrier,   required_wvtr_class=BarrierClass.high_barrier),
    FoodProfile(category="Dairy",         form="Whole",         moisture_level=MoistureLevel.medium, respiration_rate=RespirationRate.none,   required_otr_class=BarrierClass.high_barrier,   required_wvtr_class=BarrierClass.medium_barrier),
    FoodProfile(category="Dry Snacks",    form="Whole",         moisture_level=MoistureLevel.low,    respiration_rate=RespirationRate.none,   required_otr_class=BarrierClass.medium_barrier, required_wvtr_class=BarrierClass.medium_barrier),
    FoodProfile(category="Dry Snacks",    form="Powder",        moisture_level=MoistureLevel.low,    respiration_rate=RespirationRate.none,   required_otr_class=BarrierClass.high_barrier,   required_wvtr_class=BarrierClass.high_barrier),
    FoodProfile(category="Meat",          form="Whole",         moisture_level=MoistureLevel.high,   respiration_rate=RespirationRate.medium, required_otr_class=BarrierClass.high_barrier,   required_wvtr_class=BarrierClass.high_barrier),
    FoodProfile(category="Meat",          form="Cut/Processed", moisture_level=MoistureLevel.high,   respiration_rate=RespirationRate.low,    required_otr_class=BarrierClass.high_barrier,   required_wvtr_class=BarrierClass.high_barrier),
]

# ---------------------------------------------------------------------------
# packaging_materials (10 rows — idempotent)
# ---------------------------------------------------------------------------
packaging_materials = [
    PackagingMaterial(name="Micro-perforated BOPP Film",                   description="Allows vital oxygen exchange and prevents CO2/moisture build-up to stop anaerobic spoilage. Ideal for local delivery.",                                                                    otr_class=BarrierClass.low_barrier,    wvtr_class=BarrierClass.low_barrier,    cost_per_unit_inr=1.50, shelf_life_days=15,  is_fssai_approved=True,  suitable_transit="local"),
    PackagingMaterial(name="Modified Atmosphere Packaging (MAP) Film",     description="This smart film locks in the right mix of gases around your produce, slowing down spoilage significantly during inter-state truck journeys of 2-4 days.",                                  otr_class=BarrierClass.medium_barrier, wvtr_class=BarrierClass.medium_barrier, cost_per_unit_inr=3.20, shelf_life_days=21,  is_fssai_approved=True,  suitable_transit="local,interstate"),
    PackagingMaterial(name="Multi-layer Retort Pouch",                     description="A high-strength pouch that can withstand heat sterilisation. Completely blocks oxygen and moisture — perfect for processed meats, dairy, or wet foods that need a very long shelf life.", otr_class=BarrierClass.high_barrier,   wvtr_class=BarrierClass.high_barrier,   cost_per_unit_inr=8.00, shelf_life_days=180, is_fssai_approved=True,  suitable_transit="local,interstate,cold_chain"),
    PackagingMaterial(name="HDPE Woven Sack",                              description="A tough woven plastic sack ideal for bulk dry produce like whole grains or root vegetables for very short local hauls. Low cost, high puncture resistance.",                              otr_class=BarrierClass.low_barrier,    wvtr_class=BarrierClass.low_barrier,    cost_per_unit_inr=0.80, shelf_life_days=7,   is_fssai_approved=True,  suitable_transit="local"),
    PackagingMaterial(name="Aluminium Foil Laminate",                      description="The gold standard for barrier protection. This metalised laminate blocks 100% of oxygen, moisture, and light — ideal for powdered dairy, spices, and processed foods needing long shelf life.", otr_class=BarrierClass.high_barrier, wvtr_class=BarrierClass.high_barrier,   cost_per_unit_inr=6.50, shelf_life_days=365, is_fssai_approved=True,  suitable_transit="local,interstate,cold_chain"),
    PackagingMaterial(name="PP Twist Film",                                description="A semi-rigid polypropylene film that provides moderate moisture and oxygen protection. Great for dry snacks, namkeen, and biscuits during interstate transport.",                        otr_class=BarrierClass.medium_barrier, wvtr_class=BarrierClass.medium_barrier, cost_per_unit_inr=2.10, shelf_life_days=30,  is_fssai_approved=True,  suitable_transit="local,interstate"),
    PackagingMaterial(name="PET/PE Laminate Pouch",                        description="A strong, clear laminate pouch with high barrier properties. Used widely for packaged paneer, cut meat, and liquid dairy. Maintains seal integrity even in cold chain transport.",       otr_class=BarrierClass.high_barrier,   wvtr_class=BarrierClass.high_barrier,   cost_per_unit_inr=4.20, shelf_life_days=90,  is_fssai_approved=True,  suitable_transit="local,interstate,cold_chain"),
    PackagingMaterial(name="Kraft Paper Bag",                              description="A simple, eco-friendly paper bag suitable for very short local delivery of dry goods like peanuts or whole spices. Biodegradable but offers minimal barrier protection.",                   otr_class=BarrierClass.low_barrier,    wvtr_class=BarrierClass.low_barrier,    cost_per_unit_inr=0.60, shelf_life_days=5,   is_fssai_approved=True,  suitable_transit="local"),
    PackagingMaterial(name="Industrial Shrink Wrap (Non-Food Grade)",      description="[NOT FOR FOOD USE] Industrial-grade shrink wrap not cleared for food contact. Included only to demonstrate FSSAI hard-gate filtering.",                                                   otr_class=BarrierClass.high_barrier,   wvtr_class=BarrierClass.high_barrier,   cost_per_unit_inr=1.20, shelf_life_days=999, is_fssai_approved=False, suitable_transit="local,interstate,cold_chain"),
    PackagingMaterial(name="Bio-degradable PLA Film",                      description="An eco-friendly plant-based film that offers medium barrier protection. A great sustainable choice for dry snacks and whole produce with moderate transit distances. Compostable after use.", otr_class=BarrierClass.medium_barrier, wvtr_class=BarrierClass.medium_barrier, cost_per_unit_inr=5.00, shelf_life_days=14, is_fssai_approved=True, suitable_transit="local,interstate"),
]

# ---------------------------------------------------------------------------
# Commodity helper dataclass (plain dict for readability)
# ---------------------------------------------------------------------------
def _c(name, desc, cat, form, aw, resp, otr_min, otr_max, wvtr_max, sl_days,
        co2_s, eth_s, fssai, p_cat, p_form):
    return Commodity(
        name=name, description=desc, category=cat, form=form,
        water_activity=aw, resp_rate_ml_kg_hr=resp,
        target_otr_min=otr_min, target_otr_max=otr_max, target_wvtr_max=wvtr_max,
        shelf_life_ambient_days=sl_days,
        co2_sensitivity=co2_s, ethylene_sensitivity=eth_s,
        fssai_ref=fssai, profile_category=p_cat, profile_form=p_form,
    )


# ---------------------------------------------------------------------------
# 56 Indian commodities — scientifically accurate
#   Columns: name, desc, category, form,
#            aw, resp_ml, otr_min, otr_max, wvtr_max, shelf_days,
#            co2_sensitivity, ethylene_sensitivity, fssai_ref,
#            profile_category, profile_form
# ---------------------------------------------------------------------------
commodities = [
    # ---- FRESH PRODUCE — WHOLE (15) ----
    _c('Alphonso Mango / Hapus',      'High ethylene producer, climacteric. Needs ethylene scavenger liner.',                                         'Fresh Produce','Whole',  0.970, 28.0,  800, 2500,  10.0,  5, 'medium',   'high',     'FSS(F&SA) Reg 2.3.5',    'Fresh Produce','Whole'),
    _c('Nashik Red Onion / Pyaaz',    'Low moisture, needs high ventilation/breathability.',                                                           'Fresh Produce','Whole',  0.920,  8.0, 5000,15000,  50.0, 21, 'high',     'low',      'FSS(F&SA) Reg 2.3.4',    'Fresh Produce','Whole'),
    _c('Desi Tomato',                 'High moisture, moderate respiration, sensitive to mold.',                                                       'Fresh Produce','Whole',  0.980, 20.0, 1500, 6000,  20.0,  4, 'low',      'medium',   'FSS(F&SA) Reg 2.3.6',    'Fresh Produce','Whole'),
    _c('Shimla Apple',                'Cold storage friendly, high skin sensitivity.',                                                                 'Fresh Produce','Whole',  0.970, 14.0, 1000, 3000,   8.0, 14, 'medium',   'high',     'FSS(F&SA) Reg 2.3.1',    'Fresh Produce','Whole'),
    _c('Fresh Button Mushroom',       'Extremely high respiration, requires anti-fog micro-perforation.',                                              'Fresh Produce','Whole',  0.990,180.0,  400, 1200,  15.0,  2, 'very_high','low',      'FSS(F&SA) Reg 2.3.27',   'Fresh Produce','Whole'),
    _c('Robusta Banana / Kela',       'High ethylene producer; needs scavenger liner to slow ripening.',                                              'Fresh Produce','Whole',  0.980, 35.0,  800, 2000,  10.0,  4, 'high',     'very_high','FSS(F&SA) Reg 2.3.3',    'Fresh Produce','Whole'),
    _c('Pomegranate Arils (Bhagwa)',  'High anthocyanin; MAP at 5% O2 / 10% CO2 extends colour and firmness.',                                        'Fresh Produce','Whole',  0.975, 22.0,  700, 1800,   8.0,  7, 'medium',   'low',      'FSS(F&SA) Reg 2.3.22',   'Fresh Produce','Whole'),
    _c('Guava (Allahabad Safeda)',    'Climacteric; strong ethylene burst at ripening. Anti-fog film needed.',                                         'Fresh Produce','Whole',  0.968, 45.0, 1200, 3500,  12.0,  3, 'medium',   'high',     'FSS(F&SA) Reg 2.3.11',   'Fresh Produce','Whole'),
    _c('Green Peas / Matar',          'Non-climacteric but very high respiration; micro-perforated BOPP.',                                             'Fresh Produce','Whole',  0.985, 90.0,  600, 1500,  12.0,  3, 'very_high','low',      'FSS(F&SA) Reg 2.3.17',   'Fresh Produce','Whole'),
    _c('Baby Spinach / Palak',        'Extremely high respiration; ethylene-sensitive yellowing. Anti-fog micro-perf needed.',                         'Fresh Produce','Whole',  0.992,160.0,  400, 1000,  18.0,  2, 'very_high','high',     'FSS(F&SA) Reg 2.3.28',   'Fresh Produce','Whole'),
    _c('Grape (Sharad Seedless)',     'SO2-sensitive; SO2-releasing pad + non-perforated high-barrier film for export.',                               'Fresh Produce','Whole',  0.972, 10.0,  500, 1500,   6.0,  7, 'high',     'low',      'FSS(F&SA) Reg 2.3.10',   'Fresh Produce','Whole'),
    _c('Sweet Corn / Bhutta',         'Converts sugars to starch rapidly; needs near-freezing cold chain and high-OTR film.',                          'Fresh Produce','Whole',  0.988,120.0, 1000, 3000,  20.0,  2, 'very_high','low',      'FSS(F&SA) Reg 2.3.19',   'Fresh Produce','Whole'),
    _c('Okra / Bhindi',               'Chilling-sensitive; loses green colour fast. Short shelf life — fast local dispatch.',                          'Fresh Produce','Whole',  0.982, 65.0,  800, 2000,  15.0,  2, 'high',     'medium',   'FSS(F&SA) Reg 2.3.20',   'Fresh Produce','Whole'),
    _c('Drumstick / Moringa Pods',    'Prone to moisture loss. Simple LDPE stretch wrap suffices for local haat.',                                     'Fresh Produce','Whole',  0.960, 30.0, 1500, 5000,  20.0,  3, 'low',      'low',      'FSS(F&SA) Reg 2.3.26',   'Fresh Produce','Whole'),
    _c('Lychee / Litchi (Shahi)',     'Pericarp browning in <24 h. Needs cold chain + N2-flushed high-barrier pouch.',                                 'Fresh Produce','Whole',  0.978, 35.0,  500, 1200,   8.0,  2, 'high',     'low',      'FSS(F&SA) Reg 2.3.23',   'Fresh Produce','Whole'),

    # ---- FRESH PRODUCE — CUT/PROCESSED (4) ----
    _c('Cut & Peeled Mango Slices',        'High browning risk; MAP at 3% O2/10% CO2 or ascorbic acid dip + vacuum.',                                'Fresh Produce','Cut/Processed', 0.983, 55.0,  300,  800,  6.0,  3, 'medium',   'medium',   'FSS(F&SA) Reg 2.3.5',    'Fresh Produce','Cut/Processed'),
    _c('Ready-to-Cook Mixed Sabzi',        'Diced potato, carrot, beans blend; high cut-surface browning and moisture loss.',                         'Fresh Produce','Cut/Processed', 0.978, 80.0,  400, 1000, 10.0,  4, 'high',     'medium',   'FSS(F&SA) Reg 2.3.28',   'Fresh Produce','Cut/Processed'),
    _c('Sliced Capsicum / Bell Pepper',    '5% O2 MAP preserves colour and crunch for 5 days.',                                                       'Fresh Produce','Cut/Processed', 0.980, 40.0,  400, 1000,  8.0,  5, 'medium',   'medium',   'FSS(F&SA) Reg 2.3.9',    'Fresh Produce','Cut/Processed'),
    _c('Minimally Processed Sprouts (Moong)', 'High microbial risk on cut surface; 100% N2 flush + <5 OTR barrier pouch.',                           'Fresh Produce','Cut/Processed', 0.990,120.0,  100,  400,  8.0,  2, 'very_high','low',      'FSS(F&SA) Reg 2.3.31',   'Fresh Produce','Cut/Processed'),

    # ---- DAIRY — LIQUID (4) ----
    _c('Toned Pasteurised Milk',           'pH 6.6; UHT-treated milk needs light-barrier + <5 OTR multilayer carton or pouch.',                       'Dairy','Liquid', 0.995,  0.0,    0,    3,  0.5,  7, 'low',      None,       'FSS(F&SA) Reg 2.1.1',    'Dairy','Liquid'),
    _c('Mango Lassi (Packaged)',           'pH ~4.0; fat oxidation needs <5 OTR; opaque barrier preferred.',                                          'Dairy','Liquid', 0.978,  0.0,    0,    5,  1.0, 10, 'low',      None,       'FSS(F&SA) Reg 2.1.6',    'Dairy','Liquid'),
    _c('Masala Chaas / Spiced Buttermilk', 'pH ~4.5; spice volatiles need barrier to retain aroma. CO2-flushed multilayer pouch.',                   'Dairy','Liquid', 0.990,  0.0,    0,    5,  0.8, 14, 'low',      None,       'FSS(F&SA) Reg 2.1.5',    'Dairy','Liquid'),
    _c('Desi Ghee / Butter',              'High fat; vulnerable to photo-oxidation and rancidity. Al-foil pouch mandatory.',                          'Dairy','Liquid', 0.080,  0.0,    0,    1,  0.3,270, 'low',      None,       'FSS(F&SA) Reg 2.1.3',    'Dairy','Liquid'),

    # ---- DAIRY — WHOLE (6) ----
    _c('Fresh Malai Paneer',              'High water activity; prone to yeast/mold; needs vacuum/gas flush.',                                         'Dairy','Whole',  0.975,  0.0,    1,    5,  1.5,  3, 'low',      None,       'FSS(F&SA) Reg 2.1.1',    'Dairy','Whole'),
    _c('Mawa / Khoya',                    'Moderate moisture; short ambient life; needs high barrier pouch.',                                           'Dairy','Whole',  0.820,  0.0,    1,    8,  3.0,  5, 'low',      None,       'FSS(F&SA) Reg 2.1.7',    'Dairy','Whole'),
    _c('Amul Processed Cheddar Cheese Block', 'pH ~5.3; high fat; light + O2 cause rancidity. Wax or vacuum barrier film needed.',                   'Dairy','Whole',  0.960,  0.0,    0,    5,  2.0,180, 'low',      None,       'FSS(F&SA) Reg 2.1.8',    'Dairy','Whole'),
    _c('UHT Sweetened Condensed Milk',    'High sugar (aw ~0.83); flexible pouch needs high OTR barrier.',                                             'Dairy','Liquid', 0.830,  0.0,    0,    2,  0.5,365, 'low',      None,       'FSS(F&SA) Reg 2.1.9',    'Dairy','Liquid'),
    _c('Shrikhand (Sweetened Strained Yoghurt)', 'aw ~0.89; short shelf life at ambient; high-barrier cup with foil-seal lid.',                      'Dairy','Whole',  0.890,  0.0,    0,    5,  2.0, 30, 'low',      None,       'FSS(F&SA) Reg 2.1.4',    'Dairy','Whole'),
    _c('Mishti Doi (Bengali Sweetened Curd)',    'High sugar stabiliser; PP cup or earthen pot acceptable.',                                         'Dairy','Whole',  0.930,  0.0,    0,    8,  3.0,  5, 'low',      None,       'FSS(F&SA) Reg 2.1.4',    'Dairy','Whole'),

    # ---- DRY SNACKS — WHOLE (8) ----
    _c('Bikaneri Aloo Bhujia / Namkeen', 'High fat, crispy; strictly needs <1 g/m2/day WVTR.',                                                        'Dry Snacks','Whole', 0.360,  0.0,   80,  400,  0.8,120, 'low',      None,       'FSS(F&SA) Reg 2.4.2',    'Dry Snacks','Whole'),
    _c('Roasted Makhana (Fox Nuts)',     'Highly hygroscopic; prone to moisture absorption.',                                                           'Dry Snacks','Whole', 0.310,  0.0,  150,  600,  1.5,180, 'low',      None,       'FSS(F&SA) Reg 2.4.5',    'Dry Snacks','Whole'),
    _c('Export Quality Basmati Rice',   'Low moisture; needs heavy-gauge puncture resistance.',                                                         'Dry Snacks','Whole', 0.650,  0.0,  300, 1800,  4.0,365, 'low',      None,       'FSS(F&SA) Reg 2.4.3',    'Dry Snacks','Whole'),
    _c('Roasted Peanuts / Moongphali',  'High fat; aflatoxin risk above aw 0.80. N2-flushed pouch.',                                                   'Dry Snacks','Whole', 0.410,  0.0,   80,  400,  1.5,180, 'low',      None,       'FSS(F&SA) Reg 2.4.6',    'Dry Snacks','Whole'),
    _c('Poha / Flattened Rice (Thick)', 'Hygroscopic starch; weevil risk at aw > 0.65. Insect-barrier + moisture control.',                            'Dry Snacks','Whole', 0.550,  0.0,  200,  800,  3.0,180, 'low',      None,       'FSS(F&SA) Reg 2.4.4',    'Dry Snacks','Whole'),
    _c('Jowar Puffed Sorghum / Murmura','Ultra-low aw; loses crunch rapidly on moisture ingress. Tight seal + desiccant.',                             'Dry Snacks','Whole', 0.250,  0.0,  300, 1000,  2.0, 90, 'low',      None,       'FSS(F&SA) Reg 2.4.5',    'Dry Snacks','Whole'),
    _c('Dried Figs / Anjeer (Nashik)',  'High sugar aw ~0.63; aflatoxin above 0.80. Medium-barrier transparent film.',                                 'Dry Snacks','Whole', 0.630,  0.0,  200, 1000,  5.0,180, 'low',      None,       'FSS(F&SA) Reg 2.3.25',   'Dry Snacks','Whole'),
    _c('Cashew Kernels W240 (Kerala)',  'High MUFA; rancidity onset at aw > 0.55. N2 flush + Al-foil laminate for export.',                            'Dry Snacks','Whole', 0.500,  0.0,   30,  150,  1.0,270, 'low',      None,       'FSS(F&SA) Reg 2.4.6',    'Dry Snacks','Whole'),

    # ---- DRY SNACKS — POWDER (8) ----
    _c('Chakki Fresh Atta (Wheat Flour)', 'Dry powder; needs moisture resistance and insect barrier.',                                                 'Dry Snacks','Powder', 0.620, 0.0,   80,  500,  2.5,180, 'low',      None,       'FSS(F&SA) Reg 2.4.1',    'Dry Snacks','Powder'),
    _c('Guntur Red Chilli Powder',       'Sensitive to colour fading from light and volatile oil loss.',                                               'Dry Snacks','Powder', 0.550, 0.0,    5,   40,  0.8,365, 'low',      None,       'FSS(F&SA) Reg 2.8.1',    'Dry Snacks','Powder'),
    _c('Salem Turmeric (Haldi Powder)',  'Light-sensitive curcumin protection.',                                                                       'Dry Snacks','Powder', 0.500, 0.0,    5,   40,  0.8,365, 'low',      None,       'FSS(F&SA) Reg 2.8.2',    'Dry Snacks','Powder'),
    _c('Coriander Powder / Dhania',      'Volatile terpene loss is the key failure mode; needs <50 OTR + WVTR <1 foil lam.',                          'Dry Snacks','Powder', 0.540, 0.0,    5,   50,  0.8,365, 'low',      None,       'FSS(F&SA) Reg 2.8.1',    'Dry Snacks','Powder'),
    _c('Garam Masala Blend',             'Multi-volatile blend; extremely low OTR threshold for aroma retention.',                                     'Dry Snacks','Powder', 0.400, 0.0,    2,   15,  0.5,365, 'low',      None,       'FSS(F&SA) Reg 2.8.5',    'Dry Snacks','Powder'),
    _c('CTC Assam Tea (Loose Leaf)',     'Moisture at aw > 0.65 triggers mould; tannin oxidises on O2 exposure.',                                     'Dry Snacks','Powder', 0.320, 0.0,    3,   20,  0.5,730, 'low',      None,       'FSS(F&SA) Reg 2.7.1',    'Dry Snacks','Powder'),
    _c('South Indian Filter Coffee Powder','CO2 degassing post-roast; needs one-way valve pouch + Al-foil barrier.',                                  'Dry Snacks','Powder', 0.350, 0.0,    1,    8,  0.4,365, 'low',      None,       'FSS(F&SA) Reg 2.7.2',    'Dry Snacks','Powder'),
    _c('Whole Milk Powder / SMP',        'Fat oxidation + caking above aw 0.40. N2-flushed Al-foil sachet mandatory.',                                'Dry Snacks','Powder', 0.270, 0.0,    1,   10,  0.3,365, 'low',      None,       'FSS(F&SA) Reg 2.1.10',   'Dry Snacks','Powder'),

    # ---- MEAT — WHOLE (4) ----
    _c('Broiler Chicken (Whole, Fresh)', 'pH 5.7–6.0; O2 >0.5% triggers aerobic spoilage within 24 h at ambient.',                                   'Meat','Whole', 0.993, 45.0,  0,    3,  1.5,  1, 'low',      None,       'FSS(F&SA) Reg 2.6.1',    'Meat','Whole'),
    _c('Goat Meat / Mutton Leg (Bone-in)','aw 0.99; myoglobin oxidation above 0.5% O2. MAP or vacuum pack.',                                         'Meat','Whole', 0.990, 30.0,  0,    3,  1.5,  2, 'low',      None,       'FSS(F&SA) Reg 2.6.2',    'Meat','Whole'),
    _c('Rohu / Catla Freshwater Fish',   'Extremely perishable; TMAO breakdown odour above 0°C within 12h.',                                          'Meat','Whole', 0.993, 55.0,  0,    2,  1.0,  1, 'low',      None,       'FSS(F&SA) Reg 2.6.4',    'Meat','Whole'),
    _c('Pomfret / Paplet (Marine, Iced)','Marine fish; CO2-enriched MAP at 40–60% CO2.',                                                              'Meat','Whole', 0.990, 45.0,  0,    3,  1.0,  2, 'low',      None,       'FSS(F&SA) Reg 2.6.4',    'Meat','Whole'),

    # ---- MEAT — CUT/PROCESSED (5) ----
    _c('Chicken Seekh Kebab (Cooked Frozen)', 'Cooked; residual aw ~0.97. Vacuum + high barrier.',                                                    'Meat','Cut/Processed', 0.972, 8.0,  0,   5,  2.0, 30, 'low',      None,       'FSS(F&SA) Reg 2.6.1',    'Meat','Cut/Processed'),
    _c('Mutton Keema / Minced Meat',          'Mincing increases surface area 10×; vacuum or MAP <0.5% O2.',                                          'Meat','Cut/Processed', 0.988,25.0,  0,   3,  1.5,  1, 'low',      None,       'FSS(F&SA) Reg 2.6.2',    'Meat','Cut/Processed'),
    _c('Vannamei Prawn / Shrimp (IQF)',       'IQF prawns; melanosis above aw 0.95. Na-metabisulphite + barrier.',                                   'Meat','Cut/Processed', 0.992, 0.0,  0,   2,  0.8, 90, 'low',      None,       'FSS(F&SA) Reg 2.6.5',    'Meat','Cut/Processed'),
    _c('Smoked Hilsa Fillet (Bengali Style)', 'Partial drying reduces aw to ~0.91; smoke phenolics provide antimicrobial effect.',                   'Meat','Cut/Processed', 0.910, 5.0,  0,   8,  2.5, 14, 'low',      None,       'FSS(F&SA) Reg 2.6.4',    'Meat','Cut/Processed'),
    _c('Chicken Nuggets (Breaded, Frozen)',   'Breaded coating absorbs moisture; WVTR control critical to maintain crunch on thaw.',                  'Meat','Cut/Processed', 0.960, 0.0,  0,   5,  1.5, 60, 'low',      None,       'FSS(F&SA) Reg 2.6.1',    'Meat','Cut/Processed'),
]

# ---------------------------------------------------------------------------
# Insert all commodities (idempotent)
# ---------------------------------------------------------------------------
with Session(engine) as session:
    for fp in food_profiles:
        if not session.query(FoodProfile).filter_by(category=fp.category, form=fp.form).first():
            session.add(fp)
    for pm in packaging_materials:
        if not session.query(PackagingMaterial).filter_by(name=pm.name).first():
            session.add(pm)
    for c in commodities:
        _upsert_commodity(session, c)
    session.commit()

total = len(commodities)
print(f"[seed] food_profiles:       up to 8  rows ensured.")
print(f"[seed] packaging_materials: up to 10 rows ensured.")
print(f"[seed] commodities:         up to {total} rows ensured.")

# ---------------------------------------------------------------------------
# Suppliers (5 rows — idempotent)
# ---------------------------------------------------------------------------
suppliers = [
    Supplier(name='EcoPack Industries',          location='Vapi, Gujarat',          specialization='Biodegradable PLA & Kraft Paper Laminates',    moq=3000,  is_fssai_verified=True, is_bis_certified=True,  material_ids='pla'),
    Supplier(name='Bharat FlexiFilms',           location='Daman & Diu',            specialization='Multi-layer Met-PET & Vacuum Pouches',          moq=10000, is_fssai_verified=True, is_bis_certified=False, material_ids='met-pet'),
    Supplier(name='Maratha Packaging Solutions', location='Pune, Maharashtra',       specialization='Micro-perforated BOPP & Anti-fog Films',        moq=5000,  is_fssai_verified=True, is_bis_certified=True,  material_ids='bopp'),
    Supplier(name='Ganga Polyfilms',             location='Faridabad, NCR',          specialization='Heavy-duty LDPE & Grain Storage Liners',        moq=2500,  is_fssai_verified=True, is_bis_certified=False, material_ids='ldpe'),
    Supplier(name='Deccan EcoWraps',             location='Coimbatore, Tamil Nadu',  specialization='Compostable Cassava/Cornstarch Bags',            moq=1000,  is_fssai_verified=True, is_bis_certified=True,  material_ids='pla'),
]

with Session(engine) as session:
    for s in suppliers:
        if not session.query(Supplier).filter_by(name=s.name).first():
            session.add(s)
    session.commit()

print(f"[seed] suppliers:           up to 5  rows ensured.")
print("[seed] SUCCESS! Supabase database seeding complete!")
