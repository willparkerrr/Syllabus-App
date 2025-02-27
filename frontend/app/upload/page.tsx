"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  // Simulate progress for better UX
  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setProgress(100);
      } else {
        setProgress(progress);
      }
    }, 300);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage("Please select at least one PDF file.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    setMessage("");
    setUploading(true);
    setProgress(0);
    simulateProgress();

    try {
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProgress(100);
        setMessage("Upload successful!");
        setDownloadLink("http://127.0.0.1:8000/upload/download/excel");
      } else {
        setMessage(`Upload failed: ${data.detail}`);
      }
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <h1 className="text-3xl font-semibold mb-6">Upload Your Syllabus PDFs</h1>

        {/* File Input */}
        <label
          className="cursor-pointer w-80 h-20 flex items-center justify-center border-2 border-gray-300 border-dashed rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-gray-600">
            {selectedFiles && selectedFiles.length > 0
              ? `${selectedFiles.length} file(s) selected`
              : "Click to select files"}
          </span>
        </label>

        {/* Display Selected Files */}
        {selectedFiles && selectedFiles.length > 0 && (
          <ul className="mt-3 w-80 text-gray-700 text-sm">
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index} className="border-b py-1 truncate">
                {file.name}
              </li>
            ))}
          </ul>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-80 disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {/* Progress Bar */}
        {uploading && (
          <div className="w-80 mt-3 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Status Message */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Download Button */}
        {downloadLink && (
          <a
            href={downloadLink}
            download
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-80 text-center text-lg font-semibold"
          >
            Download Master Schedule
          </a>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
