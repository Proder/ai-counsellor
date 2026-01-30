# 🎓 AI Counsellor

**A Premium Study-Abroad Command Center powered by Groq & Gemini.**

AI Counsellor is an advanced, full-stack application designed to demystify the complex journey of international university admissions. Merging **real-time data** with **agentic AI**, it acts as a proactive guide—managing tasks, shortlisting universities, and building personalized application roadmaps automatically.

---

## 🏛️ Architecture & Tech Stack

The application is built on a modern, decoupled **Client-Server architecture**, ensuring scalability and separation of concerns.

### **Frontend (The Experience Layer)**
Built for speed, interactivity, and a premium "glass-morphic" aesthetic.
*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - For server-side rendering and optimizing performance.
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utilizing a custom design system with CSS variables for dynamic theming (Light/Dark modes).
*   **Motion**: `framer-motion` - For drag-and-drop task reordering and smooth page transitions.
*   **Icons**: `lucide-react` - Consistent, lightweight SVG iconography.
*   **Notifications**: `sonner` - Elegant toast notifications for user actions.

### **Backend (The Reasoning Layer)**
A high-performance asynchronous API that manages data, logic, and AI orchestration.
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - High-speed Python web framework.
*   **Database**: SQLite (Development) / PostgreSQL (Production) with **SQLAlchemy** ORM.
*   **Validation**: **Pydantic** - Strict data typing and validation for all API inputs/outputs.
*   **Task Engine**: Custom logic to auto-sync student tasks based on their admission lifecycle stage.

### **AI Core (The Brain)**
A dual-engine reasoning system designed for reliability:
1.  **Primary**: **Groq (Llama 3.3 70B)** - Ultra-low latency responses for conversational fluency.
2.  **Fallback**: **Google Gemini 1.5 Flash** - Handles complex reasoning and acts as a fail-safe if rate limits are hit.
3.  **Agentic Capabilities**: The AI isn't just a chatbot—it has tools to **read your profile**, **shortlist universities**, **add tasks**, and **lock commitments** directly in your database.

---

## ✨ Key Features & Workflows

### 1. 🚀 Dynamic Onboarding & Profile Engine
*   **Smart Profiling**: Collects critical data (GPA, Budget, Targets) to calibrate AI recommendations.
*   **"Reach/Target/Safe" Logic**: The system automatically categorizes universities based on your academic stats.

### 2. ⚡ Automated Task Engine
*   **Context-Aware**: As you progress (e.g., from "Discovery" to "Applications"), the system **automatically generates relevant tasks** (like "Draft SOP" or "Request LORs").
*   **Duplicate Detection**: Intelligent fuzzy matching prevents clutter by merging similar tasks.
*   **Auto-Completion**: Milestones like "Shortlist a University" are automatically marked done when you perform the action.

### 3. 🔍 University Discovery & Shortlisting
*   **Real Data**: Integrates with the **College Scorecard API** for live tuition, acceptance rates, and salary data.
*   **Mock Fallback**: A robust mock data layer ensures the app is always demo-ready, even offline.
*   **Smart Shortlist**: Drag-and-drop or click to categorize schools. Locking a school triggers the next phase of your journey.

### 4. 📝 Interactive Application Roadmap
*   **Multi-Commitment Tracking**: Manage multiple "Locked" universities simultaneously with a sleek, collapsible switcher.
*   **Live Checklists**: Interactive "Required Documents" lists that persist per university.
*   **Deadlines**: Visual countdowns to critical dates (Early Action / Regular Decision).

### 5. 💬 Agentic AI Chat
*   **Context-Rich**: The AI "sees" your entire profile—it knows your GPA, budget, and current shortlist without you repeating it.
*   **Action-Oriented**: Ask it to "Shortlist NYU for me," and it will actually update your dashboard instantly.

---

## 🛠️ Project Structure

```text
ai-counsellor/
├── frontend/ (Next.js Application)
│   ├── app/                 # App Router pages & layouts
│   ├── components/          # Reusable UI components (Sidebar, Chat, etc.)
│   └── public/              # Static assets
│
├── backend/ (FastAPI Service)
│   ├── api/                 # REST Endpoints (Profile, Chat, Universities)
│   ├── services/            # Business Logic (AI, Task Sync, Search)
│   ├── models/              # Database Schema (SQLAlchemy)
│   └── main.py              # Application Entry Point
│
└── start_dev.sh             # One-click startup script
```

---

## 🚀 Getting Started

### 1. Prerequisites
You need **Python 3.10+**, **Node.js 18+**, and the following API keys:
*   `GROQ_API_KEY` (for fast AI)
*   `GEMINI_API_KEY` (for robust fallback)
*   `COLLEGE_SCORECARD_API_KEY` (for university data - optional, falls back to mock)

### 2. Quick Start
We've provided a unified startup script that sets up virtual environments, installs dependencies, and launches both servers.

```bash
# In the root directory:
bash start_dev.sh
```

### 3. Manual Setup (Alternative)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔮 Future Roadmap
- [ ] **Document Analysis**: Upload your resume/SOP for AI grading.
- [ ] **Alumni Connect**: Chat with AI personas of students from your target uni.
- [ ] **Visa Interview Prep**: Voice-enabled AI mock interviews.

---
*Built with ❤️ for the Future of Education.*
