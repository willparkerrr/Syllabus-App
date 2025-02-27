// app/about/page.tsx
"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-grow px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Syllabus App</h1>
        <p className="text-lg text-gray-700 max-w-2xl">
          Syllabus App helps students organize their academic schedules by creating a concise spreadsheet with all of their assignments chronologically ordered.
        </p>
      </main>
      <Footer />
    </div>
  );
}

