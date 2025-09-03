"use client";

import { useState } from "react";
import { FaEnvelopeOpenText } from "react-icons/fa";
import Swal from "sweetalert2";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/others/newsletter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }
      Swal.fire({
        icon: "success",
        title: "Subscribed!",
        text: "You have successfully subscribed to our newsletter.",
      });

      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  return (
    <section className="py-16 px-6 lg:px-20 bg-base-100">
      <div className="max-w-3xl mx-auto text-center">
        {/* Icon */}
        <FaEnvelopeOpenText className="text-5xl text-primary mx-auto mb-6" />

        {/* Title */}
        <h2 className="text-4xl font-bold text-primary mb-4">
          Stay in the Loop
        </h2>
        <p className="text-lg text-base-content/80 mb-8">
          Subscribe to our newsletter and get the latest updates, tips, and new
          features of <span className="font-semibold">Note Tree</span> straight
          to your inbox.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full sm:flex-1 rounded-xl"
            required
          />
          <button
            type="submit"
            className="btn btn-primary text-neutral rounded-xl px-6"
          >
            Subscribe
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-xs text-base-content/60 mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
