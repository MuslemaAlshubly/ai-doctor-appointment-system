import os

from flask import Flask, jsonify, redirect, request, send_from_directory
from flask_cors import CORS
from backend.db import db
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

import requests as http_requests

# -------------------------
# Core Routes
# -------------------------
 
@app.route("/")
def home():
    return redirect("/ai")
 
@app.route("/health")
def health():
    return "OK"
 
@app.route("/test-db")
def test_db():
    db.test.insert_one({"msg": "hello"})
    return "DB works"
 
# -------------------------
# AI Frontend
# -------------------------
 
AI_FEATURES_DIR = os.path.join(BASE_DIR, "../ai-features")
 
@app.route("/ai")
def ai_frontend():
    return send_from_directory(AI_FEATURES_DIR, "index.html")
 
# -------------------------
# Gemini AI Proxy
# -------------------------
 
@app.route("/api/claude", methods=["POST"])
def gemini_proxy():
    data = request.json
    api_key = os.getenv("API_KEY", "")
 
    if not api_key:
        return jsonify({"error": {"message": "API_KEY not set in .env"}}), 500
 
    system = data.get("system", "")
    messages = data.get("messages", [])
 
    contents = []
    for i, msg in enumerate(messages):
        role = "user" if msg["role"] == "user" else "model"
        text = msg["content"]
        if i == 0 and system:
            text = f"{system}\n\n{text}"
        contents.append({"role": role, "parts": [{"text": text}]})
 
    res = http_requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}",
        json={"contents": contents}
    )
 
    gemini_data = res.json()
 
    try:
        text = gemini_data["candidates"][0]["content"]["parts"][0]["text"]
        return jsonify({"content": [{"text": text}]})
    except Exception:
        return jsonify({"error": {"message": str(gemini_data)}}), 500
 
# -------------------------
# AI Config
# -------------------------
 
@app.route("/api/config", methods=["GET"])
def get_config():
    return jsonify({
        "gemini_key": os.getenv("API_KEY", "")
    })
 



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
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCTOR_PROFILE_DIR = os.path.join(BASE_DIR, "../doctor-profile")

@app.route("/doctor-profile")
def doctor_profile_page():
    return send_from_directory(DOCTOR_PROFILE_DIR, "index.html")

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

if __name__ == '__main__':
    db.init_db()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
