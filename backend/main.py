from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import models, database
from api import chat, auth, profile, universities
from dotenv import load_dotenv
import os

load_dotenv()

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="AI Counsellor API", redirect_slashes=False)

# Configurable CORS origins for production
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(universities.router, prefix="/api/universities", tags=["Universities"])

@app.get("/")
def read_root():
    return {"message": "AI Counsellor API is running"}
