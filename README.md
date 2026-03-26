# CodeNova: AI Code Reviewer

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/CodeNova/actions) [![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE) [![Python](https://img.shields.io/badge/python-3.11%20%7C%203.12-blue)](https://www.python.org/) [![React](https://img.shields.io/badge/react-18.2%20%7C%202.0-blue)](https://reactjs.org/)

**CodeNova** is a premium AI‑powered developer tool that instantly catches bugs, code smells, and security issues, delivering deep, line‑specific insights while you code.

---

## 🌟 Key Features

- **Elite UI/UX** – Glass‑morphism panels, dark mode, ambient lighting, and animated neon score rings for a Vercel‑style experience.
- **AI‑Driven Analysis** – Powered by Google Gemini 2.5 Flash, providing detailed diagnostics, line‑specific highlighting, and actionable suggestions.
- **Live Editor Interaction** – Hover over a violation to see the offending line highlighted directly in the code editor.
- **Automated CI/CD** – GitHub Actions run linting, tests, and build checks on every push, ensuring a reliable production pipeline.

---

## 🛡️ Security & API Keys

> **⚠️ Critical:** The Gemini API key **must never** be exposed to the client.
>
> - Store the key in a `.env` file at the project root:
>   ```
>   GEMINI_API_KEY=your_gemini_api_key_here
>   ```
> - The backend reads this variable and forwards it via a secure header; the frontend never sees the key.
> - **Always** add `.env` (and `.env.example`) to `.gitignore` to prevent accidental commits.
>
> **Example `.env.example`**:
> ```
> # Rename to .env and insert your Gemini API key
> GEMINI_API_KEY=YOUR_GEMINI_API_KEY
> ```

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/yourusername/CodeNova.git
cd CodeNova

# Backend setup (Python 3.11+)
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env   # Edit with your Gemini key

# Frontend setup (Node.js 18+)
cd frontend
npm install
cp .env.example .env   # Adjust if needed

# Run both servers (in separate terminals)
# Backend
cd ../backend
python app.py

# Frontend
cd ../frontend
npm run dev
```

---

## 🏗️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS (custom glass‑morphism utilities), Monaco Editor
- **Backend:** Flask 2.x, Python 3.11, Celery (optional async tasks)
- **AI:** Google Gemini 2.5 Flash (via secure backend proxy)
- **CI/CD:** GitHub Actions (lint, test, build)

---

*CodeNova is open‑source, community‑driven, and built for developers who demand the highest quality tooling.*
