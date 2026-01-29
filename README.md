# 🎓 AI Counsellor

**A Premium Study-Abroad Command Center powered by Groq & Gemini.**

AI Counsellor is a high-performance prototype designed to guide students through the complex journey of studying abroad. By combining near-instant AI inference with structured university data, it provides a clear, stage-based path from initial curiosity to final application.

---

## 🎨 Design Philosophy
The application follows a premium, high-contrast dark-mode aesthetic:
- **Background**: `#EAEFEF` (Light) / `#25343F` (Dark)
- **Primary Accent**: `#FF9B51` (Energetic Orange)
- **Muted Elements**: `#BFC9D1`

## 🧠 AI Intelligence Layer
We use a dual-model strategic approach for maximum reliability and speed:
1. **Primary Inference**: **Groq (Llama 3.3 70B)** - Ultra-fast responses with deep logical reasoning.
2. **Fallback**: **Google Gemini 1.5 Flash** - Robust backup for when Groq rate limits are reached or for specific multi-modal tasks.

The AI can **take actions**:
- Recommend and auto-shortlist universities.
- Detect gaps in your profile and auto-generate tasks on your dashboard.

---

## 🛠️ Project Structure
```text
ai-counsellor/
├── frontend/           # Next.js 15 (App Router), TailwindCSS v4, Framer Motion
├── backend/            # FastAPI, SQLAlchemy, Groq & Gemini Services
└── docker-compose.yml  # PostgreSQL deployment
```

### Deployment Strategy
For a professional deployment, we recommend:
- **Frontend**: [Vercel](https://vercel.com) (Deploy the `frontend/` subdirectory).
- **Backend**: [Render](https://render.com) or [Railway](https://railway.app) (Deploy the `backend/` subdirectory).
- **Database**: Managed PostgreSQL (Azure, AWS, or Railway).

---

## 🚀 Getting Started

### 1. Prerequisite Keys
You will need the following API keys:
- **GROQ_API_KEY**: Get it at [Groq Console](https://console.groq.com/).
- **GEMINI_API_KEY**: Get it at [Google AI Studio](https://aistudio.google.com/).
- **COLLEGE_SCORECARD_API_KEY**: 
  - **What is it?** It's a key provided by the US Department of Education. It provides real-time data on university graduation rates, average tuition costs, and post-grad earnings.
  - **Where to get it?** [Data.gov - College Scorecard API](https://api.data.gov/signup/).

### 2. Environment Setup
Create a `.env` in `backend/`:
```env
DATABASE_URL=postgresql://admin:password@localhost:5432/ai_counsellor
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
COLLEGE_SCORECARD_API_KEY=your_key
```

### 3. Run Locally
The easiest way is using our start script:
```bash
bash start_dev.sh
```
This script handles Docker, virtual environments, dependencies, and starts both servers.

---

## 🚶 Walkthrough
1. **Onboarding**: Complete your academic profile. Be honest about your GPA and budget; the AI uses this for "Safe/Target/Dream" logic.
2. **Dashboard**: View your "Lifecycle" progress and AI-suggested tasks.
3. **Discovery**: Search for universities. The Scorecard API provides live tuition data.
4. **Shortlist**: Add potential matches to your list.
5. **The Lock**: You **must** lock at least one university finalist in your Shortlist to unlock the **Applications** module.
6. **Chat**: Use the AI Counsellor to refine your Statement of Purpose (SOP) or ask about specific university cultures.

---
Built with ❤️ for the AI Hackathon.
