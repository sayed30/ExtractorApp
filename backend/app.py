from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from extractor import extract_invoice
from db import init_db, save_order, list_orders, get_order

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
    supports_credentials=False,
)

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

    JOBS[job_id] = {"status": "done", "data": data}
    return jsonify({"jobId": job_id})

@app.route("/api/jobs/<job_id>")
def job_status(job_id):
    return jsonify(JOBS.get(job_id, {"status": "not_found"}))

@app.route("/api/orders", methods=["POST"])
def save():
    payload = request.json
    save_order(payload)
    return jsonify({"success": True})

@app.route("/api/orders", methods=["GET"])
def list_saved_orders():
    return jsonify({"orders": list_orders()})

@app.route("/api/orders/<sales_order_number>", methods=["GET"])
def load_order(sales_order_number):
    order = get_order(sales_order_number)
    if not order:
        return jsonify({"error": "not_found"}), 404
    return jsonify(order)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
