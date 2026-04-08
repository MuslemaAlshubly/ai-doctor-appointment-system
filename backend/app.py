import os
import requests

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from backend.db import db
from datetime import datetime
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)




@app.route("/")
def home():
    return "App is running"

@app.route("/health")
def health():
    return "OK"

@app.route("/test-db")
def test_db():
    db.test.insert_one({"msg": "hello"})
    return "DB works"

# -------------------------
# Doctor Search Feature
# -------------------------

@app.route("/search-doctors", methods=["GET"])
def search_doctors():
    # Get query params
    specialty = request.args.get("specialty")
    location = request.args.get("location")  # add locations later

    query = {}
    if specialty:
        query["specialty"] = specialty
    if location:
        query["location"] = location

    doctors = list(db.doctors.find(query))
    for d in doctors:
        d["_id"] = str(d["_id"])  # ensure JSON serializable

    return jsonify(doctors)

# -------------------------
# Doctor Profile Feature
# -------------------------

@app.route('/api/doctors/<doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    doctor = db.doctors.find_one({"_id": doctor_id})
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404
    doctor["_id"] = str(doctor["_id"])
    return jsonify(doctor)

@app.route('/api/doctors/<doctor_id>/slots', methods=['GET'])
def get_slots(doctor_id):
    slots = list(db.slots.find({"doctor_id": doctor_id}))
    for slot in slots:
        slot["_id"] = str(slot["_id"])
    return jsonify(slots)


@app.route('/api/appointments', methods=['POST'])
def book_appointment():
    data = request.json
    db.appointments.insert_one({
        "doctor_id": data["doctor_id"],
        "time": data["time"]
    })
    return jsonify({"message": f"Appointment booked for {data['time']}"}), 201

# -------------------------
# AI Consultation Feature
# -------------------------

@app.route('/api/ai/ask', methods=['POST'])
def ask_ai():
    data = request.json
    question = data.get('question', '')
    
    if not question:
        return jsonify({"error": "No question provided"}), 400
    
    try:
        # Get Gemini API key from environment
        gemini_api_key = os.environ.get('GEMINI_API_KEY')
        if not gemini_api_key:
            return jsonify({"response": "AI service is not configured. Using fallback response.", "error": False})
        
        gemini_url = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'
        
        # Call Gemini API from backend (bypasses CORS)
        response = requests.post(
            f'{gemini_url}?key={gemini_api_key}',
            json={
                'contents': [{
                    'parts': [{
                        'text': f'You are a helpful medical information assistant. Provide helpful health information and wellness tips based on the following question. Always remind users to consult a doctor for serious symptoms. Question: {question}'
                    }]
                }]
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('candidates') and data['candidates'][0].get('content'):
                ai_response = data['candidates'][0]['content']['parts'][0]['text']
                return jsonify({"response": ai_response, "error": False})
            else:
                return jsonify({"response": "I couldn't generate a response. Please try again.", "error": False})
        else:
            # Fallback response
            fallback_responses = [
                'Based on your symptoms, this could be a common cold. Rest, stay hydrated, and monitor your temperature.',
                'For headaches, try resting in a quiet room and staying hydrated. If it persists, consult a doctor.',
                'Regular exercise and a balanced diet can help improve your health. Aim for 30 minutes of activity daily.',
                'If you have a persistent cough, it may be worth seeing a doctor to rule out infections.',
                'Getting 7-9 hours of sleep is important for your health. Try maintaining a consistent sleep schedule.'
            ]
            import random
            return jsonify({"response": random.choice(fallback_responses), "error": False})
            
    except Exception as e:
        print(f"AI API Error: {str(e)}")
        # Fallback response on error
        fallback_responses = [
            'Based on your symptoms, this could be a common cold. Rest, stay hydrated, and monitor your temperature.',
            'For headaches, try resting in a quiet room and staying hydrated. If it persists, consult a doctor.',
            'Regular exercise and a balanced diet can help improve your health. Aim for 30 minutes of activity daily.',
            'If you have a persistent cough, it may be worth seeing a doctor to rule out infections.',
            'Getting 7-9 hours of sleep is important for your health. Try maintaining a consistent sleep schedule.'
        ]
        import random
        return jsonify({"response": random.choice(fallback_responses), "error": False})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
