"use client";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-grow px-6 text-center">
        <motion.h1 
          className="text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Syllabus App
        </motion.h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl">
          Upload your syllabus, extract key dates, and sync them effortlessly with Google Calendar.
        </p>
        <div className="flex space-x-4">
          <Link href="/upload">
            <Button className="px-6 py-3 text-lg rounded-2xl shadow-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="px-6 py-3 text-lg rounded-2xl">
              Learn More
            </Button>
          </Link>
        </div>
        <motion.img 
          src="/hero-image.png" 
          alt="Syllabus App Preview"
          className="mt-12 w-full max-w-md rounded-xl shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
      </main>
      <Footer />
    </div>
  );
}