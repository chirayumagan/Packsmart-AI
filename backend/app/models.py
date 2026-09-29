"""
models.py — SQLAlchemy ORM models for PackSmart AI.

Tables:
  - food_profiles       : Maps user selections to hidden technical defaults.
  - packaging_materials : Materials with barrier classes, cost, shelf life.
  - commodities         : Specific Indian food commodities.
  - suppliers           : B2B Packaging Suppliers and Converters.

NOTE: PostgreSQL ENUM types are declared natively in the DB via migrations.
      SQLAlchemy maps them using Enum(..., native_enum=True) so they match
      the 'barrier_class', 'moisture_level', 'respiration_rate' PG types.
"""
from sqlalchemy import Boolean, Column, Integer, String, Text, Numeric, Enum
import enum
from app.database import Base


class BarrierClass(str, enum.Enum):
    low_barrier    = "low_barrier"
    medium_barrier = "medium_barrier"
    high_barrier   = "high_barrier"


class MoistureLevel(str, enum.Enum):
    low    = "low"
    medium = "medium"
    high   = "high"


class RespirationRate(str, enum.Enum):
    none   = "none"
    low    = "low"
    medium = "medium"
    high   = "high"


# PostgreSQL ENUM column helpers — use existing DB types, don't create new ones.
def _barrier_col(**kwargs):
    return Column(
        Enum(BarrierClass, name="barrier_class", create_type=False),
        **kwargs,
    )


def _moisture_col(**kwargs):
    return Column(
        Enum(MoistureLevel, name="moisture_level", create_type=False),
        **kwargs,
    )


def _respiration_col(**kwargs):
    return Column(
        Enum(RespirationRate, name="respiration_rate", create_type=False),
        **kwargs,
    )


class FoodProfile(Base):
    """
    Maps the combination of (category × form) chosen by the user
    to the hidden food-science parameters our engine needs.
    """
    __tablename__ = "food_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # User-visible selections
    category = Column(String(64), nullable=False, index=True)
    form     = Column(String(64), nullable=False, index=True)

    # Hidden technical defaults
    moisture_level      = _moisture_col(nullable=False)
    respiration_rate    = _respiration_col(nullable=False)
    required_otr_class  = _barrier_col(nullable=False)
    required_wvtr_class = _barrier_col(nullable=False)


class PackagingMaterial(Base):
    """
    Available packaging materials with their capabilities.
    is_fssai_approved = False means this material is ALWAYS excluded.
    """
    __tablename__ = "packaging_materials"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    name        = Column(String(128), nullable=False, unique=True)
    description = Column(Text, nullable=False)

    # Barrier capabilities
    otr_class  = _barrier_col(nullable=False)
    wvtr_class = _barrier_col(nullable=False)

    # Cost & shelf life
    cost_per_unit_inr = Column(Numeric(8, 2), nullable=False)
    shelf_life_days   = Column(Integer, nullable=False)

    # Compliance hard-gate
    is_fssai_approved = Column(Boolean, nullable=False, default=True)

    # Transit suitability — comma-separated: "local,interstate,cold_chain"
    suitable_transit = Column(String(128), nullable=False, default="local,interstate,cold_chain")


class Commodity(Base):
    """
    Specific Indian food commodities with full scientific packaging parameters.

    Scientific columns (all nullable for backward compatibility):
      water_activity         — aw 0.00–1.00; primary microbial risk predictor
      resp_rate_ml_kg_hr     — ml CO₂/kg/hr @ 10°C; drives OTR window calculation
      target_otr_min/max     — cm³/m²/day @ 23°C, 0% RH; acceptable OTR window
      target_wvtr_max        — g/m²/day @ 38°C, 90% RH; moisture-barrier spec
      shelf_life_ambient_days — days at ~30°C/75% RH Indian ambient conditions
      co2_sensitivity        — low|medium|high|very_high; caps MAP CO₂ ratio
      ethylene_sensitivity   — low|medium|high|very_high; governs cold-chain segregation
      fssai_ref              — FSSAI FSS Act/Regulation reference
      profile_category/form  — FK-equivalent to food_profiles for ML lookups
    """
    __tablename__ = "commodities"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name        = Column(String(128), nullable=False, unique=True)
    description = Column(String(256), nullable=True)
    category    = Column(String(64), nullable=False)
    form        = Column(String(64), nullable=False)

    # --- Scientific packaging parameters (Migration 005) ---
    water_activity          = Column(Numeric(4, 3), nullable=True)
    resp_rate_ml_kg_hr      = Column(Numeric(8, 2), nullable=True)
    target_otr_min          = Column(Numeric(10, 2), nullable=True)
    target_otr_max          = Column(Numeric(10, 2), nullable=True)
    target_wvtr_max         = Column(Numeric(8, 2), nullable=True)
    shelf_life_ambient_days = Column(Integer, nullable=True)
    co2_sensitivity         = Column(String(16), nullable=True)
    ethylene_sensitivity    = Column(String(16), nullable=True)
    fssai_ref               = Column(String(64), nullable=True)

    # FK-equivalent link to food_profiles
    profile_category        = Column(String(64), nullable=True, index=True)
    profile_form            = Column(String(64), nullable=True, index=True)


class Supplier(Base):
    """
    B2B Packaging Suppliers and Converters.
    """
    __tablename__ = "suppliers"

    id               = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name             = Column(String(128), nullable=False)
    location         = Column(String(128), nullable=False)
    specialization   = Column(String(256), nullable=False)
    moq              = Column(Integer, nullable=False)
    is_fssai_verified = Column(Boolean, nullable=False, default=True)
    is_bis_certified  = Column(Boolean, nullable=False, default=False)
    # Comma-separated list of material IDs they supply
    material_ids     = Column(String(256), nullable=False)
