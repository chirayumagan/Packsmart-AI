# 📦 PackSmart AI
> **Physics-Informed Multi-Objective Optimization (MOO) Packaging Engine for Indian Agriculture**  
> **SIH 2026 | Problem Statement ID: 26236 | Team Code YodhasX57**

[![Backend Status](https://img.shields.io/badge/FastAPI-0.110.0-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Frontend Status](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat)]()
[![i18n Languages](https://img.shields.io/badge/Languages-10%20Indian-orange?style=flat)]()

---

## 🌟 Overview

**PackSmart AI** is an industry-grade, physics-informed AI recommendation platform designed to eliminate post-harvest agricultural losses across India. By bridging food-barrier physics (Arrhenius kinetics, gas permeation rates, water activity dynamics) with real-world supply chain constraints, PackSmart AI provides tailored, FSSAI-compliant packaging options for farmers, FPOs, and FoodTech R&D teams.

Every year, India suffers substantial post-harvest losses due to sub-optimal packaging during transit and storage. PackSmart AI replaces trial-and-error packaging choices with mathematical precision, enabling farmers to increase produce shelf-life, minimize transit spoilage, and maximize profit margins.

---

## ✨ Key Features & Capabilities

### 🔬 1. Physics-Informed MOO Engine
* **Arrhenius Temperature Kinetics**: Dynamically models shelf-life degradation as transport temperatures fluctuate ($15^\circ\text{C}$ to $45^\circ\text{C}$) using $k = k_0 \cdot e^{-E_a / (R \cdot T)}$.
* **OTR & WVTR Permeation Barrier Modeling**: Calculates exact Oxygen Transmission Rates (OTR), Water Vapour Transmission Rates (WVTR), and Carbon Dioxide Permeability Ratios ($\beta = \text{CO}_2\text{TR} / \text{OTR}$) to prevent anaerobic suffocation and moisture-induced degradation.
* **Pareto Multi-Objective Scorer**: Evaluates materials on a non-dominated Pareto frontier, balancing shelf-life extension ($35\%$), cost-efficiency ($30\%$), eco-sustainability ($20\%$), and physics barrier fit ($15\%$).
* **FSSAI 2018 & IS 9845 Migration Limits**: Enforces hard-gate safety rules ensuring overall material migration remains under $10\text{ mg/dm}^2$ with zero non-food grade polymer inclusion.

---

### 👨‍🌾 2. Dual-Persona Architecture

```
                       ┌─────────────────────────────────────────┐
                       │           PackSmart AI Portal           │
                       └────────────────────┬────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
      ┌───────────────────────────┐                   ┌───────────────────────────┐
      │   Farmer & FPO Studio     │                   │   FoodTech & R&D Studio   │
      │   (Zero-Jargon Wizard)    │                   │   (Precision Engineering) │
      └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                    │                                               │
   • Visual 3-Step Recommendation Wizard           • 65+ Biochemical Commodity Profiles
   • Multilingual Voice/Text Search Engine         • Water Activity (aw) & Lipid Sliders
   • Interactive Live Weather Transport Scrubber   • MAP Gas Flush (O₂, CO₂, N₂ Control)
   • Farm-Gate Spoilage & ROI Savings Toggle       • Multi-Layer Polymer Laminate Visualizer
```

#### A. Farmer & FPO Studio (Zero Jargon)
* **Visual 3-Step Wizard**: Simple step-by-step navigation (Category $\rightarrow$ Form/State $\rightarrow$ Transit Route).
* **Multilingual Auto-Complete Search**: AI-powered food search supporting typing in plain English or native scripts (e.g., *Tamatar*, *Paneer*, *Doodh*, *Kanda*, *Mutton*).
* **Real-Time Weather Transport Scrubber**: Live temperature slider ($15^\circ\text{C} - 45^\circ\text{C}$) allowing farmers to simulate heatwaves or cold-chain transit and view instant shelf-life predictions.
* **Farm-Gate ROI Spoilage Savings**: Micro-interaction displaying exact rupees saved per kg due to reduced transit spoilage.

#### B. FoodTech & R&D Studio (Precision Engineering Workspace)
* **Commodity Baseline Search**: Pre-loaded biochemical profiles for $65+$ Indian produce items (Desi Tomato, Alphonso Mango, Paneer, Mutton, Basmati Rice, etc.).
* **Granular Controls**: Interactive sliders for Water Activity ($a_w$), Lipid/Fat Content, MAP headspace gas flush ($\text{O}_2, \text{CO}_2, \text{N}_2$), Film Thickness (Gauge in $\mu\text{m}$), and Sealing Temperatures.
* **Multi-Layer Laminate Anatomy**: Visual polymer stack breakdown (e.g., `Micro-perf BOPP`, `EVOH Barrier Core`, `Met-PET`, `BOPA Nylon`, `PLA Compostable`).

---

### 🌐 3. Native Multilingual i18n Engine (10 Languages)
Full, native localization and phonetic keyword mapping across 10 major Indian languages:
- 🇬🇧 English (`en`)
- 🇮🇳 Hindi (`hi` — हिन्दी)
- 🇮🇳 Marathi (`mr` — मराठी)
- 🇮🇳 Tamil (`ta` — தமிழ்)
- 🇮🇳 Telugu (`te` — తెలుగు)
- 🇮🇳 Bengali (`bn` — বাংলা)
- 🇮🇳 Gujarati (`gu` — ગુજરાતી)
- 🇮🇳 Kannada (`kn` — ಕನ್ನಡ)
- 🇮🇳 Punjabi (`pa` — ਪੰਜਾਬੀ)
- 🇮🇳 Odia (`or` — ଓଡ଼ିଆ)

---

### 📱 4. Mobile-First Accessible UI
* **Utility-First Styling**: Built with Tailwind CSS utility classes and responsive breakpoints (`sm:`, `md:`, `lg:`).
* **Cross-Device Optimization**: Designed for flawless performance down to $320\text{px}$ viewports while preserving wide desktop displays.
* **Touch Target Accessibility**: $44\text{px}$ minimum touch targets optimized for field use on budget Indian smartphones.

---

### 🛒 5. Integrated B2B Marketplace & Lead Engine
* **Verified Packaging Manufacturers**: Direct quote requesting from verified manufacturers across major industrial hubs (Vapi, Pune, Daman, NCR, Ludhiana, Coimbatore).
* **Produce Off-Takers & Mandi Buyers**: Connect with verified buyers (Reliance Retail Fresh, Mother Dairy Safal, Sahyadri FPO, BigBasket B2B, DeHaat, NinjaCart).
* **Quotation Lead Tracker**: Generates unique tracking reference IDs (`ORD-IN-2026-XXXX`) for lead management.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User["User: Farmer / FPO / FoodTech R&D"] -->|HTTPS| ReactApp["React 18 + Vite Frontend"]
    ReactApp -->|i18next| i18n["10-Language Native Localization"]
    ReactApp -->|REST API Requests| FastAPI["FastAPI Backend Server"]
    
    subgraph CoreEngine ["Backend Core Engine"]
        FastAPI -->|Multilingual Search| FoodSearch["food_search / searcher.py"]
        FastAPI -->|Hard-Gate Safety Filter| RuleFilter["engine / rule_filter.py"]
        FastAPI -->|Arrhenius & Barrier Physics| PhysicsEngine["engine / physics_engine.py"]
        FastAPI -->|Pareto MOO Utility Scorer| MLScorer["engine / ml_scorer.py"]
    end
    
    CoreEngine -->|SQLAlchemy / psycopg2| Supabase[("Supabase PostgreSQL Database")]
```

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, `react-i18next`.
* **Backend**: FastAPI (Python 3.10+), SQLAlchemy, PyMySQL / `psycopg2-binary`, Uvicorn.
* **Database**: Supabase Cloud PostgreSQL (Transaction Pooler in `ap-south-1` region) hosting pre-seeded food profiles, materials, commodities, and verified suppliers.

---

## 🔌 API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check endpoint |
| `GET` | `/api/categories` | Returns food categories, forms, and transit route options |
| `POST` | `/api/identify-food` | Smart multilingual food search (English + 9 Indian languages) |
| `POST` | `/api/recommend` | Primary Physics-Informed MOO recommendation engine endpoint |
| `POST` | `/api/expert-analyze` | Precision FoodTech R&D simulation calculation endpoint |

### Sample Request (`POST /api/recommend`)
```json
{
  "category": "Fresh Produce",
  "form": "Cut/Processed",
  "transit_route": "local"
}
```

### Sample Response
```json
{
  "food_category": "Fresh Produce",
  "food_form": "Cut/Processed",
  "transit_route": "local",
  "recommendations": [
    {
      "id": "alu",
      "rank": 1,
      "name": "Aluminium Foil Laminate",
      "cost_per_unit_inr": 6.5,
      "shelf_life_days": 187,
      "is_fssai_approved": true,
      "description": "Ultra-high barrier flexible packaging laminate. Physics Note: High moisture and oxygen barrier limits water activity (aw) drift.",
      "score": 0.6863,
      "technical_specs": {
        "otr": "< 0.01 cm³/m²/day",
        "wvtr": "< 0.1 g/m²/day",
        "gauge": "12 µm Al + 50 µm PE",
        "seal_temp": "140°C – 160°C"
      }
    }
  ]
}
```

---

## 🛠️ Local Installation & Setup

### Prerequisites
* **Python**: 3.10+
* **Node.js**: 18+ & `npm`

### 1. Backend Setup (FastAPI)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Verify database connection & seed data (Optional: pre-seeded on Supabase)
python -m app.seed

# 6. Run FastAPI dev server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup (React / Vite)

```bash
# 1. Open a new terminal and navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start Vite development server
npm run dev
```

Access the frontend app at `http://localhost:5173`. Backend API runs at `http://localhost:8000`.

---

## 🚀 Vercel Deployment Guide

PackSmart AI is pre-configured for seamless unified monorepo deployment on **Vercel** (hosting both React Frontend and FastAPI Python Serverless Functions under one domain).

### 1-Click Deployment Steps

1. **Push Code to GitHub**: Ensure all latest commits are pushed to your GitHub repository (`chirayumagan/Packsmart-AI`).
2. **Import Project into Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new) $\rightarrow$ **Add New Project**.
   - Select your `Packsmart-AI` GitHub repository.
3. **Configure Environment Variables**:
   - Add `DATABASE_URL` in the Vercel Project Settings:
     ```env
     DATABASE_URL=postgresql+psycopg2://postgres.swhrtvbmpbvgzfoambrp:Z4nFepAA%2B%3Fz%2F-fn@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
     ```
4. **Deploy**:
   - Click **Deploy**. Vercel will automatically detect `vercel.json`, build the Vite React frontend, and deploy the FastAPI backend as Python Serverless Functions at `/api/*`.

---

## 🧪 Verification & Testing Suite

The repository includes a comprehensive automated test suite verifying database connectivity, physics formulas, API endpoint latencies, and production build readiness.

### 1. Backend Physics Engine Direct Test
```bash
cd backend
.\venv\Scripts\python test_moo_engine.py
```

### 2. System QA & Performance Test Suite
With the FastAPI server running on port 8000:
```bash
cd backend
.\venv\Scripts\python test_performance_and_health.py
```
*Validates database ping, `/health`, `/api/categories`, multilingual search, 24-scenario recommendation matrix, and `/api/expert-analyze`.*

### 3. Frontend Production Build Verification
```bash
cd frontend
npm run build
```

---

## 👥 Team & Acknowledgments

* **Hackathon**: Smart India Hackathon (SIH) 2026
* **Problem Statement ID**: 26236
* **Team Code**: YodhasX57
* **Standards & Regulatory Compliance**: FSSAI 2018 Schedule IV, IS 9845 Migration Standards, ICAR & NHB Packaging Guidelines.
