"use client";

import { useState } from "react";
import { uploadDocument } from "../lib/api";

export default function UploadCard({
  onJobCreated
}: {
  onJobCreated: (jobId: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onUpload() {
    if (!file) return;
    setErr(null);
    setUploading(true);
    try {
      const { jobId } = await uploadDocument(file);
      onJobCreated(jobId);
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card">
      <h2 className="h1">Upload invoice</h2>
      <p className="p">
        Upload a PDF or image. The backend extracts fields into SalesOrderHeader + SalesOrderDetail.
      </p>

      <div className="field">
        <div className="label">File</div>
        <input
          className="input"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="row">
        <button className="btn" disabled={!file || uploading} onClick={onUpload}>
          {uploading ? "Uploading…" : "Upload & Extract"}
        </button>
        <span className="kbd">Backend: 127.0.0.1:5001</span>
      </div>

      {err && <p className="p" style={{ color: "#ff9c9c" }}>{err}</p>}
    </div>
  );
}
