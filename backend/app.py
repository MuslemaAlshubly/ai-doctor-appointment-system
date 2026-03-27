from flask import Flask, request, jsonify
from db import db
from bson.objectid import ObjectId
from datetime import datetime

app = Flask(__name__)

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
# Medical Records Feature
# -------------------------

@app.route("/medical-records", methods=["POST"])
def add_medical_record():
    data = request.get_json()
    record = {
        "patient_name": data.get("patient_name"),
        "age": data.get("age"),
        "diagnosis": data.get("diagnosis"),
        "notes": data.get("notes"),
        "created_at": datetime.utcnow()
    }
    result = db.medical_records.insert_one(record)
    return jsonify({"message": "Record added", "id": str(result.inserted_id)}), 201

@app.route("/medical-records", methods=["GET"])
def get_all_records():
    records = list(db.medical_records.find())
    for r in records:
        r["_id"] = str(r["_id"])
    return jsonify(records)

@app.route("/medical-records/<record_id>", methods=["GET"])
def get_record(record_id):
    record = db.medical_records.find_one({"_id": ObjectId(record_id)})
    if record:
        record["_id"] = str(record["_id"])
        return jsonify(record)
    return jsonify({"error": "Record not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)