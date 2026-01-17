"use client";

import { ExtractionPayload } from "../lib/api";

export default function LineItemsTable({
  items,
  onChange
}: {
  items: ExtractionPayload["SalesOrderDetail"];
  onChange: (items: ExtractionPayload["SalesOrderDetail"]) => void;
}) {
  function update(index: number, patch: Partial<ExtractionPayload["SalesOrderDetail"][number]>) {
    const next = items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    onChange(next);
  }

  function recalcLineTotal(qty?: number, price?: number) {
    const q = Number(qty ?? 0);
    const p = Number(price ?? 0);
    return Math.round(q * p * 100) / 100;
  }

  function addRow() {
    onChange([...items, { Product: "", OrderQty: 1, UnitPrice: 0, LineTotal: 0 }]);
  }

  function removeRow(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 className="h1">Line items</h2>
        <button className="btn btnSecondary" onClick={addRow}>+ Add row</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "38%" }}>Product</th>
            <th style={{ width: "12%" }}>Qty</th>
            <th style={{ width: "18%" }}>Unit Price</th>
            <th style={{ width: "18%" }}>Line Total</th>
            <th style={{ width: "14%" }}></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td>
                <input
                  className="input"
                  value={it.Product ?? ""}
                  onChange={(e) => update(i, { Product: e.target.value })}
                />
              </td>
              <td>
                <input
                  className="input"
                  type="number"
                  value={it.OrderQty ?? 0}
                  onChange={(e) => {
                    const qty = Number(e.target.value);
                    update(i, { OrderQty: qty, LineTotal: recalcLineTotal(qty, it.UnitPrice) });
                  }}
                />
              </td>
              <td>
                <input
                  className="input"
                  type="number"
                  value={it.UnitPrice ?? 0}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    update(i, { UnitPrice: price, LineTotal: recalcLineTotal(it.OrderQty, price) });
                  }}
                />
              </td>
              <td>
                <input
                  className="input"
                  type="number"
                  value={it.LineTotal ?? 0}
                  onChange={(e) => update(i, { LineTotal: Number(e.target.value) })}
                />
              </td>
              <td>
                <button className="btn btnSecondary" onClick={() => removeRow(i)}>Remove</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={5} className="p">No line items yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
