"use client";

import { FaSitemap, FaSearch, FaMoon, FaCloud } from "react-icons/fa";
import Link from "next/link";
import React from "react";

type Feature = {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
};

const defaultFeatures: Feature[] = [
  {
    id: "tree",
    icon: <FaSitemap className="text-4xl text-secondary mb-4" aria-hidden />,
    title: "Tree-Style Organization",
    desc: "Structure notes in a nested, tree-like hierarchy so ideas grow naturally.",
  },

  {
    id: "search",
    icon: <FaSearch className="text-4xl text-secondary mb-4" aria-hidden />,
    title: "Search & Tagging",
    desc: "Find notes instantly and organize them with tags and filters.",
  },
  {
    id: "sync",
    icon: <FaCloud className="text-4xl text-secondary mb-4" aria-hidden />,
    title: "Sync Across Devices",
    desc: "Access your notes from any device with secure syncing.",
  },
  {
    id: "themes",
    icon: <FaMoon className="text-4xl text-secondary mb-4" aria-hidden />,
    title: "Dark/Light Mode",
    desc: "Comfortable themes for every environment and time of day.",
  },
];

export default function FeaturesSection() {
  const shown = defaultFeatures;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-20 bg-base-200">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
          Key Features
        </h2>
        <p className="text-base sm:text-lg text-base-content/80 mb-8">
          Everything you need to stay organized, productive, and focused with
          Note Tree.
        </p>

        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="btn btn-primary text-neutral btn-sm ml-2"
          >
            Create free account
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((feature) => (
            <div
              key={feature.id}
              className="p-6 rounded-2xl shadow-md bg-base-100 hover:shadow-xl transition"
              role="region"
              aria-labelledby={`feat-${feature.id}`}
            >
              <div className="flex flex-col items-center">
                {feature.icon}
                <h3
                  id={`feat-${feature.id}`}
                  className="font-semibold text-lg mb-2"
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-base-content/70">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
