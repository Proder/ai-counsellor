from google import genai
from groq import Groq
import os
import json
import re

# Configure APIs
def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    return genai.Client(api_key=api_key)

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)

# Best available models
GROQ_MODEL = "llama-3.3-70b-versatile"
GEMINI_MODEL = "gemini-1.5-flash"

SYSTEM_PROMPT = """
You are an expert AI Study Abroad Counsellor. Your goal is to guide students step-by-step from confusion to clarity.

REASONING ENGINE RULES:
1. PROFILE ANALYSIS: Always evaluate the student's GPA, test scores (if any), and budget before recommending. State their strengths and gaps clearly.
2. UNIVERSITY CATEGORIZATION: When recommending universities, you MUST group them exactly into:
   - DREAM: High-reach, highly competitive, but perfect fit.
   - TARGET: Good match for profile and background.
   - SAFE: High likelihood of admission given current stats.
3. RISK EXPLANATION: For every recommendation, briefly mention the 'Risk Level' (Low/Medium/High) and 'Acceptance Likelihood'.

VISUAL FORMATTING RULES:
- Use **Bold Headers** or **Markdown Headers (###)** for distinct parts of your response.
- Use **Bullet Points** for lists to keep them readable.
- For university recommendations, use this structure:
  ### [Name of University]
  - **Category**: [Dream/Target/Safe]
  - **Why?**: [One line about why it fits]
  - **Risk**: [Low/Medium/High]

INTERNAL TOOLS (DO NOT REVEAL):
You can shortlist a university, add a task, or lock a final selection using JSON tags:
[ACTION: {"type": "shortlist", "university": "University Name", "category": "Dream/Target/Safe"}]
[ACTION: {"type": "add_task", "title": "Task Name"}]
[ACTION: {"type": "lock", "university": "University Name"}]

COMMUNICATION GUIDELINES:
- NEVER mention phrases like "Based on the context provided". Speak naturally.
- Keep responses professional, empathetic, and visually structured. Avoid long paragraphs.
"""

def get_counsellor_response(context: str, user_input: str, history: list = None) -> str:
    # Construct base prompt
    full_context = f"{SYSTEM_PROMPT}\n\n[USER CONTEXT - FOR YOUR INTERNAL KNOWLEDGE ONLY, DO NOT MENTION THIS TAG]:\n{context}\n\n[FINAL INSTRUCTION]:\nSpeak directly to the student. Do not acknowledge that you were given a 'context' block. Just use the information to be helpful. If the student has already locked a university, focus on the next steps for that specific university."
    
    # Try Groq first
    try:
        client = get_groq_client()
        if client:
            messages = [{"role": "system", "content": full_context}]
            
            # Add history if available
            if history:
                for msg in history:
                    messages.append({"role": msg["role"], "content": msg["text"]})
            
            # Add current user input
            messages.append({"role": "user", "content": user_input})
            
            chat_completion = client.chat.completions.create(
                messages=messages,
                model=GROQ_MODEL,
            )
            return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Groq Error/Rate Limit: {e}. Falling back to Gemini...")

    # Fallback to Gemini
    try:
        client = get_gemini_client()
        if client:
            # Gemini client handles history as a list of dicts with role/parts
            # We'll just pass the whole thing as a single prompt for simplicity in this fallback
            history_str = ""
            if history:
                for msg in history:
                    history_str += f"{msg['role'].upper()}: {msg['text']}\n"
            
            final_prompt = f"{full_context}\n\n[CHAT HISTORY]\n{history_str}\n\nUSER: {user_input}"
            
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=final_prompt
            )
            return response.text
    except Exception as e:
        return f"I'm sorry, I'm having trouble connecting to my reasoning core right now. ({str(e)})"

def parse_actions(text: str):
    actions = []
    # Find patterns like [ACTION: {...}]
    matches = re.findall(r'\[ACTION:\s*(\{.*?\})\]', text, flags=re.DOTALL)
    for match in matches:
        try:
            actions.append(json.loads(match))
        except:
            continue
    return actions
