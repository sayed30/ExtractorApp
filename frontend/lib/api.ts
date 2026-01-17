export type LineItem = {
  LineTotal?: number;
  OrderQty?: number;
  Product?: string;
  UnitPrice?: number;
};

export type SalesOrderHeader = {
  SalesOrderNumber?: string;
  CustomerName?: string;
  DueDate?: string;
  Freight?: number;
  OrderDate?: string;
  ShipTo?: string;
  BillTo?: string;
  SubTotal?: number;
  TaxAmt?: number;
  TotalDue?: number;
};

export type ExtractionPayload = {
  SalesOrderHeader: SalesOrderHeader;
  SalesOrderDetail: LineItem[];
};

const BASE = "http://localhost:5001";

export async function uploadDocument(file: File): Promise<{ jobId: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/api/documents`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function getJob(jobId: string): Promise<any> {
  const res = await fetch(`${BASE}/api/jobs/${jobId}`);
  return res.json();
}

export async function saveOrder(payload: ExtractionPayload): Promise<void> {
  const res = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Save failed");
}

export async function listOrders(): Promise<any[]> {
  const res = await fetch(`${BASE}/api/orders`);
  if (!res.ok) throw new Error("Failed to load orders");
  const json = await res.json();
  return json.orders ?? [];
}

export async function loadOrder(salesOrderNumber: string): Promise<ExtractionPayload> {
  const res = await fetch(`${BASE}/api/orders/${encodeURIComponent(salesOrderNumber)}`);
  if (!res.ok) throw new Error("Failed to load order");
  return res.json();
}
