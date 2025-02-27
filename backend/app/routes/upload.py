from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import os
from app.services.ocr import extract_text_from_pdf, extract_assignments_using_gemini
from app.services.export import generate_excel
import pandas as pd

router = APIRouter(prefix="/upload", tags=["File Upload"])

UPLOAD_DIR = "uploads"
EXPORT_DIR = "exports"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(EXPORT_DIR, exist_ok=True)

@router.post("/")
async def upload_files(files: list[UploadFile] = File(...)):
    try:
        all_assignments = []

        for file in files:
            # Ensure the file is a PDF
            if not file.filename.endswith(".pdf"):
                raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

            file_path = os.path.join(UPLOAD_DIR, file.filename)

            # Save file to backend
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())

            print(f"✅ File saved: {file_path}")

            # Extract syllabus text
            pdf_text = extract_text_from_pdf(file_path)

            # Use Gemini to extract assignments
            assignments = extract_assignments_using_gemini(pdf_text)

            # Ensure assignments were found
            if not assignments:
                print(f"⚠️ No assignments found in {file.filename}")
                continue  # Skip empty results

            # Extract course name from filename (e.g., "MKTG 361 Syllabus.pdf" → "MKTG 361")
            course_name = file.filename.replace("Syllabus", "").replace(".pdf", "").strip()

            # Add course name to each assignment
            for assignment in assignments:
                assignment["course"] = course_name

            all_assignments.extend(assignments)

        if not all_assignments:
            raise HTTPException(status_code=400, detail="No assignments found in any of the uploaded PDFs.")

        # Convert all assignments into a DataFrame and sort by date
        df = pd.DataFrame(all_assignments)
        df["due_date"] = pd.to_datetime(df["due_date"], errors="coerce")
        df = df.sort_values(by="due_date", ascending=True)

        # Generate Master Excel file
        master_excel_file = os.path.join(EXPORT_DIR, "master_assignments.xlsx")
        generate_excel(df.to_dict(orient="records"), master_excel_file)

        return {
            "message": "Assignments extracted and merged successfully!",
            "download_link": "/upload/download/excel"
        }

    except Exception as e:
        print(f"❌ ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/excel")
async def download_excel():
    file_path = "exports/master_assignments.xlsx"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(file_path, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename="master_assignments.xlsx")
