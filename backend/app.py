from flask import Flask
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)