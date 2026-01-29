from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import models, database
from passlib.context import CryptContext

router = APIRouter()
# Switching to pbkdf2_sha256 to avoid the common bcrypt 72-byte limit error in newer environments
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)
    new_user = models.User(email=user.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Init empty profile
    new_profile = models.Profile(user_id=new_user.id)
    db.add(new_profile)
    db.commit()
    
    return {"message": "User created", "user_id": new_user.id}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    return {"message": "Login successful", "user_id": db_user.id}
