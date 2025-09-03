"use client";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import React from "react";

type Comparison = {
  id: string;
  app: string;
  cons: string;
  pro: string;
};

type Props = {
  comparisons?: Comparison[];
};

const defaultComparisons: Comparison[] = [
  {
    id: "notion",
    app: "Notion",
    cons: "Feature-heavy — can feel overwhelming for quick notes",
    pro: "Note Tree keeps things minimal and structured.",
  },
  {
    id: "evernote",
    app: "Evernote",
    cons: "Linear notebooks with limited hierarchy",
    pro: "Note Tree offers true tree-style organization.",
  },
  {
    id: "obsidian",
    app: "Obsidian",
    cons: "Powerful but steep learning curve",
    pro: "Note Tree is intuitive and distraction-free.",
  },
];

export default function WhyNoteTree({ comparisons }: Props) {
  const shown =
    comparisons && comparisons.length > 0 ? comparisons : defaultComparisons;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-20 bg-base-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
          Why Note Tree?
        </h2>
        <p className="text-base sm:text-lg text-base-content/80 mb-8">
          Unlike other apps, Note Tree focuses on{" "}
          <span className="font-semibold">simplicity</span> and{" "}
          <span className="font-semibold">structure</span> — let your ideas grow
          organically.
        </p>

        <div className="grid gap-4">
          {shown.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl shadow-sm bg-base-200 text-left flex flex-col md:flex-row items-start gap-4 hover:shadow-md transition"
              role="group"
              aria-labelledby={`why-${item.id}`}
            >
              <div className="flex-1">
                <h3
                  id={`why-${item.id}`}
                  className="text-lg font-semibold mb-2"
                >
                  {item.app}
                </h3>
                <p className="flex items-center gap-2 text-sm text-error mb-2">
                  <FaTimesCircle aria-hidden /> {item.cons}
                </p>
                <p className="flex items-center gap-2 text-sm text-success">
                  <FaCheckCircle aria-hidden /> {item.pro}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
