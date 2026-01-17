import json
import os
import pdfplumber
import pytesseract
from openai import OpenAI
from schema import INVOICE_SCHEMA
from PIL import Image
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def extract_invoice(path: str):
    # Extract text from PDF
    text = ""
    if path.lower().endswith(".pdf"):
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"
    elif path.lower().endswith((".png", ".jpg", ".jpeg")):
        image = Image.open(path)
        text = pytesseract.image_to_string(image)
    prompt = f"""
You are an invoice extraction engine.
Return ONLY valid JSON following this schema (do not wrap in markdown):

{json.dumps(INVOICE_SCHEMA, indent=2)}

Rules:
- Dates as YYYY-MM-DD if available
- Money as numbers (no currency symbols)
- SalesOrderDetail is an array of line items
- If totals are missing, infer them if possible

Invoice text:
{text}
"""

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )

    content = resp.choices[0].message.content
    return json.loads(content)
