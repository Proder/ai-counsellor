from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import models, database
from services.task_service import sync_stage_tasks
from typing import Optional, List, Dict
from utils.auth import get_current_user

router = APIRouter()

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    current_education_level: Optional[str] = None
    degree_major: Optional[str] = None
    graduation_year: Optional[int] = None
    gpa: Optional[float] = None
    target_degree: Optional[str] = None
    target_field: Optional[str] = None
    target_intake_year: Optional[int] = None
    preferred_countries: Optional[List[str]] = None
    budget_range: Optional[str] = None
    funding_plan: Optional[str] = None
    exam_scores: Optional[Dict] = None
    sop_status: Optional[str] = None
    onboarding_completed: Optional[bool] = None
    current_stage: Optional[str] = None

class ReorderTasksRequest(BaseModel):
    task_ids: List[int]

@router.get("/me")
def get_own_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        # Should not happen if checking registration, but auto-create just in case
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    res = {column.name: getattr(profile, column.name) for column in profile.__table__.columns}
    res["email"] = current_user.email
    return res

@router.put("/me")
def update_own_profile(profile_data: ProfileUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
    
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    
    # Sync tasks for the new stage
    sync_stage_tasks(current_user.id, profile.current_stage, db)
    
    return profile

@router.get("/tasks")
def get_tasks(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    # First sync tasks to ensure they match current stage
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if profile:
        sync_stage_tasks(current_user.id, profile.current_stage, db)
        
    # Sort: Pending first, then by position
    tasks = db.query(models.Task).filter(models.Task.user_id == current_user.id).order_by(
        models.Task.status.desc(), # 'Pending' > 'Completed' alphabetically, but we need custom or just rely on frontend
        models.Task.position.asc(), 
        models.Task.created_at.desc()
    ).all()
    
    # Simple manual sort to ensure Pending is always first regardless of case/alphabet
    pending = [t for t in tasks if t.status == "Pending"]
    completed = [t for t in tasks if t.status == "Completed"]
    return pending + completed

@router.put("/tasks/reorder")
def reorder_tasks(req: ReorderTasksRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    for index, task_id in enumerate(req.task_ids):
        # Validation: check task ownership
        task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user.id).first()
        if task:
            task.position = index
    db.commit()
    return {"message": "Reordering successful"}

@router.put("/tasks/{task_id}/toggle")
def toggle_task(task_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Toggle logic
    if task.status == "Completed":
        task.status = "Pending"
    else:
        task.status = "Completed"
        
    db.commit()
    db.refresh(task)
    return {"message": "Task status updated", "new_status": task.status}
