"use client";
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { CoverData, ResponsiveWrapper } from "./CoverDesigns";

/*
 * CoverDesign7 – Diagonal split layout with bold color block and angled overlay.
 *  - Dynamic gradient diagonal, asymmetrical energy.
 *  - Clear hierarchy; compact width usage.
 */

export interface CoverDesign7Props {
  formData: CoverData;
  className?: string;
  primary?: string; // main gradient start
  secondary?: string; // gradient end
  dark?: string; // dark text/accent
}

const CoverDesign7 = forwardRef<HTMLDivElement, CoverDesign7Props>(
  (
    {
      formData,
      className,
      primary = "#9333ea", // purple-600
      secondary = "#4f46e5", // indigo-600
      dark = "#1e1b4b", // dark indigo
    },
    ref
  ) => {
    const safe = (v: string) => v || "—";
    const dateStr = (() => {
      try {
        return format(new Date(formData.date), "MMM dd, yyyy");
      } catch {
        return safe(formData.date);
      }
    })();
    const extract = (raw: string) => raw.match(/\d+/)?.[0] || raw;
    const ord = (s: string) => {
      const n = parseInt(s, 10);
      if (isNaN(n)) return "";
      const a = n % 10,
        b = n % 100;
      if (a === 1 && b !== 11) return "st";
      if (a === 2 && b !== 12) return "nd";
      if (a === 3 && b !== 13) return "rd";
      return "th";
    };
    const yearBase = extract(formData.year);
    const termBase = extract(formData.term);

    return (
      <ResponsiveWrapper className={className}>
        <div
          data-theme="light"
          ref={ref}
          className="design-base relative w-[1240px] h-[1740px] bg-white font-sans overflow-hidden flex flex-col"
        >
          {/* Diagonal gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 55%, #ffffff 55%)`,
            }}
          />
          {/* Angled overlay polygon */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Replaced percentage comma syntax with numeric coordinate pairs */}
            <polygon
              points="0 0 100 0 100 62 0 85"
              fill="rgba(255,255,255,0.12)"
            />
            <polygon
              points="0 70 100 48 100 100 0 100"
              fill="rgba(0,0,0,0.05)"
            />
          </svg>

          {/* Header Title */}
          <header className="relative z-10 pt-24 px-24">
            <h1 className="text-[70px] leading-[1.05] font-extrabold uppercase tracking-tight text-white drop-shadow-md max-w-[820px]">
              <span className="block">Khulna</span>
              <span className="block">University</span>
            </h1>
            <div className="mt-8 h-[8px] w-[300px] rounded-full bg-white/90" />
          </header>

          {/* Center Panel */}
          <main className="relative z-10 mt-24 px-24 text-white">
            <div className="inline-block border-4 px-9 py-5 rounded-xl bg-white/10 backdrop-blur-sm border-white/80">
              <p className="text-[42px] font-bold uppercase tracking-wide">
                {safe(formData.coverType)}
              </p>
            </div>
            <p className="mt-10 text-[120px] font-black leading-none tracking-tight text-white/90">
              ON
            </p>
            <h2 className="mt-10 text-[50px] font-semibold leading-snug max-w-[880px] text-white/95">
              {safe(formData.title)}
            </h2>

            {/* Course Info */}
            <div className="mt-14 space-y-3 text-[26px] font-medium text-white/90">
              <p>
                <span className="font-semibold">Course Title:</span>{" "}
                {safe(formData.courseTitle)}
              </p>
              {formData.section && formData.section !== "Both" && (
                <p>
                  <span className="font-semibold">Section:</span>{" "}
                  {formData.section}
                </p>
              )}
              <p>
                <span className="font-semibold">Course Code:</span>{" "}
                {safe(formData.courseCode)}
              </p>
            </div>
          </main>

          {/* Submission Cards */}
          <section className="relative z-10 mt-24 mx-24 grid grid-cols-2 gap-10">
            <div className="bg-white/90 rounded-2xl p-8 shadow-lg border border-white/50 backdrop-blur-sm">
              <h3
                className="text-[30px] font-bold mb-4"
                style={{ color: dark }}
              >
                Submitted By
              </h3>
              <ul
                className="space-y-2 text-[22px] font-medium"
                style={{ color: dark }}
              >
                <li>
                  <span className="font-semibold">Name:</span>{" "}
                  {safe(formData.studentName)}
                </li>
                <li>
                  <span className="font-semibold">ID:</span>{" "}
                  {safe(formData.studentId)}
                </li>
                <li>
                  <span className="font-semibold">Year:</span> {yearBase}
                  <sup>{ord(yearBase)}</sup>{" "}
                  <span className="font-semibold ml-3">Term:</span> {termBase}
                  <sup>{ord(termBase)}</sup>
                </li>
                <li>{safe(formData.studentDiscipline)} Discipline</li>
                <li>{safe(formData.studentInstitute)}</li>
              </ul>
            </div>
            <div className="bg-white/90 rounded-2xl p-8 shadow-lg border border-white/50 backdrop-blur-sm">
              <h3
                className="text-[30px] font-bold mb-4"
                style={{ color: dark }}
              >
                Submitted To
              </h3>
              <ul
                className="space-y-2 text-[22px] font-medium"
                style={{ color: dark }}
              >
                <li>{safe(formData.teacherName)}</li>
                <li>{safe(formData.degree)}</li>
                <li>{safe(formData.teacherDiscipline)} Discipline</li>
                <li>{safe(formData.teacherInstitute)}</li>
              </ul>
            </div>
          </section>

          {/* Date Footer */}
          <footer className="relative z-10 mt-auto mb-24 px-24 text-white/90">
            <p className="text-[24px] tracking-wide">Date of Submission</p>
            <p className="mt-2 text-[38px] font-bold text-white">{dateStr}</p>
          </footer>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign7.displayName = "CoverDesign7";

export { CoverDesign7 };
export default CoverDesign7;
