"use client";

import { useMemo, useState } from "react";
import { ExtractionPayload, saveOrder } from "../lib/api";
import LineItemsTable from "./LineItemsTable";

export default function InvoiceEditor({ initial }: { initial: ExtractionPayload }) {
  const [payload, setPayload] = useState<ExtractionPayload>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const computedSubTotal = useMemo(() => {
    return Math.round((payload.SalesOrderDetail ?? []).reduce((sum, it) => sum + Number(it.LineTotal ?? 0), 0) * 100) / 100;
  }, [payload.SalesOrderDetail]);

  function setHeader<K extends keyof ExtractionPayload["SalesOrderHeader"]>(k: K, v: any) {
    setPayload((p) => ({ ...p, SalesOrderHeader: { ...p.SalesOrderHeader, [k]: v } }));
  }

  async function onSave() {
    setErr(null);
    setSaved(false);
    setSaving(true);
    try {
      // light normalization for demo
      const next: ExtractionPayload = {
        ...payload,
        SalesOrderHeader: {
          ...payload.SalesOrderHeader,
          SubTotal: payload.SalesOrderHeader.SubTotal ?? computedSubTotal,
        }
      };
      await saveOrder(next);
      setSaved(true);
    } catch (e: any) {
      setErr(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const h = payload.SalesOrderHeader ?? {};

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 className="h1">Extracted header</h2>
          <span className={`badge ${saved ? "badgeDone" : ""}`}>{saved ? "Saved" : "Editable"}</span>
        </div>

        <div className="field">
          <div className="label">SalesOrderNumber</div>
          <input className="input" value={h.SalesOrderNumber ?? ""} onChange={(e) => setHeader("SalesOrderNumber", e.target.value)} />
        </div>

        <div className="field">
          <div className="label">CustomerName</div>
          <input className="input" value={h.CustomerName ?? ""} onChange={(e) => setHeader("CustomerName", e.target.value)} />
        </div>

        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <div className="label">OrderDate</div>
            <input className="input" value={h.OrderDate ?? ""} onChange={(e) => setHeader("OrderDate", e.target.value)} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <div className="label">DueDate</div>
            <input className="input" value={h.DueDate ?? ""} onChange={(e) => setHeader("DueDate", e.target.value)} />
          </div>
        </div>

        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <div className="label">SubTotal</div>
            <input className="input" type="number" value={h.SubTotal ?? computedSubTotal} onChange={(e) => setHeader("SubTotal", Number(e.target.value))} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <div className="label">TaxAmt</div>
            <input className="input" type="number" value={h.TaxAmt ?? 0} onChange={(e) => setHeader("TaxAmt", Number(e.target.value))} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <div className="label">Freight</div>
            <input className="input" type="number" value={h.Freight ?? 0} onChange={(e) => setHeader("Freight", Number(e.target.value))} />
          </div>
        </div>

        <div className="field">
          <div className="label">TotalDue</div>
          <input className="input" type="number" value={h.TotalDue ?? 0} onChange={(e) => setHeader("TotalDue", Number(e.target.value))} />
        </div>

        <div className="field">
          <div className="label">BillTo</div>
          <textarea className="input" rows={3} value={h.BillTo ?? ""} onChange={(e) => setHeader("BillTo", e.target.value)} />
        </div>

        <div className="field">
          <div className="label">ShipTo</div>
          <textarea className="input" rows={3} value={h.ShipTo ?? ""} onChange={(e) => setHeader("ShipTo", e.target.value)} />
        </div>

        <div className="row">
          <button className="btn" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save to Database"}
          </button>
          <span className="p">SubTotal computed from line items: <b>{computedSubTotal}</b></span>
        </div>

        {err && <p className="p" style={{ color: "#ff9c9c" }}>{err}</p>}
      </div>

      <LineItemsTable
        items={payload.SalesOrderDetail ?? []}
        onChange={(items) => setPayload((p) => ({ ...p, SalesOrderDetail: items }))}
      />

      <div className="card">
        <h2 className="h1">Raw JSON (debug)</h2>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </div>
    </div>
  );
}
