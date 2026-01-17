export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:5000";

export type ExtractionPayload = {
  SalesOrderHeader: {
    SalesOrderNumber?: string;
    OrderDate?: string;
    DueDate?: string;
    CustomerName?: string;
    BillTo?: string;
    ShipTo?: string;
    SubTotal?: number;
    TaxAmt?: number;
    Freight?: number;
    TotalDue?: number;
  };
  SalesOrderDetail: Array<{
    Product?: string;
    OrderQty?: number;
    UnitPrice?: number;
    LineTotal?: number;
  }>;
};

export async function uploadDocument(file: File): Promise<{ jobId: string }> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/documents`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export async function getJob(jobId: string): Promise<{ status: string; data?: ExtractionPayload }> {
  const res = await fetch(`${API_BASE}/api/jobs/${jobId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Job status failed: ${res.status}`);
  return res.json();
}

export async function saveOrder(payload: ExtractionPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Save failed: ${res.status}`);
}
