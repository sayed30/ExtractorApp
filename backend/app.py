from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from extractor import extract_invoice
from db import init_db, save_order

app = Flask(__name__)
CORS(app)
init_db()

JOBS = {}

@app.route("/api/documents", methods=["POST"])
def upload_document():
    file = request.files["file"]
    job_id = str(uuid.uuid4())
    file_path = f"/tmp/{job_id}_{file.filename}"
    file.save(file_path)

    JOBS[job_id] = {"status": "processing"}
    data = extract_invoice(file_path)

    JOBS[job_id] = {
        "status": "done",
        "data": data
    }
    return jsonify({"jobId": job_id})

@app.route("/api/jobs/<job_id>")
def job_status(job_id):
    return jsonify(JOBS.get(job_id, {"status": "not_found"}))

@app.route("/api/orders", methods=["POST"])
def save():
    payload = request.json
    save_order(payload)
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True)
