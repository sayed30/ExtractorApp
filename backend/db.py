import sqlite3

def init_db():
    conn = sqlite3.connect("orders.db")
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS sales_order_header (
        id INTEGER PRIMARY KEY,
        order_number TEXT,
        customer TEXT,
        total REAL
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS sales_order_detail (
        id INTEGER PRIMARY KEY,
        order_number TEXT,
        product TEXT,
        qty INTEGER,
        price REAL
    )
    """)

    conn.commit()
    conn.close()

def save_order(data):
    header = data["SalesOrderHeader"]
    details = data["SalesOrderDetail"]

    conn = sqlite3.connect("orders.db")
    c = conn.cursor()

    c.execute(
        "INSERT INTO sales_order_header VALUES (NULL, ?, ?, ?)",
        (header["SalesOrderNumber"], header["CustomerName"], header["TotalDue"])
    )

    for d in details:
        c.execute(
            "INSERT INTO sales_order_detail VALUES (NULL, ?, ?, ?, ?)",
            (
                header["SalesOrderNumber"],
                d["Product"],
                d["OrderQty"],
                d["UnitPrice"]
            )
        )

    conn.commit()
    conn.close()
