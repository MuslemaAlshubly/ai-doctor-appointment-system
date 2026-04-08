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

def parse_gemini_response(text: str) -> tuple:
    # Example parsing: adjust based on your actual response format
    # Assuming response contains something like:
    # "Diagnosis: XYZ. Specialty: ABC."
    diagnosis = "Unknown"
    specialty = "General Practitioner"
    if "Diagnosis:" in text and "Specialty:" in text:
        diagnosis = text.split("Diagnosis:")[1].split("Specialty:")[0].strip().rstrip(".")
        specialty = text.split("Specialty:")[1].strip().rstrip(".")
    return diagnosis, specialty