from fastapi import APIRouter, Depends
from services.university_service import search_universities
from services.task_service import sync_stage_tasks
from models import database, models
from sqlalchemy.orm import Session
from pydantic import BaseModel

router = APIRouter()

@router.get("")
async def get_universities(query: str = "", db: Session = Depends(database.get_db)):
    # In a real app we might cache or store in DB first
    results = search_universities(query)
    return {"results": results}

class ShortlistRequest(BaseModel):
    user_id: int
    university_id: int # In real app, we'd lookup or create the uni record first
    university_name: str # For prototype simplicity
    category: str = "Target"

@router.post("/shortlist")
def add_to_shortlist(req: ShortlistRequest, db: Session = Depends(database.get_db)):
    # Check if exists
    # For prototype, we assume University table needs to be populated or we just store loose ref?
    # Our model has ForeignKey("universities.id"). Functional prototype: Create University if not exists.
    
    uni = db.query(models.University).filter(models.University.name == req.university_name).first()
    if not uni:
        uni = models.University(name=req.university_name, country="USA", tuition_fee="50000", acceptance_rate=0.05)
        db.add(uni)
        db.commit()
        db.refresh(uni)
    
    item = models.Shortlist(user_id=req.user_id, university_id=uni.id, category=req.category)
    db.add(item)
    
    # Advance stage to Stage 3 if currently at Stage 2
    profile = db.query(models.Profile).filter(models.Profile.user_id == req.user_id).first()
    if profile and (profile.current_stage == "Building Profile" or profile.current_stage == "Stage 2: Discovering Universities"):
        profile.current_stage = "Stage 3: Finalizing Universities"
        sync_stage_tasks(req.user_id, profile.current_stage, db)
        
    db.commit()
    return {"message": "Shortlisted"}

@router.get("/shortlist/{user_id}")
def get_shortlist(user_id: int, db: Session = Depends(database.get_db)):
    # Join with University to get names
    items = (
        db.query(models.Shortlist, models.University)
        .join(models.University, models.Shortlist.university_id == models.University.id)
        .filter(models.Shortlist.user_id == user_id)
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
def lock_university(shortlist_id: int, db: Session = Depends(database.get_db)):
    item = db.query(models.Shortlist).filter(models.Shortlist.id == shortlist_id).first()
    if item:
        item.is_locked = True
        # Also update profile stage?
        user = db.query(models.Profile).filter(models.Profile.user_id == item.user_id).first()
        if user:
            user.current_stage = "Stage 4: Preparing Applications"
            sync_stage_tasks(item.user_id, user.current_stage, db)
        db.commit()
    return {"message": "Locked"}

@router.post("/unlock/{shortlist_id}")
def unlock_university(shortlist_id: int, db: Session = Depends(database.get_db)):
    item = db.query(models.Shortlist).filter(models.Shortlist.id == shortlist_id).first()
    if item:
        item.is_locked = False
        user = db.query(models.Profile).filter(models.Profile.user_id == item.user_id).first()
        if user:
            user.current_stage = "Stage 3: Finalizing Universities"
        db.commit()
    return {"message": "Unlocked"}
