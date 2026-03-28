from flask import Flask, jsonify, request
from db import db

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)