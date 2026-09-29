import sys
import os

# Add backend directory to path so app.main can be imported
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app

# Export ASGI app for Vercel Serverless
handler = app
