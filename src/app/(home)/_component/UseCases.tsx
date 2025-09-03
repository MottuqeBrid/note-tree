"use client";

import { FaUserGraduate, FaBriefcase, FaPaintBrush } from "react-icons/fa";

export default function UseCases() {
  const cases = [
    {
      icon: <FaUserGraduate className="text-4xl text-secondary mb-4" />,
      title: "Students",
      desc: "Organize study notes, create subject hierarchies, and prepare for exams effectively.",
    },
    {
      icon: <FaBriefcase className="text-4xl text-secondary mb-4" />,
      title: "Professionals",
      desc: "Break down projects, track tasks, and maintain structured documentation.",
    },
    {
      icon: <FaPaintBrush className="text-4xl text-secondary mb-4" />,
      title: "Creatives",
      desc: "Map out ideas, brainstorm freely, and grow mind maps into structured projects.",
    },
  ];

  return (
    <section className="py-16 px-6 lg:px-20 bg-base-200">
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-4xl font-bold text-primary mb-4">
          Who is Note Tree For?
        </h2>
        <p className="text-lg text-base-content/80 mb-12">
          A versatile tool designed to help{" "}
          <span className="font-semibold">students</span>,
          <span className="font-semibold"> professionals</span>, and{" "}
          <span className="font-semibold">creatives</span>
          organize their thoughts and projects with clarity.
        </p>

        {/* Use Case Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl shadow-md bg-base-100 hover:shadow-xl transition"
            >
              {item.icon}
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-base-content/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
