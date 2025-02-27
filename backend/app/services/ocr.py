import pdfplumber
import google.generativeai as genai
import pandas as pd
import os
import json
from dotenv import load_dotenv
from datetime import datetime

# Load API key from environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("ERROR: Missing Google Gemini API key in .env file!")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

def extract_text_from_pdf(pdf_path: str):
    """Extracts text from a PDF file."""
    with pdfplumber.open(pdf_path) as pdf:
        text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    return text

def clean_ai_response(ai_response: str):
    """Cleans AI response by removing Markdown formatting and extra whitespace."""
    if ai_response.startswith("```json"):
        ai_response = ai_response[7:]  # Remove leading ```json
    if ai_response.endswith("```"):
        ai_response = ai_response[:-3]  # Remove trailing ```
    return ai_response.strip()

def extract_assignments_using_gemini(pdf_text: str):
    """Uses Google Gemini 1.5 Pro to extract assignments from syllabus text."""
    prompt = f"""
    You are an AI that extracts assignment schedules from syllabus text.
    Identify assignments, due dates, and descriptions in a structured JSON format.

    Example Output (JSON):
    [
      {{"assignment": "Quiz 1", "due_date": "2025-03-15", "description": "Chapter 1 Quiz"}},
      {{"assignment": "Final Project", "due_date": "2025-05-01", "description": "Group presentation"}}
    ]

    Text to analyze:
    {pdf_text}
    """

    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro")
        response = model.generate_content(prompt)

        if not response.text:
            raise ValueError("ERROR: AI returned an empty response.")

        # Clean the AI response to remove ```json and ```
        cleaned_response = clean_ai_response(response.text)
        print("Cleaned AI Response:", cleaned_response)

        # Parse JSON response
        assignments = json.loads(cleaned_response)

        if not isinstance(assignments, list):
            raise ValueError("ERROR: AI response is not a list!")

        return assignments

    except json.JSONDecodeError as e:
        print(f"ERROR: JSON decoding failed: {e}")
        return []
    except Exception as e:
        print(f"ERROR: Failed to call Gemini API: {e}")
        return []
