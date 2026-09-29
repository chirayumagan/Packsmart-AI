"""
database.py — SQLAlchemy engine + session factory.

Now connected to Supabase (PostgreSQL) via a transaction-mode pooler URL.
Reads credentials from .env via python-dotenv.
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# ---------------------------------------------------------------------------
# Supabase PostgreSQL connection (Transaction-mode pooler — port 6543)
# Falls back to direct DB URL if DATABASE_URL is set.
# ---------------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Build from individual Supabase env vars
    DB_USER     = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST     = os.getenv("DB_HOST", "")
    DB_PORT     = os.getenv("DB_PORT", "5432")
    DB_NAME     = os.getenv("DB_NAME", "postgres")

    from urllib.parse import quote_plus
    DATABASE_URL = (
        f"postgresql+psycopg2://{quote_plus(DB_USER)}:{quote_plus(DB_PASSWORD)}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

# pool_pre_ping keeps idle connections alive across Supabase's connection recycler.
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    connect_args={"sslmode": "require"},  # Supabase requires TLS
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
