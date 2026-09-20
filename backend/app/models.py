"""
models.py — SQLAlchemy ORM models for PackSmart AI.

Tables:
  - food_profiles       : Maps user selections to hidden technical defaults.
  - packaging_materials : Materials with barrier classes, cost, shelf life.
"""
from sqlalchemy import Boolean, Column, Integer, String, Text, Numeric, Enum
import enum
from app.database import Base


class BarrierClass(str, enum.Enum):
    low_barrier = "low_barrier"
    medium_barrier = "medium_barrier"
    high_barrier = "high_barrier"


class MoistureLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class RespirationRate(str, enum.Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"


class FoodProfile(Base):
    """
    Maps the combination of (category × form) chosen by the user
    to the hidden food-science parameters our engine needs.
    """
    __tablename__ = "food_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # User-visible selections
    category = Column(String(64), nullable=False, index=True)    # Fresh Produce / Dairy / Dry Snacks / Meat
    form = Column(String(64), nullable=False, index=True)         # Whole / Cut/Processed / Powder / Liquid

    # Hidden technical defaults
    moisture_level = Column(Enum(MoistureLevel), nullable=False)
    respiration_rate = Column(Enum(RespirationRate), nullable=False)
    required_otr_class = Column(Enum(BarrierClass), nullable=False)   # Oxygen Transmission Rate need
    required_wvtr_class = Column(Enum(BarrierClass), nullable=False)  # Water Vapour Transmission Rate need


class PackagingMaterial(Base):
    """
    Available packaging materials with their capabilities.
    is_fssai_approved = False means this material is ALWAYS excluded.
    """
    __tablename__ = "packaging_materials"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    name = Column(String(128), nullable=False, unique=True)
    description = Column(Text, nullable=False)   # Plain-English explanation shown on the card

    # Barrier capabilities
    otr_class = Column(Enum(BarrierClass), nullable=False)
    wvtr_class = Column(Enum(BarrierClass), nullable=False)

    # Cost & shelf life
    cost_per_unit_inr = Column(Numeric(8, 2), nullable=False)
    shelf_life_days = Column(Integer, nullable=False)

    # Compliance hard-gate
    is_fssai_approved = Column(Boolean, nullable=False, default=True)

    # Transit suitability — comma-separated: "local,interstate,cold_chain"
    suitable_transit = Column(String(128), nullable=False, default="local,interstate,cold_chain")


class Commodity(Base):
    """
    Specific Indian food commodities mapped to categories and forms.
    """
    __tablename__ = "commodities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(128), nullable=False, unique=True)
    description = Column(String(256), nullable=True)
    category = Column(String(64), nullable=False)
    form = Column(String(64), nullable=False)


class Supplier(Base):
    """
    B2B Packaging Suppliers and Converters.
    """
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(128), nullable=False)
    location = Column(String(128), nullable=False)
    specialization = Column(String(256), nullable=False)
    moq = Column(Integer, nullable=False)
    is_fssai_verified = Column(Boolean, nullable=False, default=True)
    is_bis_certified = Column(Boolean, nullable=False, default=False)
    # Comma-separated list of material IDs they supply
    material_ids = Column(String(256), nullable=False)

