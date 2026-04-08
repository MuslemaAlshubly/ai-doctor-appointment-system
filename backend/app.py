import os

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from backend.db import db
from datetime import datetime
from flask_cors import CORS

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


# -------------------------
# Medical Record Feature
# -------------------------
# Create a record
@app.route("/medical-records", methods=["POST"])
def create_record():
    data = request.json
    record = {
        "patient_id": data["patient_id"],
        "doctor_id": data["doctor_id"],
        "notes": data["notes"],
    }
    db.records.insert_one(record)
    return {"message": "Record created"}

# Get records for a patient
@app.route("/medical-records/<patient_id>", methods=["GET"])
def get_records(patient_id):
    records = list(db.records.find({"patient_id": patient_id}))
    for r in records:
        r["_id"] = str(r["_id"])
    return jsonify(records)


if __name__ == '__main__':
    db.init_db()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
