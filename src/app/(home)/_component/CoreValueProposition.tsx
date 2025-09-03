"use client";

import { FaSitemap, FaLightbulb, FaRegKeyboard } from "react-icons/fa";
import React from "react";

type Item = {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

type Props = {
  title?: string;
  subtitle?: string;
  items?: Item[];
};

const defaultItems: Item[] = [
  {
    id: "structured",
    title: "Structured Notes",
    description:
      "Organize thoughts in a clear hierarchy that grows with your ideas.",
    icon: (
      <FaSitemap className="text-4xl text-secondary mx-auto mb-4" aria-hidden />
    ),
  },
  {
    id: "hierarchy",
    title: "Intuitive Navigation",
    description:
      "Navigate seamlessly through nested notes like a tree of knowledge.",
    icon: (
      <FaLightbulb
        className="text-4xl text-secondary mx-auto mb-4"
        aria-hidden
      />
    ),
  },
  {
    id: "focus",
    title: "Distraction-Free",
    description: "Focus on your content with a clean, minimal writing space.",
    icon: (
      <FaRegKeyboard
        className="text-4xl text-secondary mx-auto mb-4"
        aria-hidden
      />
    ),
  },
];

export default function CoreValueProposition({
  title,
  subtitle,
  items,
}: Props) {
  const shownTitle = title ?? "Why people love Note Tree";
  const shownSubtitle =
    subtitle ??
    "Capture ideas, build structure, and revisit knowledge with clarity — designed for thinkers and makers.";
  const shownItems = items && items.length > 0 ? items : defaultItems;

  return (
    <section
      className="py-12 px-4 sm:px-8 lg:px-20 bg-base-100 text-center"
      aria-labelledby="cvp-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="cvp-heading"
          className="text-3xl sm:text-4xl font-extrabold text-primary mb-3"
        >
          {shownTitle}
        </h2>

        <p className="text-base sm:text-lg text-base-content/80 mb-8">
          {shownSubtitle}
        </p>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {shownItems.map((it) => (
            <div
              key={it.id}
              className="p-5 rounded-xl shadow-sm bg-base-200 hover:shadow-md transition-colors duration-150"
              role="article"
              aria-labelledby={`cvp-${it.id}`}
              tabIndex={0}
            >
              {it.icon}
              <h3 id={`cvp-${it.id}`} className="font-semibold text-lg mb-2">
                {it.title}
              </h3>
              <p className="text-sm text-base-content/70">{it.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
