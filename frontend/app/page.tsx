"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  async function upload() {
    const form = new FormData();
    form.append("file", file!);

    const res = await fetch("http://localhost:5000/api/documents", {
      method: "POST",
      body: form,
    });
    const json = await res.json();
    setJobId(json.jobId);

    const poll = setInterval(async () => {
      const r = await fetch(`http://localhost:5000/api/jobs/${json.jobId}`);
      const j = await r.json();
      if (j.status === "done") {
        setData(j.data);
        clearInterval(poll);
      }
    }, 1000);
  }

  async function save() {
    await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alert("Saved!");
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Invoice Extraction Demo</h1>
      <input type="file" onChange={e => setFile(e.target.files![0])} />
      <button onClick={upload}>Upload</button>

      {data && (
        <>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <button onClick={save}>Save to Database</button>
        </>
      )}
    </main>
  );
}
