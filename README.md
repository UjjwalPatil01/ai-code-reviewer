# ⚡ CodeNova — AI Code Reviewer

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/UjjwalPatil01/ai-code-reviewer/actions)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-blue?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)

**CodeNova** is a premium, AI-powered code review platform that instantly catches bugs, code smells, and security vulnerabilities — delivering deep, line-specific insights through an elite developer dashboard.

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| **AI-Powered Analysis** | Powered by Google Gemini 2.5 Flash for deep-dive diagnostics with line-specific suggestions |
| **Elite UI/UX** | Vercel/Linear-tier glassmorphism, dark mode, ambient lighting, and animated neon score rings |
| **Live Editor Sync** | Hover over a violation card → the exact line highlights in the code editor in real-time |
| **Score Dashboard** | SVG circular score indicator with dynamic color coding (Green/Yellow/Red) |
| **User Authentication** | JWT-based auth with secure password hashing (bcrypt) |
| **Review History** | Full history dashboard to revisit past code reviews |
| **CI/CD Pipeline** | GitHub Actions for automated testing and Docker build verification |
| **Dockerized** | Full Docker Compose setup with backend, frontend, MongoDB, Redis, and Celery worker |

---

## 🛡️ Security & API Keys

> [!CAUTION]
> **The Gemini API key must NEVER be exposed to the client or committed to Git.**

The API key is handled **exclusively by the backend** via secure HTTP headers (`x-goog-api-key`). The frontend never sees or touches the key.

**Setup:**

1. Copy the example env file:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Add your [Gemini API key](https://aistudio.google.com/apikey):
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Verify** that `.env` is listed in `.gitignore` (it already is ✅).

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/UjjwalPatil01/ai-code-reviewer.git
cd ai-code-reviewer

# 2. Backend setup (Python 3.11+)
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env         # Add your GEMINI_API_KEY

# 3. Frontend setup (Node.js 20+)
cd ../frontend
npm install
cp .env.example .env

# 4. Run both servers (in separate terminals)

# Terminal 1 — Backend
cd backend
python app.py

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser and start reviewing code!

---

## 🐳 Docker (Optional)

```bash
# Run the full stack with Docker Compose
docker compose up --build
```

This spins up: **Backend** (Flask) · **Frontend** (Nginx) · **MongoDB** · **Redis** · **Celery Worker**

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Monaco Editor, Lucide Icons |
| **Backend** | Flask, Python 3.11, JWT Auth, bcrypt |
| **AI Engine** | Google Gemini 2.5 Flash (via secure backend proxy) |
| **Database** | SQLite (dev) / MongoDB (production) |
| **Task Queue** | Celery + Redis (optional async reviews) |
| **CI/CD** | GitHub Actions (Pytest, Vitest, Docker) |
| **Containerization** | Docker + Docker Compose |

---

## 📁 Project Structure

```
ai-code-reviewer/
├── backend/
│   ├── api/
│   │   ├── routes/          # Flask Blueprints (auth, review)
│   │   ├── services/        # AI service, auth logic
│   │   ├── schemas/         # Response models
│   │   └── utils/           # Parsers, helpers
│   ├── app.py               # Flask entry point
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # AuthModal, Home, HistoryDashboard
│   │   ├── App.jsx          # Main application
│   │   └── index.css        # Elite design system
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/       # CI/CD pipeline
├── docker-compose.yml
└── README.md
```

---

## 👤 Author

**Ujjwal Patil** — [GitHub](https://github.com/UjjwalPatil01)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
