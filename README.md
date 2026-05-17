# 🌍 ForeignEdge — Study Abroad Platform

Full-stack platform for international students. React + Vite frontend, Python Flask backend.

---

## 🚀 Run Locally (VS Code)

Open **two terminals** in VS Code.

### Terminal 1 — Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at: **http://localhost:5000**

> Database and seed data are created automatically on first run.

### Terminal 2 — Frontend

```bash
cd frontend-new
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔐 Demo Login

| Role    | Email                    | Password   |
|---------|--------------------------|------------|
| Admin   | admin@foreignedge.com    | admin123   |
| Student | student@demo.com         | student123 |

---

## 🤖 AI Evaluation (Optional)

Get a free Groq API key at [console.groq.com](https://console.groq.com), then create `backend/.env`:

```
GROQ_API_KEY=your_key_here
```

Without it, the AI evaluation uses a mock response — everything else works fine.

---

## 🚂 Deploy to Railway

### Backend
1. Create a new Railway project → **Deploy from GitHub** (push your `backend/` folder)
2. Railway auto-detects Python and uses the `Procfile` (`gunicorn app:app`)
3. Add environment variables in Railway dashboard:
   - `SECRET_KEY` — any random string
   - `JWT_SECRET_KEY` — any random string
   - `GROQ_API_KEY` — (optional)
   - `FRONTEND_URL` — your frontend Railway URL

### Frontend
1. Create another Railway service → deploy `frontend-new/`
2. Add environment variable:
   - `VITE_API_URL` — your backend Railway URL + `/api`  
     e.g. `https://foreignedge-backend.railway.app/api`
3. Build command: `npm run build`
4. Start command: `npx serve dist`

---

## 📁 Structure

```
foreignedge/
├── backend/              ← Flask API
│   ├── app.py
│   ├── requirements.txt
│   ├── Procfile          ← Railway start command
│   ├── .env              ← local secrets (not committed)
│   ├── models/
│   │   ├── database.py   ← SQLAlchemy models
│   │   └── seed.py       ← auto seed on first run
│   └── routes/           ← auth, universities, scholarships, etc.
│
└── frontend-new/         ← React + Vite
    ├── .env              ← VITE_API_URL=http://localhost:5000/api
    ├── package.json
    └── src/
        ├── pages/        ← 20 pages
        ├── components/
        ├── context/
        └── utils/api.js  ← all API calls
```

---

## 🛠 Tech Stack

| | |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, react-router-dom |
| UI libs | lucide-react, recharts, framer-motion, react-hot-toast |
| Backend | Flask, SQLAlchemy, Flask-JWT-Extended, Flask-Bcrypt |
| Database | SQLite (local) / PostgreSQL (Railway) |
| AI | Groq API — llama-3.3-70b |
# ForeignEdge
# ForeignEdge
