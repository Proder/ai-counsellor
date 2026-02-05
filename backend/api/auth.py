from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import models, database
from passlib.context import CryptContext
from utils.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from utils.limiter import limiter
from datetime import timedelta
import os

router = APIRouter()
# Switching to pbkdf2_sha256 to avoid the common bcrypt 72-byte limit error in newer environments
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int

# Env check for secure cookies
is_production = os.getenv("APP_ENV") == "production"

@router.post("/signup")
@limiter.limit("5/minute")
def signup(request: Request, user: UserCreate, response: Response, db: Session = Depends(database.get_db)):
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
    
    # Create token for immediate login
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=is_production
    )

    return {
        "message": "User created", 
        "user_id": new_user.id,
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
def login(request: Request, user: UserLogin, response: Response, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create Access Token
    access_token = create_access_token(data={"sub": str(db_user.id)})
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=is_production
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": db_user.id
    }
