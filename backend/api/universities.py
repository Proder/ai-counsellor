from fastapi import APIRouter, Depends, HTTPException, status
from services.university_service import search_universities, get_ai_recommendations
from services.task_service import sync_stage_tasks
from models import database, models
from sqlalchemy.orm import Session
from pydantic import BaseModel
from utils.auth import get_current_user

router = APIRouter()

@router.get("")
async def get_universities(query: str = "", recommend: bool = False, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    if recommend:
        # Pass the user profile for better context in real app
        return {"recommendations": get_ai_recommendations({})}

    # In a real app we might cache or store in DB first
    results = search_universities(query)
    return {"results": results}

class ShortlistRequest(BaseModel):
    university_name: str 
    category: str = "Target"

@router.post("/shortlist")
def add_to_shortlist(req: ShortlistRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    # Check if exists
    uni = db.query(models.University).filter(models.University.name == req.university_name).first()
    if not uni:
        uni = models.University(name=req.university_name, country="USA", tuition_fee="50000", acceptance_rate=0.05)
        db.add(uni)
        db.commit()
        db.refresh(uni)
    
    item = models.Shortlist(user_id=current_user.id, university_id=uni.id, category=req.category)
    db.add(item)
    
    # Advance stage to Stage 3 if currently at Stage 2
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if profile and (profile.current_stage == "Building Profile" or profile.current_stage == "Stage 2: Discovering Universities"):
        profile.current_stage = "Stage 3: Finalizing Universities"
        sync_stage_tasks(current_user.id, profile.current_stage, db)
        
    db.commit()
    return {"message": "Shortlisted"}

@router.get("/shortlist")
def get_shortlist(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    # Join with University to get names
    items = (
        db.query(models.Shortlist, models.University)
        .join(models.University, models.Shortlist.university_id == models.University.id)
        .filter(models.Shortlist.user_id == current_user.id)
        .all()
    )
    
    result = []
    for s, u in items:
        result.append({
            "id": s.id,
            "university_id": s.university_id,
            "university_name": u.name,
            "category": s.category,
            "is_locked": s.is_locked
        })
    return result

@router.post("/lock/{shortlist_id}")
def lock_university(shortlist_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    item = db.query(models.Shortlist).filter(
        models.Shortlist.id == shortlist_id,
        models.Shortlist.user_id == current_user.id  # Ownership check
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Shortlist item not found")

    item.is_locked = True
    # Also update profile stage?
    user_profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if user_profile:
        user_profile.current_stage = "Stage 4: Preparing Applications"
        sync_stage_tasks(current_user.id, user_profile.current_stage, db)
    db.commit()
    return {"message": "Locked"}

@router.post("/unlock/{shortlist_id}")
def unlock_university(shortlist_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    item = db.query(models.Shortlist).filter(
        models.Shortlist.id == shortlist_id,
        models.Shortlist.user_id == current_user.id # Ownership check
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Shortlist item not found")

    item.is_locked = False
    user_profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if user_profile:
        user_profile.current_stage = "Stage 3: Finalizing Universities"
    db.commit()
    return {"message": "Unlocked"}
