from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import models, database
from services.task_service import sync_stage_tasks
from typing import Optional, List, Dict

router = APIRouter()

class ProfileUpdate(BaseModel):
    user_id: int
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

@router.get("/{user_id}")
def get_profile(user_id: int, db: Session = Depends(database.get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Add email from User table for better fallback
    user = db.query(models.User).filter(models.User.id == user_id).first()
    res = {column.name: getattr(profile, column.name) for column in profile.__table__.columns}
    res["email"] = user.email if user else ""
    return res

@router.put("/{user_id}")
def update_profile(user_id: int, profile_data: ProfileUpdate, db: Session = Depends(database.get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for key, value in profile_data.dict(exclude_unset=True).items():
        if key != "user_id":
            setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    
    # Sync tasks for the new stage
    sync_stage_tasks(user_id, profile.current_stage, db)
    
    return profile

@router.get("/{user_id}/tasks")
def get_tasks(user_id: int, db: Session = Depends(database.get_db)):
    # First sync tasks to ensure they match current stage
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if profile:
        sync_stage_tasks(user_id, profile.current_stage, db)
        
    # Sort: Pending first, then by position
    tasks = db.query(models.Task).filter(models.Task.user_id == user_id).order_by(
        models.Task.status.desc(), # 'Pending' > 'Completed' alphabetically, but we need custom or just rely on frontend
        models.Task.position.asc(), 
        models.Task.created_at.desc()
    ).all()
    
    # Simple manual sort to ensure Pending is always first regardless of case/alphabet
    pending = [t for t in tasks if t.status == "Pending"]
    completed = [t for t in tasks if t.status == "Completed"]
    return pending + completed

@router.put("/tasks/reorder")
def reorder_tasks(req: ReorderTasksRequest, db: Session = Depends(database.get_db)):
    for index, task_id in enumerate(req.task_ids):
        task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if task:
            task.position = index
    db.commit()
    return {"message": "Reordering successful"}

@router.put("/tasks/{task_id}/toggle")
def toggle_task(task_id: int, db: Session = Depends(database.get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
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
