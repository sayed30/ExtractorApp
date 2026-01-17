"use client";

import { useEffect, useState } from "react";
import UploadCard from "../components/UploadCard";
import InvoiceEditor from "../components/InvoiceEditor";
import DatabaseTable from "../components/DatabaseTable";
import { getJob, listOrders, loadOrder, ExtractionPayload } from "../lib/api";

export default function Home() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [payload, setPayload] = useState<ExtractionPayload | null>(null);
  const [dbRows, setDbRows] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);

  async function refreshDb() {
    setLoadingDb(true);
    try {
      const rows = await listOrders();
      setDbRows(rows);
    } finally {
      setLoadingDb(false);
    }
  }

  useEffect(() => {
    refreshDb();
  }, []);

  useEffect(() => {
    if (!jobId) return;

    const poll = setInterval(async () => {
      const j = await getJob(jobId);
      if (j.status === "done") {
        setPayload(j.data);
        clearInterval(poll);
      }
    }, 800);

    return () => clearInterval(poll);
  }, [jobId]);

  async function onSelectOrder(salesOrderNumber: string) {
    const p = await loadOrder(salesOrderNumber);
    setPayload(p);
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Invoice Extraction Demo</h1>

      <div className="grid">
        <UploadCard onJobCreated={(id) => setJobId(id)} />

        <DatabaseTable
          rows={dbRows}
          onSelect={onSelectOrder}
          onRefresh={refreshDb}
        />

        {loadingDb && <p className="p">Loading DB…</p>}

        {payload && (
          <InvoiceEditor
            initial={payload}
          />
        )}
      </div>
    </main>
  );
}
