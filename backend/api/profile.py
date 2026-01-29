from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import models, database
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
    return profile

@router.get("/{user_id}/tasks")
def get_tasks(user_id: int, db: Session = Depends(database.get_db)):
    # Sort by position, then by creation date as fallback
    tasks = db.query(models.Task).filter(models.Task.user_id == user_id).order_by(models.Task.position.asc(), models.Task.created_at.desc()).all()
    return tasks

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
