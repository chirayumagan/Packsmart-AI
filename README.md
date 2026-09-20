# 📦 PackSmart AI
> **Smart Packaging Recommendation Platform for Indian Agriculture**
> Built for **SIH 2026** (Problem Statement ID: **26236**)

PackSmart AI is an intelligent, dual-persona platform designed to eliminate post-harvest food loss by matching food commodities with the most scientifically accurate, FSSAI-compliant packaging materials.

## ✨ Key Features
- 🌍 **Multilingual Interface:** Instantly switch between English, Hindi (हिन्दी), and Marathi (मराठी) to support rural farmers and FPOs.
- 👨‍🌾 **Farmer Studio:** A zero-jargon, 3-step visual wizard that abstracts away complex chemistry.
- 🔬 **Expert Studio:** An advanced FoodTech dashboard for modeling Water Activity ($a_w$), Respiration Rates, and multi-layer laminates.
- 🧬 **Biological Rule Engine:** A hybrid Python engine that strictly prohibits anaerobic packaging for respiring produce and ranks materials based on cost, eco-score, and shelf-life extension.
- 🤝 **B2B Supplier Marketplace:** Connects end-users directly to verified FSSAI/BIS packaging manufacturers via an integrated lead generation system.

---

## 🏗️ Project Architecture

PackSmart AI is built on a decoupled Client-Server architecture:
- **Frontend:** React 18, Vite, TailwindCSS, `react-i18next`
- **Backend:** Python, FastAPI, SQLAlchemy, MySQL
- **Data Engine:** Hybrid Hard-Gate + Weighted ML Scorer (`rule_filter.py`, `ml_scorer.py`)

## 🚀 Local Development Setup

### 1. Backend Setup (FastAPI)
Navigate to the backend directory, set up your Python virtual environment, and install dependencies.
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder containing your MySQL credentials:
```env
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=packsmart_db
```

Seed the database with the SIH prototype data:
```bash
python -m app.seed
```

Start the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup (React/Vite)
Open a new terminal window, navigate to the frontend directory, and install dependencies.
```bash
cd frontend
npm install
npm run dev
```
The app will be running at `http://localhost:5173`.

---

## 🌐 Deployment to Vercel

### Deploying the Frontend
Vercel is the recommended hosting provider for the frontend.
1. Push this repository to GitHub.
2. In the Vercel dashboard, click **Add New... > Project** and import your repository.
3. Under **Framework Preset**, Vercel will automatically detect **Vite**.
4. **CRITICAL:** Set the **Root Directory** to `frontend`.
5. Click **Deploy**. Vercel will build and serve the React app flawlessly, and the included `vercel.json` will ensure React Router paths (if any) don't 404 upon refresh.

### Deploying the Backend
Because the backend relies on a MySQL database, it is best deployed on a service like **Render**, **Railway**, or **AWS App Runner**.
1. Create a managed MySQL database on PlanetScale, Aiven, or Railway.
2. Deploy the `backend` directory to your chosen provider, setting the Start Command to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add your `DB_*` environment variables.
4. **Link Frontend to Backend:** Once your API is live (e.g., `https://packsmart-api.onrender.com`), update your frontend API calls in `HeroSearch.jsx`, `FarmerStudio.jsx`, and `ExpertStudio.jsx` to point to the new absolute URL instead of `/api`.
