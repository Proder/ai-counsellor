# 🚀 AI Counsellor: Production Deployment Guide

This guide covers how to deploy the AI Counsellor application to a production environment.

---

## 📦 Architecture Overview

| Component       | Tech              | Recommended Host           |
|-----------------|--------------------|----------------------------|
| **Frontend**    | Next.js 15         | Vercel                     |
| **Backend API** | FastAPI            | Render, Railway, or Fly.io |
| **Database**    | PostgreSQL         | Railway, Neon, or Supabase |

---

## 🔐 Environment Variables

### Backend (`.env` on Render/Railway)

| Variable                   | Description                                      | Required |
|----------------------------|--------------------------------------------------|----------|
| `DATABASE_URL`             | PostgreSQL connection string (e.g., `postgresql://user:pass@host:5432/db`) | ✅ Yes   |
| `GROQ_API_KEY`             | Key from [Groq Console](https://console.groq.com/) | ✅ Yes   |
| `GEMINI_API_KEY`           | Key from [Google AI Studio](https://aistudio.google.com/) | ✅ Yes   |
| `COLLEGE_SCORECARD_API_KEY`| Key from [Data.gov](https://api.data.gov/signup/) | Optional (mock data fallback) |

### Frontend (Vercel Environment Variables)

| Variable                  | Description                                      | Required |
|---------------------------|--------------------------------------------------|----------|
| `NEXT_PUBLIC_API_URL`     | The deployed backend URL (e.g., `https://ai-counsellor-api.onrender.com`) | ✅ Yes   |

---

## 🔧 Step-by-Step Deployment

### Step 1: Deploy the Database

1.  **Create a PostgreSQL instance** on [Railway](https://railway.app), [Neon](https://neon.tech), or [Supabase](https://supabase.com).
2.  Copy the **connection string** (e.g., `postgresql://user:pass@ep-xxx.neon.tech/ai_counsellor?sslmode=require`).
3.  Keep this for Step 2.

### Step 2: Deploy the Backend (FastAPI)

1.  **Push your code** to a GitHub repository.
2.  **Connect to Render or Railway**:
    *   Root Directory: `backend`
    *   Build Command: `pip install -r requirements.txt`
    *   Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3.  **Set Environment Variables** in the dashboard:
    *   `DATABASE_URL` = (from Step 1)
    *   `GROQ_API_KEY` = (your key)
    *   `GEMINI_API_KEY` = (your key)
    *   `COLLEGE_SCORECARD_API_KEY` = (your key, optional)
4.  Deploy. Note the public URL (e.g., `https://ai-counsellor-api.onrender.com`).

### Step 3: Deploy the Frontend (Next.js)

1.  **Import your repo into Vercel**.
2.  **Configure Project**:
    *   Root Directory: `frontend`
    *   Framework Preset: Next.js (auto-detected)
3.  **Set Environment Variables**:
    *   `NEXT_PUBLIC_API_URL` = `https://ai-counsellor-api.onrender.com` (your backend URL from Step 2)
4.  **Modify `next.config.ts`** to use the environment variable:
    ```typescript
    const nextConfig: NextConfig = {
      async rewrites() {
        return [
          {
            source: "/api/:path*",
            destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
          },
        ];
      },
    };
    ```
5.  Deploy. Vercel will give you a production URL.

### Step 4: Update Backend CORS

In `backend/main.py`, update the `allow_origins` to include your Vercel URL:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",  # Add your production frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
Re-deploy the backend after this change.

---

## ⚠️ Production Checklist & Bug Review

### Critical Issues Fixed
- ✅ **Browser Alerts**: All `alert()` and `confirm()` calls replaced with Sonner toasts.
- ✅ **Chat Persistence**: Messages are now saved to the database.
- ✅ **AI Context Awareness**: The AI now receives full user state (shortlist, tasks, history).
- ✅ **Task Toggling**: Users can untick completed tasks.

### Potential Issues to Address for Scale

| Issue                        | Risk        | Recommendation                                     |
|------------------------------|-------------|-----------------------------------------------------|
| **No JWT/Session Auth**      | 🔴 High     | `user_id` is stored in `localStorage`. For production, implement proper JWT or session-based auth. |
| **Unbounded Chat History**   | 🟡 Medium   | History query is limited to 15 messages, but `ChatMessage` table will grow. Add periodic cleanup or pagination. |
| **No Rate Limiting**         | 🟡 Medium   | AI endpoints could be abused. Add rate limiting via `slowapi` or Cloudflare. |
| **Hardcoded Localhost CORS** | 🔴 Critical | Must update `main.py` CORS for production frontend URL. |
| **API Rewrites**             | 🔴 Critical | `next.config.ts` must use an environment variable for the backend URL. |

---

## ✅ Feature Completion Status (vs. Initial Prompt)

| Feature                            | Status     | Notes                                      |
|------------------------------------|------------|--------------------------------------------|
| Multi-step Onboarding              | ✅ Done    | All steps functional, mobile-ready.        |
| AI Counsellor Chat                 | ✅ Done    | Persistent, context-aware, action-taking.  |
| University Discovery (Scorecard)   | ✅ Done    | Fuzzy search, mock fallback implemented.   |
| Shortlist with Categories          | ✅ Done    | CRUD functional.                           |
| Lock Mechanism & Stage Gating      | ✅ Done    | Locks university, unlocks Applications.    |
| Applications Roadmap               | ✅ Done    | Checklists and deadlines displayed.        |
| Dashboard with AI Tasks            | ✅ Done    | Togglable task checkboxes.                 |
| Premium UI/Responsiveness          | ✅ Done    | Mobile sidebar, floating chat button.      |
| Toast Notifications                | ✅ Done    | Sonner integrated globally.                |

---

## 🧪 Final Testing Checklist

Before going live, manually verify:
1.  [ ] Signup -> Onboarding -> Dashboard flow works.
2.  [ ] AI Chat responds with context (mentions your name, locked uni).
3.  [ ] Chat history persists after page refresh.
4.  [ ] Floating chat button appears on all pages except `/chat`.
5.  [ ] Locking a university updates the stage and unlocks Applications.
6.  [ ] No browser `alert()` or `confirm()` dialogs appear anywhere.

---
Good luck with your launch! 🎓
