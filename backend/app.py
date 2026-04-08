import os

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from backend.db import db
from datetime import datetime
from flask_cors import CORS
from ai import call_gemini, parse_gemini_response

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
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCTOR_PROFILE_DIR = os.path.join(BASE_DIR, "../doctor-profile")

@app.route('/doctor-profile')
def doctor_profile_page():
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'doctor-profile'), 'index.html')

@app.route('/doctor-profile/<path:filename>')
def doctor_profile_static(filename):
    return send_from_directory(DOCTOR_PROFILE_DIR, filename)

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
# AI Symptom Checker
# -------------------------

@app.route('/symptom-checker')
def symptom_checker():
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'symptom-checker'), 'index.html')

@app.route('/symptom-checker/<path:filename>')
def symptom_checker_static(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'symptom-checker'), filename)

@app.route('/api/symptom-checker', methods=['POST'])
def check_symptoms():
    data = request.json
    symptoms = data.get('symptoms')

    prompt = f"Given these symptoms: {symptoms}, suggest a diagnosis and doctor specialty."

    response_text = call_gemini(prompt)
    diagnosis, specialty = parse_gemini_response(response_text)

    db.symptom_checks.insert_one({
        "symptoms": symptoms,
        "diagnosis": diagnosis,
        "specialty": specialty
    })

    return jsonify({"diagnosis": diagnosis, "specialty": specialty})

if __name__ == '__main__':
    db.init_db()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
