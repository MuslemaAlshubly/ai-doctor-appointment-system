from flask import Flask, jsonify, request
from db import db
from bson.objectid import ObjectId
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)