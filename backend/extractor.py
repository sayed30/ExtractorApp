import pdfplumber
import json
import os
import openai
from schema import INVOICE_SCHEMA


# Load environment variables from .env
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai.api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

def extract_invoice(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    prompt = f"""
You are an invoice extraction engine.
Return ONLY valid JSON following this schema:

{json.dumps(INVOICE_SCHEMA, indent=2)}

Invoice text:
{text}
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return json.loads(response.choices[0].message.content)
