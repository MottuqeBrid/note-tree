"use client"
import React from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-red-600">
        404 - Page Not Found
      </h1>
      <p className="mb-8 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          onClick={() => router.push("/")}
        >
          Go to Home
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
