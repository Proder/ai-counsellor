from sqlalchemy.orm import Session
from models import models

def sync_stage_tasks(user_id: int, current_stage: str, db: Session):
    """
    Synchronizes tasks based on the student's current stage.
    Flags previous stage tasks as completed and ensures current/next stage tasks exist.
    """
    
    # Mapping of stages to their core tasks
    STAGE_TASKS = {
        "Building Profile": [
            "Complete Initial Profile"
        ],
        "Stage 2: Discovering Universities": [
            "Research University Programs",
            "Broaden University Search"
        ],
        "Stage 3: Finalizing Universities": [
            "Shortlist Universities",
            "Prepare for GMAT/GRE"
        ],
        "Stage 4: Preparing Applications": [
            "Lock Final Selection",
            "Draft Statement of Purpose (SOP)",
            "Request Letters of Recommendation (LOR)"
        ]
    }

    # 1. Ensure tasks for current stage exist (if they don't already)
    # 2. Mark tasks from PREVIOUS stages as "Completed"
    
    stages = list(STAGE_TASKS.keys())
    try:
        current_idx = stages.index(current_stage)
    except ValueError:
        current_idx = 0

    # Fetch all current user tasks once to check for fuzzy duplicates
    all_user_tasks = db.query(models.Task).filter(models.Task.user_id == user_id).all()
    user_task_titles = [t.title.lower() for t in all_user_tasks]

    # Process all stages
    for idx, stage in enumerate(stages):
        task_titles = STAGE_TASKS[stage]
        for title in task_titles:
            # Check if task already exists (Fuzzy Match)
            # We check if the exact title exists OR if a very similar one exists
            # This prevents "Draft SOP" and "Draft Statement of Purpose (SOP)" co-existing
            
            exists = False
            matched_task = None
            
            # 1. Exact match check
            for t in all_user_tasks:
                if t.title == title:
                    exists = True
                    matched_task = t
                    break
            
            # 2. Fuzzy match if not exact
            if not exists:
                # Key phrases to check
                check_phrase = title.lower()
                if "statement of purpose" in check_phrase: check_phrase = "statement of purpose"
                elif "lor" in check_phrase: check_phrase = "recommendation"
                elif "gmat" in check_phrase: check_phrase = "gmat"
                elif "gre" in check_phrase: check_phrase = "gre"
                elif "shortlist" in check_phrase: check_phrase = "shortlist"
                
                for t in all_user_tasks:
                    if check_phrase in t.title.lower():
                        exists = True
                        matched_task = t
                        break

            if not exists:
                # Create task
                new_task = models.Task(
                    user_id=user_id,
                    title=title,
                    is_auto_generated=True,
                    status="Completed" if idx < current_idx else "Pending"
                )
                db.add(new_task)
                # Append to local list so we don't duplicate within this loop execution if logic changes
                all_user_tasks.append(new_task) 
            else:
                # If stage is past, mark as completed
                if idx < current_idx and matched_task and matched_task.status != "Completed":
                    matched_task.status = "Completed"
    
    db.commit()
