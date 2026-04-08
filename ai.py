import os
import requests
import re
import json

MODEL = "gemini-2.5-flash-lite"
API_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

def call_gemini(prompt: str) -> str:
    api_key = os.environ["GEMINI_KEY"]
    url = f"{API_ENDPOINT}?key={api_key}"
    
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ]
    }
    
    response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
    response.raise_for_status()
    
    result = response.json()
    return result["candidates"][0]["content"]["parts"][0]["text"]

def parse_gemini_response(text: str) -> dict:
    try:
        # Remove markdown code fences if present
        clean = re.sub(r"```json|```", "", text).strip()
        data = json.loads(clean)
        return {
            "diagnosis": data.get("diagnosis", "Unable to determine"),
            "specialty": data.get("specialty", "General Practitioner"),
            "urgency": data.get("urgency", "Routine"),
            "explanation": data.get("explanation", "")
        }
    except json.JSONDecodeError:
        return {
            "diagnosis": "Unable to determine",
            "specialty": "General Practitioner",
            "urgency": "Routine",
            "explanation": text  # fallback: show raw response
        }
    
def build_symptom_prompt(symptoms: str) -> str:
    return f"""You are a medical triage assistant. A patient has reported the following symptoms:

"{symptoms}"

Based on these symptoms, provide:
1. A likely diagnosis or differential diagnosis (most probable condition)
2. The appropriate medical specialty to consult
3. Urgency level: Emergency / Urgent / Routine
4. A brief explanation (2-3 sentences) for the patient

Respond ONLY in this exact JSON format:
{{
  "diagnosis": "...",
  "specialty": "...",
  "urgency": "...",
  "explanation": "..."
}}"""

