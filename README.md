# 🌍 ForeignEdge — AI-Powered Study Abroad Platform

<div align="center">

![ForeignEdge Banner](https://img.shields.io/badge/ForeignEdge-Study%20Abroad%20AI-blue?style=for-the-badge&logo=globe&logoColor=white)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3%2070B-F55036?style=flat-square)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**ForeignEdge** is a full-stack, AI-driven student-university matchmaking platform that helps international students navigate every step of their study-abroad journey — from selecting the right university and scholarship to finding halal food, accommodation, and transport in their destination country.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Reference](#-api-reference) • [Deployment](#-deployment) • [Screenshots](#-screenshots)

</div>

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Architecture](#-architecture)
5. [Project Structure](#-project-structure)
6. [Quick Start (Local Development)](#-quick-start-local-development)
7. [Environment Variables](#-environment-variables)
8. [API Reference](#-api-reference)
9. [RAG Pipeline (AI Engine)](#-rag-pipeline-ai-engine)
10. [Database & Seeding](#-database--seeding)
11. [Admin Panel](#-admin-panel)
12. [Deployment (Railway)](#-deployment-railway)
13. [Demo Credentials](#-demo-credentials)
14. [Contributing](#-contributing)
15. [License](#-license)

---

## 🎯 Project Overview

ForeignEdge solves a critical gap for international students: the overwhelming complexity of planning a study-abroad journey. Instead of juggling dozens of websites, students get a **single AI-powered platform** that:

- **Matches** them with the best universities based on GPA, IELTS score, budget, and preferred field of study.
- **Recommends** scholarships they are eligible for — including fully-funded options.
- **Guides** them on accommodation, restaurants (halal), transport apps, and airlines.
- **Answers** any question through a RAG-powered chatbot that retrieves live data from the knowledge base before synthesising a Groq LLaMA 3 response.
- **Calculates** cost of living, visa fees, GPA conversions, and more through dedicated tools.

---

## ✨ Features

### 🎓 University Matching
- Search and filter 1,000+ universities worldwide.
- Filter by country, QS ranking, tuition range, IELTS score, GPA, acceptance rate, and field of study.
- AI-powered **semantic** matching: describe what you want in plain English and the RAG engine finds the best fits.

### 🏆 Scholarships
- Curated database of scholarships with eligibility, deadlines, amounts, and coverage.
- Filter by degree level, host country, field, and fully-funded status.
- AI chatbot can surface specific scholarships based on a student's profile.

### 🏠 Accommodation
- Student housing listings by city and country.
- Price range, housing type, platform, and rating filters.
- Semantic search ("affordable private studio in Berlin").

### 🍽️ Halal Restaurants
- Country/city-specific halal-certified restaurant listings.
- Category, price range, and rating filters.

### ✈️ Airlines & Transport
- International and budget airline recommendations per destination.
- Local transport app recommendations (Uber, Bolt, city-specific apps).

### 🤖 AI Chatbot (RAG + Groq)
- Context-aware chatbot powered by **Retrieval-Augmented Generation**.
- Retrieves real data from FAISS vector indices before answering.
- Personalized: reads the student's saved profile to tailor advice.
- Covers: universities, scholarships, accommodation, food, transport, visas, finance apps, and general advice.
- Graceful mock fallback if no API key is set.

### 🧮 Calculators
- **Cost of Living** estimator by city.
- **GPA Converter** (4.0, 5.0, percentage scales).
- **Visa Fee** estimator.
- **Scholarship Eligibility** checker.
- **Budget Planner** for tuition + living expenses.

### 👤 Student Profile
- Persistent profile: GPA, IELTS score, budget, nationality, preferred country/field.
- Profile data is fed into the AI chatbot for personalised recommendations.
- Profile creation wizard on first login.

### 🛡️ Admin Panel
- Dashboard with platform statistics (users, universities, scholarships, etc.).
- Manage universities, scholarships, and accommodations (CRUD).
- **Rebuild RAG Vector Index** — one-click button to regenerate all FAISS indices after data changes.
- Rate limiting and JWT-protected admin-only routes.

### 🔐 Authentication
- JWT-based authentication (access tokens).
- Bcrypt password hashing.
- Role-based access control: `student` vs `admin`.
- Protected routes on both frontend and backend.

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend Framework** | React | 19 |
| **Build Tool** | Vite | 8 |
| **Styling** | Tailwind CSS | 3.4 |
| **Routing** | React Router DOM | 7 |
| **Animations** | Framer Motion | 12 |
| **Charts** | Recharts | 3 |
| **Icons** | Lucide React | latest |
| **HTTP Client** | Axios | 1.16 |
| **Toast Notifications** | React Hot Toast | 2.6 |
| **Backend Framework** | Flask | 3.0.3 |
| **ORM** | SQLAlchemy + Flask-SQLAlchemy | 2.0 / 3.1 |
| **Auth** | Flask-JWT-Extended + Flask-Bcrypt | 4.6 / 1.0 |
| **CORS** | Flask-CORS | 4.0 |
| **Rate Limiting** | Flask-Limiter | 3.8 |
| **AI / LLM** | Groq API — LLaMA 3.3 70B Versatile | 0.9 |
| **Embeddings** | sentence-transformers (all-MiniLM-L6-v2) | 3.3 |
| **Vector Search** | FAISS (faiss-cpu) | 1.9 |
| **Database (local)** | SQLite | built-in |
| **Database (prod)** | PostgreSQL (via pg8000) | — |
| **Production Server** | Gunicorn | 21.2 |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (React + Vite)                │
│  Pages: Home, Dashboard, Universities, Scholarships,    │
│         Accommodation, Restaurants, Airlines, Transport, │
│         Calculators, Profile, Admin, AI Chatbot, Buddy  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS / Axios (JWT Bearer)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   FLASK API (Python)                     │
│  Blueprints:                                             │
│   /api/auth          – register, login, refresh          │
│   /api/universities  – list, filter, detail              │
│   /api/scholarships  – list, filter, detail              │
│   /api/accommodation – list, filter                      │
│   /api/restaurants   – list, filter                      │
│   /api/airlines      – list                              │
│   /api/transport     – list                              │
│   /api/profile       – get, update                       │
│   /api/admin         – stats, CRUD, rebuild RAG          │
│   /api/calculators   – COL, GPA, visa, budget            │
│   /api/chatbot       – AI chat (RAG + Groq)              │
└──────────┬───────────────────────────┬───────────────────┘
           │                           │
           ▼                           ▼
┌─────────────────┐         ┌──────────────────────────────┐
│  SQLite / Postgres│        │       RAG ENGINE              │
│  (SQLAlchemy)    │        │  sentence-transformers        │
│                  │        │  → FAISS vector indices       │
│  Tables:         │        │  Collections:                 │
│  - users         │        │   universities, scholarships, │
│  - universities  │        │   accommodations, restaurants,│
│  - scholarships  │        │   apps                        │
│  - accommodations│        │                               │
│  - restaurants   │        │  retrieve(collection, query)  │
│  - airlines      │        │  → top-k semantic matches     │
│  - transport_apps│        └───────────────┬──────────────┘
│  - student_profile│                       │
└─────────────────┘                        ▼
                                 ┌─────────────────────┐
                                 │   GROQ API           │
                                 │  LLaMA 3.3 70B       │
                                 │  (response synthesis)│
                                 └─────────────────────┘
```

---

## 📁 Project Structure

```
foreignedge/
│
├── README.md
│
├── backend/                          ← Flask REST API
│   ├── app.py                        ← App factory, blueprints, RAG init
│   ├── requirements.txt              ← All Python dependencies
│   ├── Procfile                      ← Railway / Heroku: gunicorn app:app
│   ├── .env                          ← Local secrets (NOT committed)
│   ├── .env.example                  ← Template — copy to .env
│   │
│   ├── models/
│   │   ├── database.py               ← All SQLAlchemy models
│   │   ├── seed.py                   ← Auto-seed on first run
│   │   ├── universities_data.json    ← 1000+ university records
│   │   ├── scholarships_data.json    ← Scholarship records
│   │   ├── accommodation_data.json   ← Accommodation listings
│   │   ├── restaurants_data.json     ← Restaurant listings
│   │   ├── transport_data.json       ← Transport app data
│   │   ├── finance_apps_data.json    ← Finance app data
│   │   ├── food_delivery_data.json   ← Food delivery app data
│   │   └── jobs_data.json            ← Student job listings
│   │
│   ├── routes/
│   │   ├── auth.py                   ← /api/auth (register, login)
│   │   ├── universities.py           ← /api/universities
│   │   ├── scholarships.py           ← /api/scholarships
│   │   ├── accommodation.py          ← /api/accommodation
│   │   ├── restaurants.py            ← /api/restaurants
│   │   ├── airlines.py               ← /api/airlines
│   │   ├── transport.py              ← /api/transport
│   │   ├── profile.py                ← /api/profile
│   │   ├── admin.py                  ← /api/admin
│   │   ├── calculators.py            ← /api/calculators
│   │   └── chatbot.py                ← /api/chatbot (RAG + Groq)
│   │
│   └── rag/
│       ├── __init__.py
│       └── engine.py                 ← RAGEngine class (FAISS + sentence-transformers)
│
└── frontend-new/                     ← React + Vite SPA
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env                          ← VITE_API_URL (local)
    ├── .env.example                  ← Template
    │
    └── src/
        ├── main.jsx                  ← Entry point
        ├── App.jsx                   ← Router + protected routes
        ├── index.css                 ← Global styles
        │
        ├── context/
        │   └── AuthContext.jsx       ← JWT auth state (login, logout, user)
        │
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── ProtectedRoute.jsx
        │   └── ...
        │
        ├── utils/
        │   └── api.js                ← Axios instance + all API call functions
        │
        └── pages/
            ├── Home.jsx
            ├── dashboard/            ← Student dashboard with stats
            ├── auth/                 ← Login, Register
            ├── universities/         ← List + Detail
            ├── scholarships/         ← List + Detail
            ├── accommodation/
            ├── restaurants/
            ├── airlines/
            ├── transport/
            ├── calculators/
            ├── profile/              ← Profile view + edit
            ├── intelligence/         ← AI Chatbot
            ├── buddy/                ← AI Study Buddy
            ├── passport/             ← Visa information
            └── admin/                ← Admin panel (5 sub-pages)
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- **Python** ≥ 3.10
- **pip**
- (Optional) A free [Groq API key](https://console.groq.com) for real AI responses

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/foreignedge.git
cd foreignedge
```

---

### Step 2 — Set up the Backend

```bash
cd backend

# (Recommended) Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Linux / macOS
# venv\Scripts\activate         # Windows

# Install all dependencies
pip install -r requirements.txt

# Copy the env template and fill in your values
cp .env.example .env
# Edit .env and add your GROQ_API_KEY (optional but recommended)

# Start the backend server
python app.py
```

> **First-run magic:** On startup the app automatically:
> 1. Creates `foreignedge.db` (SQLite)
> 2. Seeds all tables (universities, scholarships, accommodation, etc.)
> 3. Builds FAISS vector indices (~30 seconds on first run, instant on subsequent runs)

Backend runs at: **http://localhost:5000**

---

### Step 3 — Set up the Frontend

Open a **second terminal**:

```bash
cd frontend-new

# Install dependencies
npm install

# Copy the env template
cp .env.example .env
# The default VITE_API_URL=http://localhost:5000/api is already correct for local dev

# Start the dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

### Step 4 — Open the app

Visit **http://localhost:5173** and log in with the demo credentials below.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@foreignedge.com | admin123 |
| **Student** | student@demo.com | student123 |

> The admin account has access to the full Admin Panel, including RAG index rebuilding.

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register a new student account |
| POST | `/api/auth/login` | ❌ | Login and receive a JWT access token |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Login response:**
```json
{
  "access_token": "eyJ...",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "student" }
}
```

---

### Universities — `/api/universities`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/universities` | ✅ | List universities with optional filters |
| GET | `/api/universities/<id>` | ✅ | Get full details for one university |

**Query parameters for list:**

| Param | Type | Example |
|---|---|---|
| `country` | string | `Germany` |
| `field` | string | `Computer Science` |
| `min_ranking` | int | `1` |
| `max_ranking` | int | `500` |
| `max_tuition` | int | `20000` |
| `min_ielts` | float | `6.0` |
| `min_gpa` | float | `3.0` |
| `search` | string | `technical university` |
| `page` | int | `1` |
| `per_page` | int | `20` |

---

### Scholarships — `/api/scholarships`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/scholarships` | ✅ | List scholarships with optional filters |
| GET | `/api/scholarships/<id>` | ✅ | Get full details for one scholarship |

**Query parameters:**

| Param | Type |
|---|---|
| `country` | string |
| `degree_level` | `bachelor` / `master` / `phd` |
| `field_of_study` | string |
| `fully_funded` | `true` / `false` |
| `search` | string |

---

### Accommodation — `/api/accommodation`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/accommodation` | ✅ | List accommodations |

**Query parameters:** `country`, `city`, `type`, `max_price`, `search`

---

### Restaurants — `/api/restaurants`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/restaurants` | ✅ | List halal-friendly restaurants |

**Query parameters:** `country`, `city`, `is_halal` (`true`/`false`), `search`

---

### Airlines — `/api/airlines`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/airlines` | ✅ | List recommended airlines by destination |

---

### Transport — `/api/transport`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/transport` | ✅ | List transport apps by country |

---

### Profile — `/api/profile`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/profile` | ✅ | Get current student's profile |
| PUT | `/api/profile` | ✅ | Update student profile |

**Profile fields:** `gpa`, `ielts_score`, `budget`, `nationality`, `preferred_country`, `preferred_field`, `degree_level`, `study_goal`, `accommodation_preference`

---

### Calculators — `/api/calculators`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/calculators/cost-of-living` | ✅ | Estimate monthly cost for a city |
| POST | `/api/calculators/gpa-convert` | ✅ | Convert GPA between different scales |
| POST | `/api/calculators/visa-fee` | ✅ | Estimate visa fee for country |
| POST | `/api/calculators/scholarship-check` | ✅ | Check scholarship eligibility |
| POST | `/api/calculators/budget-plan` | ✅ | Full budget estimate (tuition + living) |

---

### AI Chatbot — `/api/chatbot`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/chatbot/chat` | ✅ | Send a message and get an AI response |
| POST | `/api/chatbot/rebuild-rag` | ✅ Admin only | Rebuild all FAISS vector indices |

**Chat request body:**
```json
{
  "message": "Which universities in Germany accept a 3.2 GPA with IELTS 6.5?",
  "conversation_history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous response" }
  ]
}
```

**Chat response:**
```json
{
  "response": "Based on your profile, here are the best matching universities in Germany...",
  "sources": ["TU Munich", "Heidelberg University", "..."]
}
```

---

### Admin — `/api/admin`

> All admin endpoints require a valid JWT from an account with `role = "admin"`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Platform statistics (user count, data counts) |
| POST | `/api/admin/rebuild-rag` | Trigger full RAG index rebuild |
| GET/POST/PUT/DELETE | `/api/admin/universities` | Manage university records |
| GET/POST/PUT/DELETE | `/api/admin/scholarships` | Manage scholarship records |

---

## 🧠 RAG Pipeline (AI Engine)

The AI chatbot uses a **Retrieval-Augmented Generation (RAG)** pipeline for accurate, grounded responses:

```
Student query
     │
     ▼
sentence-transformers (all-MiniLM-L6-v2)
     │ generates query embedding (384 dimensions)
     ▼
FAISS vector search (Inner Product / Cosine similarity)
     │ retrieves top-k most semantically similar records from:
     │   • universities index
     │   • scholarships index
     │   • accommodations index
     │   • restaurants index
     │   • apps (transport/finance) index
     ▼
Structured context document assembled from retrieved records
     │
     ▼
Groq API — LLaMA 3.3 70B Versatile
     │ synthesises a personalised, accurate response
     ▼
AI response returned to student
```

### Index Collections

| Collection | Records indexed | Key attributes embedded |
|---|---|---|
| `universities` | All DB universities | name, country, city, QS rank, tuition, IELTS, GPA, fields |
| `scholarships` | All DB scholarships | name, provider, country, degree level, field, amount, eligibility |
| `accommodations` | All DB accommodations | name, city, type, price range, platform |
| `restaurants` | All DB restaurants | name, city, halal status, category, price range |
| `apps` | Transport + finance apps | name, category, countries, description |

### Rebuilding Indices

Indices are persisted to `backend/rag/indices/` as `.index` (FAISS) and `_meta.pkl` (metadata) files.

- **Automatic on first run**: Built from DB on startup if not found on disk.
- **Fast on subsequent runs**: Loaded from disk in milliseconds.
- **Manual rebuild**: Admin panel → "Rebuild AI Index" button (calls `POST /api/admin/rebuild-rag`).

---

## 🗄 Database & Seeding

The app uses **SQLite** locally and **PostgreSQL** in production (auto-detected via `DATABASE_URL`).

### Models (defined in `backend/models/database.py`)

- `User` — authentication, role (`student` / `admin`)
- `StudentProfile` — GPA, IELTS, budget, preferences (linked to User)
- `University` — full university profile including rankings, tuition, requirements
- `Scholarship` — full scholarship details including eligibility and coverage
- `Accommodation` — listing with pricing and platform info
- `Restaurant` — with halal flag, category, rating
- `Airline` — airline listings per destination
- `TransportApp` — local transport app recommendations
- `FinanceApp` — banking/finance app recommendations
- `FoodDeliveryApp` — food delivery app data
- `JobListing` — student job listings

### Auto-Seeding

On first run, `backend/models/seed.py` automatically seeds all tables from the embedded JSON files in `backend/models/`. Re-running the app will **not** duplicate data (checks for existing records).

To **manually reset and re-seed**:
```bash
# Delete existing database
rm backend/instance/foreignedge.db

# Restart the backend — it will re-create and re-seed automatically
python app.py
```

---

## 👑 Admin Panel

Access at `/admin` after logging in with an admin account.

### Features:
| Section | Capabilities |
|---|---|
| **Dashboard** | Live stats: total users, universities, scholarships, accommodations |
| **Universities** | View, add, edit, delete university records |
| **Scholarships** | View, add, edit, delete scholarship records |
| **AI Engine** | One-click button to rebuild all FAISS vector indices |
| **Reports** | Usage analytics and platform summaries |

### Creating an Admin Account

The default `admin@foreignedge.com` account is seeded automatically. To create additional admins, register normally and then update the database:

```sql
UPDATE user SET role = 'admin' WHERE email = 'newemail@example.com';
```

---

## 🚂 Deployment (Railway)

### Backend

1. Push your repository to GitHub.
2. In [Railway](https://railway.app), create a new project → **Deploy from GitHub** → select the `backend/` directory (or the root and set root directory to `backend`).
3. Railway auto-detects Python via `requirements.txt` and uses the `Procfile` (`gunicorn app:app`).
4. In Railway dashboard → **Variables**, set:

| Variable | Value |
|---|---|
| `SECRET_KEY` | Any long random string |
| `JWT_SECRET_KEY` | Any long random string |
| `GROQ_API_KEY` | Your Groq key (optional) |
| `FRONTEND_URL` | Your frontend Railway URL (e.g. `https://foreignedge-frontend.railway.app`) |

5. Railway auto-injects `DATABASE_URL` if you add a PostgreSQL plugin — no changes needed.

### Frontend

1. Create another Railway service → deploy `frontend-new/` (or set root directory to `frontend-new`).
2. In **Variables**, set:

| Variable | Value |
|---|---|
| `VITE_API_URL` | Your backend Railway URL + `/api` (e.g. `https://foreignedge-backend.railway.app/api`) |

3. Railway uses `nixpacks.toml` (already included) to build with `npm run build` and serve the `dist/` folder.

> ⚠️ **Important**: The `VITE_API_URL` must be set **before** the first build since Vite bakes it in at build time.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- **Backend**: Follow Flask Blueprint patterns. Add new routes as a new file in `backend/routes/` and register it in `app.py`.
- **Frontend**: Add new pages under `frontend-new/src/pages/`. Add API calls in `utils/api.js`.
- **AI**: If adding a new data collection, update `rag/engine.py` to include the new collection in `RAGEngine.COLLECTIONS`.
- **Commits**: Use conventional commit format (`feat:`, `fix:`, `docs:`, `refactor:`).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **Gul Sher Khan** — Full-stack development, AI/RAG pipeline, database design

---

<div align="center">

Made with ❤️ for international students everywhere.

**[⬆ Back to top](#-foreignedge--ai-powered-study-abroad-platform)**

</div>
