#!/bin/bash

# AI Counsellor Prototype - Start Script

echo "🚀 Starting AI Counsellor Development Environment..."

# 1. Start Docker Database
echo "📦 Starting PostgreSQL via Docker..."
docker-compose up -d

# 2. Setup Backend
echo "🐍 Setting up Backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate

# Explicitly uninstall old google packages to avoid namespace conflicts
pip uninstall -y google-generativeai google-api-core google-cloud-core

pip install -r requirements.txt
pip install "passlib[bcrypt]"

# Create .env if missing
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created .env for backend. Please add your API keys!"
fi

# Run Backend in background
echo "📡 Launching FastAPI on http://localhost:8000"
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# 3. Setup Frontend
echo "⚛️ Setting up Frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Create .env.local if missing
if [ ! -f ".env.local" ]; then
    cp .env.local.example .env.local
fi

echo "🌐 Launching Next.js on http://localhost:3000"
npm run dev

# Cleanup background process on exit
trap "kill $BACKEND_PID" EXIT
