# 🌍 ForeignEdge — Study Abroad Platform

> AI-powered platform that helps Pakistani and international students plan their entire study abroad journey in one place.

---

## ✨ What it does

ForeignEdge centralises university discovery, scholarship matching, accommodation search and visa guidance for international students. An AI evaluation engine powered by **Groq Llama 3.3-70B** queries a live database and returns personalised university recommendations, matched scholarships and a month-by-month preparation roadmap based on the student's academic profile.

---

## 🚀 Key Features

- 🧠 **AI Profile Evaluation** — 5-step wizard that queries real DB records and returns matched universities, scholarships and a personalised roadmap
- 💬 **AI Chatbot** — floating assistant on every page with live database context
- 🏛️ **University Search** — 822 universities across 13 countries with advanced filters
- 🏆 **Scholarship Finder** — 613 scholarships from the 2026-27 cycle
- 🏠 **Accommodation** — 1,440 listings with images from 10 international platforms
- 🍽️ **Halal Restaurant Finder** — 1,500 restaurants with halal filter by country and city
- ✈️ **Airlines Directory** — student discounts, baggage info and flight search
- 🛂 **Passport & Visa Guide** — requirements for 40+ countries
- 🌍 **Intelligence Hub** — economy, employment and education rankings across 13 countries
- 🛠️ **25 Free Study Tools** — cost of living, GPA converter, budget planner, currency converter and more
- 🛡️ **Admin Panel** — full content management, user control and live database viewer

---

## 📊 Platform Scale

| Universities | Scholarships | Accommodation | Countries |
|---|---|---|---|
| 822 | 613 | 1,440 listings | 13 |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| UI Libraries | Recharts, Framer Motion, Lucide React, React Hot Toast |
| Backend | Python Flask 3.0, SQLAlchemy, Flask-JWT-Extended, Flask-Bcrypt |
| Database | SQLite (dev) / PostgreSQL (prod) |
| AI | Groq API — Llama 3.3-70B-Versatile |
| Auth | JWT tokens, bcrypt password hashing, RBAC |
| Deploy | Gunicorn, Railway-ready |

---

## 🚀 Run Locally

**Terminal 1 — Backend**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Runs at `http://localhost:5000`

**Terminal 2 — Frontend**
```bash
cd frontend-new
npm install
npm run dev
```
Runs at `http://localhost:5173`

> Database and all datasets are seeded automatically on first run.

---

## 📁 Project Structure
foreignedge/

├── backend/

│   ├── app.py               ← Flask entry point

│   ├── requirements.txt

│   ├── Procfile             ← Railway deploy

│   ├── models/

│   │   ├── database.py      ← 11 SQLAlchemy models

│   │   └── seed.py          ← auto-seeds all datasets

│   └── routes/              ← auth, universities, scholarships, chatbot, admin...

│

└── frontend-new/

├── src/

│   ├── pages/           ← 20+ pages

│   ├── components/      ← Navbar, Sidebar, Chatbot widget

│   ├── context/         ← AuthContext

│   └── utils/api.js     ← all API calls via Axios

└── .env                 ← VITE_API_URL

