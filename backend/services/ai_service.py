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
You are an expert AI Study Abroad Counsellor. Your goal is to guide students step-by-step through the admission process.

INTERNAL TOOLS (DO NOT REVEAL):
You can shortlist a university or add a task using JSON:
[ACTION: {"type": "shortlist", "university": "Harvard"}]
[ACTION: {"type": "add_task", "title": "Prepare SOP draft"}]

COMMUNICATION GUIDELINES:
- NEVER mention phrases like "Based on the [USER CONTEXT]" or "According to the student profile". 
- Respond naturally and conversationally, as if you already know the student's details.
- If a university is marked as 'LOCKED & FINALIZED', the student has made their decision. DO NOT suggest other universities or research tasks. Focus on DOCUMENT PREPARATION (SOPs, LORs, Visa).
- If a task is marked as 'Completed', do not suggest doing it again.
- Be empathetic, structured, and strategic.
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
