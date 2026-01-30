from fastapi import APIRouter, Depends
from pydantic import BaseModel
from services.ai_service import get_counsellor_response, parse_actions
from services.task_service import sync_stage_tasks
from sqlalchemy.orm import Session, joinedload
from models import database, models

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: int
    message: str

@router.get("/history/{user_id}")
def get_chat_history(user_id: int, db: Session = Depends(database.get_db)):
    messages = db.query(models.ChatMessage).filter(models.ChatMessage.user_id == user_id).order_by(models.ChatMessage.created_at.asc()).all()
    return messages

@router.post("")
async def chat_with_counsellor(request: ChatRequest, db: Session = Depends(database.get_db)):
    # 1. Fetch user data for deep context with relationships
    profile = db.query(models.Profile).filter(models.Profile.user_id == request.user_id).first()
    
    # Fetch shortlist and include university data
    shortlist_items = db.query(models.Shortlist).filter(models.Shortlist.user_id == request.user_id).all()
    
    # Get university names manually since relationship might not be fully configured in models.py
    shortlist_with_names = []
    for item in shortlist_items:
        uni = db.query(models.University).filter(models.University.id == item.university_id).first()
        shortlist_with_names.append({
            "name": uni.name if uni else "Unknown University",
            "is_locked": item.is_locked
        })

    tasks = db.query(models.Task).filter(models.Task.user_id == request.user_id).all()
    history_mds = db.query(models.ChatMessage).filter(models.ChatMessage.user_id == request.user_id).order_by(models.ChatMessage.created_at.desc()).limit(15).all()
    
    # Format history for LLM (older first)
    history = []
    for m in reversed(history_mds):
        role = "assistant" if m.role == "bot" else "user"
        history.append({"role": role, "text": m.text})

    # 2. Build explicit context string
    context = ""
    if profile:
        context += f"STUDENT PROFILE:\n"
        context += f"- Name: {profile.full_name}\n"
        context += f"- Current Education: {profile.current_education_level} in {profile.degree_major}\n"
        context += f"- Academic Performance: GPA {profile.gpa if profile.gpa else 'Not Provided'}\n"
        context += f"- Standardized Tests: {json.dumps(profile.exam_scores) if profile.exam_scores else 'None'}\n"
        context += f"- Target Goal: {profile.target_degree} in {profile.target_field} ({profile.target_intake_year})\n"
        context += f"- Preference: {', '.join(profile.preferred_countries) if profile.preferred_countries else 'Any'}\n"
        context += f"- Finance: Budget {profile.budget_range} ({profile.funding_plan})\n"
        context += f"- Current Milestone: {profile.current_stage}\n"
    
    if shortlist_with_names:
        unis = [f"{s['name']} ({'LOCKED & FINALIZED' if s['is_locked'] else 'Shortlisted'})" for s in shortlist_with_names]
        context += f"\nDECISION PIPELINE:\n- " + "\n- ".join(unis) + "\n"
        
    if tasks:
        task_list = [f"{t.title} (Status: {t.status})" for t in tasks]
        context += f"\nACTIVE ADMISSION TASKS:\n- " + "\n- ".join(task_list) + "\n"

    # 3. Save user message to DB
    user_msg_db = models.ChatMessage(user_id=request.user_id, role="user", text=request.message)
    db.add(user_msg_db)
    
    # 4. Get AI response with full history AND deep state context
    response_text = get_counsellor_response(context, request.message, history=history)
    actions = parse_actions(response_text)
    
    executed_actions = []
    for action in actions:
        if action["type"] == "shortlist":
            uni_name = action["university"]
            category = action.get("category", "Target")
            uni = db.query(models.University).filter(models.University.name == uni_name).first()
            if not uni:
                uni = models.University(name=uni_name, country="USA", tuition_fee="Unknown", acceptance_rate=0.0)
                db.add(uni)
                db.commit()
                db.refresh(uni)
            
            existing = db.query(models.Shortlist).filter(
                models.Shortlist.user_id == request.user_id,
                models.Shortlist.university_id == uni.id
            ).first()
            if not existing:
                new_item = models.Shortlist(user_id=request.user_id, university_id=uni.id, category=category)
                db.add(new_item)
                # Advance stage
                if profile and (profile.current_stage == "Building Profile" or profile.current_stage == "Stage 2: Discovering Universities"):
                    profile.current_stage = "Stage 3: Finalizing Universities"
                    sync_stage_tasks(request.user_id, profile.current_stage, db)
                executed_actions.append(f"Shortlisted {uni_name} to {category} list")
        
        elif action["type"] == "add_task":
            # Avoid duplicate tasks by title
            existing_task = any(t.title.lower() == action["title"].lower() for t in tasks)
            if not existing_task:
                new_task = models.Task(user_id=request.user_id, title=action["title"], is_auto_generated=True)
                db.add(new_task)
                executed_actions.append(f"Added task: {action['title']}")
        
        elif action["type"] == "lock":
            uni_name = action["university"]
            uni = db.query(models.University).filter(models.University.name == uni_name).first()
            if uni:
                shortlist_item = db.query(models.Shortlist).filter(
                    models.Shortlist.user_id == request.user_id,
                    models.Shortlist.university_id == uni.id
                ).first()
                if shortlist_item and not shortlist_item.is_locked:
                    shortlist_item.is_locked = True
                    # Update profile stage to Applications if not already
                    if profile and profile.current_stage != "Stage 4: Preparing Applications":
                        profile.current_stage = "Stage 4: Preparing Applications"
                        sync_stage_tasks(request.user_id, profile.current_stage, db)
                    executed_actions.append(f"Locked {uni_name} - Welcome to the Application phase!")
    
    # Clean up the [ACTION] tags
    import re
    clean_text = re.sub(r'\[ACTION:.*?\]', '', response_text, flags=re.DOTALL).strip()
    
    # 5. Save bot response and actions to DB
    bot_msg_db = models.ChatMessage(user_id=request.user_id, role="bot", text=clean_text)
    db.add(bot_msg_db)
    
    for action_text in executed_actions:
        action_msg_db = models.ChatMessage(user_id=request.user_id, role="bot", text=action_text, is_action=True)
        db.add(action_msg_db)
        
    db.commit()
    
    return {
        "response": clean_text,
        "actions_taken": executed_actions
    }
