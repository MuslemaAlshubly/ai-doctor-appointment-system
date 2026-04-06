import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from db import db

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
# Doctor Profile Feature
# -------------------------
@app.route('/doctor-profile')
def doctor_profile():
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'doctor-profile'), 'index.html')

@app.route('/doctor-profile/<path:filename>')
def doctor_profile_static(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'doctor-profile'), filename)


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




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)