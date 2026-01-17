"use client";

export default function DatabaseTable({
  rows,
  onSelect,
  onRefresh,
}: {
  rows: any[];
  onSelect: (salesOrderNumber: string) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 className="h1">Database (Excel)</h2>
        <button className="btn btnSecondary" onClick={onRefresh}>Refresh</button>
      </div>

      <p className="p">
        This table is read from <b>sales_orders.xlsx</b> (acts as the database).  
        For the live demo: show it empty (“before”), then Save, Refresh (“after”).
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>SalesOrderNumber</th>
            <th>CustomerName</th>
            <th>OrderDate</th>
            <th>DueDate</th>
            <th>TotalDue</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.SalesOrderNumber}>
              <td>{r.SalesOrderNumber}</td>
              <td>{r.CustomerName}</td>
              <td>{r.OrderDate}</td>
              <td>{r.DueDate}</td>
              <td>{r.TotalDue}</td>
              <td>
                <button className="btn btnSecondary" onClick={() => onSelect(r.SalesOrderNumber)}>
                  Load
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="p">No saved orders yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
