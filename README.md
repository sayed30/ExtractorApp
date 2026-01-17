# Document Extraction Demo (Invoice → SalesOrderHeader / SalesOrderDetail)

This project is a document extraction demo that allows users to upload invoice PDFs, extract structured data using an LLM, review and edit the extracted fields in a web UI, and save the final result into an Excel file that acts as a lightweight database.

The app is designed to be demonstrated live, showing **before and after data extraction** and persistence.

---

## Tech Stack

- **Frontend:** React / Next.js
- **Backend:** Flask (Python)
- **LLM:** OpenAI API
- **Document parsing:** pdfplumber
- **Persistence:** Excel (`sales_orders.xlsx`) via `openpyxl`
- **Data model:** SalesOrderHeader + SalesOrderDetail

---

## Features

- Upload invoice documents (PDF)
- Extract invoice fields using an LLM
- Display extracted data in a clean, editable UI
- Edit header fields and line items
- Save structured data to an Excel file
- View saved orders (acts as a database table)
- Demonstrate differences across multiple invoice templates

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- OpenAI API key

---

## Backend and Frontend Setup

### 1. Create and activate a virtual environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate

pip install flask flask-cors openpyxl pdfplumber python-dotenv openai
Create .env file

Create backend/.env:

OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
# Optional override:
# EXCEL_DB_PATH=/absolute/path/to/sales_orders.xlsx

Run the backend server
python app.py

Frontend Setup (Next.js)
1. Install dependencies
cd frontend
npm install

2. Run the frontend
npm run dev


Frontend will run at:

http://localhost:3000
