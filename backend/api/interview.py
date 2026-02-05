from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import models, database
from utils.auth import get_current_user
from services.ai_service import get_gemini_client, get_groq_client, GROQ_MODEL, GEMINI_MODEL
import json

router = APIRouter()

class InterviewChatRequest(BaseModel):
    message: str
    mode: str # "university" or "visa"
    history: list = [] # List of {role, text}

@router.get("/status")
def get_interview_status(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    """
    Returns the status for enabling interview modes.
    - locked_university: Name of the locked university (if any).
    - target_country: Preferred country for visa interview.
    """
    # Check for locked university
    locked_shortlist = db.query(models.Shortlist).join(models.University).filter(
        models.Shortlist.user_id == current_user.id,
        models.Shortlist.is_locked == True
    ).first()
    
    # Priority for target_country:
    # 1. Country of the locked university
    # 2. First country in preferred_countries
    # 3. Default to USA
    
    target_country = "USA"
    if locked_shortlist:
        target_country = locked_shortlist.university.country
    else:
        profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
        if profile and profile.preferred_countries:
            try:
                countries = profile.preferred_countries
                if isinstance(countries, list) and len(countries) > 0:
                    target_country = countries[0]
            except:
                pass

    return {
        "locked_university": locked_shortlist.university.name if locked_shortlist else None,
        "locked_university_id": locked_shortlist.university_id if locked_shortlist else None,
        "target_country": target_country,
        "can_take_university_interview": locked_shortlist is not None
    }

@router.post("/chat")
def interview_chat(req: InterviewChatRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    """
    Specialized chat endpoint for mock interviews.
    Generates a response based on the specific persona (University Admissions Officer or Visa Officer).
    """
    
    system_prompt = ""
    
    if req.mode == "university":
        # Fetch locked university
        locked = db.query(models.Shortlist).join(models.University).filter(
            models.Shortlist.user_id == current_user.id,
            models.Shortlist.is_locked == True
        ).first()
        
        uni_name = locked.university.name if locked else "a prestigious university"
        uni_country = locked.university.country if locked else "the USA"
        
        system_prompt = f"""
        You are a strict but fair Admissions Officer at **{uni_name}** in {uni_country}.
        You are conducting a formal admissions interview with a prospective student.
        
        YOUR GOAL:
        - Verify their passion for the field.
        - Test their knowledge about {uni_name}.
        - assess their fit for the program.
        
        GUIDELINES:
        - Speak conversationally but professionally.
        - Ask ONE question at a time.
        - Keep responses concise (spoken speech is shorter than written text).
        - If the student gives a good answer, acknowledge it briefly and move to a follow-up or next topic.
        - If the answer is vague, press for details.
        
        Start by responding to their greeting or answer.
        """
        
    elif req.mode == "visa":
        # Priority for country:
        # 1. Country of the locked university
        # 2. First country in preferred_countries
        # 3. Default to USA
        
        locked = db.query(models.Shortlist).join(models.University).filter(
            models.Shortlist.user_id == current_user.id,
            models.Shortlist.is_locked == True
        ).first()
        
        country = "USA"
        if locked:
            country = locked.university.country
        else:
            profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
            if profile and profile.preferred_countries:
                if isinstance(profile.preferred_countries, list) and len(profile.preferred_countries) > 0:
                    country = profile.preferred_countries[0]
                
        system_prompt = f"""
        You are a Visa Consular Officer for **{country}**.
        You are conducting a visa interview.
        
        YOUR GOAL:
        - Determine if the student is a genuine student.
        - Assess their financial stability and intent to return (if applicable).
        - Verify their ties to their home country.
        
        CRITICAL CONSTRAINT:
        - This interview is strictly time-bound to 5 minutes.
        - If the message includes [Time: >4 mins], start concluding the interview.
        - If the message includes [Time: >5 mins], you MUST give a final verdict (Approved or Rejected) and end the conversation.
        
        GUIDELINES:
        - Be professional, somewhat skeptical, and direct.
        - Ask clear, specific questions (e.g., "Why this university?", "Who is sponsoring you?").
        - Keep responses short.
        - If the student's answer is suspicious or weak, grill them further.
        
        Start by responding to the student.
        """
        if locked:
            system_prompt += f"\nYou know the student is planning to attend {locked.university.name}."

    else:
        system_prompt = "You are a generic interviewer."

    # Construct the full context
    full_context = f"{system_prompt}\n\n[INSTRUCTIONS]: Response should be suitable for Text-to-Speech (no markdown, no bolding, no emojis, just plain text)."
    
    # Try Groq first for speed
    try:
        from services.ai_service import get_groq_client, GROQ_MODEL
        client = get_groq_client()
        if client:
            messages = [{"role": "system", "content": full_context}]
            # Add history
            for msg in req.history:
                role = "assistant" if msg["role"] == "model" else msg["role"]
                messages.append({"role": role, "content": msg["text"]})
            messages.append({"role": "user", "content": req.message})
            
            chat_completion = client.chat.completions.create(
                messages=messages,
                model=GROQ_MODEL,
                temperature=0.7 # Slight callback variance
            )
            return {"response": chat_completion.choices[0].message.content}
    except Exception as e:
        print(f"Groq Interview Error: {e}")

    # Fallback to Gemini
    try:
        from services.ai_service import get_gemini_client, GEMINI_MODEL
        client = get_gemini_client()
        if client:
            # Construct simple history prompt
            history_str = ""
            for msg in req.history:
                history_str += f"{msg['role'].upper()}: {msg['text']}\n"
            
            final_prompt = f"{full_context}\n\n[CONVERSATION SO FAR]\n{history_str}\nUSER: {req.message}"
            
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=final_prompt
            )
            return {"response": response.text}
    except Exception as e:
        return {"response": "I apologize, could you repeat that?"}

@router.post("/save")
def save_interview_log(req: dict, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    """
    Saves the full transcript to history.
    req body: { "transcript": "...", "mode": "..." }
    """
    transcript = req.get("transcript", "")
    mode = req.get("mode", "Interaction")
    
    uni_id = None
    if mode == "university":
         # Find locked uni
         locked = db.query(models.Shortlist).filter(
            models.Shortlist.user_id == current_user.id,
            models.Shortlist.is_locked == True
         ).first()
         if locked:
             uni_id = locked.university_id

    # Create Interview Log
    interview = models.Interview(
        user_id=current_user.id,
        interview_type=mode,
        transcript=transcript,
        university_id=uni_id
    )
    db.add(interview)
    db.commit()
    
    return {"message": "Saved"}

@router.get("/history")
def get_interview_history(mode: str = None, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    query = db.query(models.Interview).filter(models.Interview.user_id == current_user.id)
    
    if mode:
        query = query.filter(models.Interview.interview_type == mode)
        
    # Join with University if needed
    results = query.order_by(models.Interview.created_at.desc()).all()
    
    history_list = []
    for item in results:
        history_list.append({
            "id": item.id,
            "mode": item.interview_type,
            "date": item.created_at.isoformat(),
            "transcript_preview": item.transcript[:200] + "..." if item.transcript else "",
            "full_transcript": item.transcript,
            "university_name": item.university.name if item.university else "N/A"
        })
    return history_list
