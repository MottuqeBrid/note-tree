"use client";
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { CoverData, ResponsiveWrapper } from "./CoverDesigns";

/*
 * CoverDesign11 – Split Arc Timeline Layout
 *  - Left vertical timeline rail: stacked badges (Course, Year/Term, Date).
 *  - Large sweeping top arc (SVG) framing the university heading.
 *  - Central content block with cover type pill + title + course metadata.
 *  - Submission panels at bottom in a balanced two-column card.
 *  - Pure CSS / SVG; print friendly.
 */

export interface CoverDesign11Props {
  formData: CoverData;
  className?: string;
  primary?: string; // main accent
  secondary?: string; // secondary accent
  accent?: string; // highlight
}

const CoverDesign11 = forwardRef<HTMLDivElement, CoverDesign11Props>(
  (
    {
      formData,
      className,
      primary = "#0d9488", // teal-600
      secondary = "#14b8a6", // teal-500
      accent = "#fb923c", // orange-400
    },
    ref
  ) => {
    const safe = (v: string) => v || "—";
    const dateFmt = (() => {
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
          ref={ref}
          data-theme="light"
          className="design-base relative w-[1240px] h-[1740px] bg-white overflow-hidden font-sans"
        >
          {/* Background subtle pattern */}
          <div className="absolute inset-0 opacity-[0.06]">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              aria-hidden="true"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern
                  id="d11grid"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="2" fill={primary} opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#d11grid)" />
            </svg>
          </div>

          {/* Top sweeping arc */}
          <svg
            className="absolute -top-24 left-0 w-[1400px] h-[640px]"
            viewBox="0 0 1400 640"
            aria-hidden="true"
          >
            <path
              d="M0 320 Q420 20 900 140 T1400 40 L1400 0 L0 0 Z"
              fill={secondary}
              opacity="0.12"
            />
            <path
              d="M0 360 Q420 60 920 180 T1400 80"
              stroke={primary}
              strokeWidth={12}
              fill="none"
              opacity="0.35"
            />
          </svg>

          {/* Left vertical timeline rail (simplified decorative line after repositioning info) */}
          <div className="absolute left-0 top-0 h-full w-[220px] flex flex-col items-center pt-60">
            <div className="w-[6px] flex-1 bg-gradient-to-b from-transparent via-[rgba(13,148,136,0.35)] to-transparent rounded-full" />
          </div>

          {/* University heading */}
          <div className="absolute top-40 left-[260px] z-20">
            <h1 className="text-[74px] font-black leading-[1.05] tracking-tight">
              <span
                className="bg-clip-text  text-white/80"
                style={{
                  background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                }}
              >
                KHULNA
              </span>{" "}
              <span className="text-slate-800">UNIVERSITY</span>
            </h1>
          </div>

          {/* Cover Type Pill */}
          <div className="absolute top-[330px] left-[260px]">
            <span
              className="inline-block rounded-full border-[6px] px-12 py-5 text-[38px] font-extrabold uppercase tracking-wide bg-white/90 backdrop-blur-sm shadow"
              style={{ borderColor: accent, color: primary }}
            >
              {safe(formData.coverType)}
            </span>
          </div>

          {/* Title */}
          <div className="absolute top-[470px] left-[260px] w-[830px]">
            <h2 className="text-[58px] font-semibold leading-tight text-slate-800">
              {safe(formData.title)}
            </h2>
          </div>

          {/* Repositioned info bar: Course Code / Year & Term / Date */}
          <div className="absolute top-[700px] left-[260px] w-[830px] flex flex-wrap gap-6 items-stretch z-30">
            <div
              className="px-6 py-4 rounded-2xl border bg-white/85 backdrop-blur-sm shadow-sm flex flex-col justify-center"
              style={{ borderColor: primary }}
            >
              <p className="text-[11px] tracking-[0.14em] font-semibold text-gray-500">
                COURSE CODE
              </p>
              <p
                className="text-[24px] font-semibold"
                style={{ color: primary }}
              >
                {safe(formData.courseCode)}
              </p>
            </div>
            <div
              className="px-6 py-4 rounded-2xl border bg-white/85 backdrop-blur-sm shadow-sm flex flex-col justify-center"
              style={{ borderColor: primary }}
            >
              <p className="text-[11px] tracking-[0.14em] font-semibold text-gray-500">
                YEAR / TERM
              </p>
              <p
                className="text-[24px] font-semibold"
                style={{ color: primary }}
              >
                {yearBase}
                {ord(yearBase)} / {termBase}
                {ord(termBase)}
              </p>
            </div>
            <div
              className="px-6 py-4 rounded-2xl border bg-white/85 backdrop-blur-sm shadow-sm flex flex-col justify-center"
              style={{ borderColor: primary }}
            >
              <p className="text-[11px] tracking-[0.14em] font-semibold text-gray-500">
                DATE
              </p>
              <p
                className="text-[24px] font-semibold"
                style={{ color: primary }}
              >
                {dateFmt}
              </p>
            </div>
          </div>

          {/* Course meta (code removed since moved to info bar) */}
          <div className="absolute top-[850px] left-[260px] text-[28px] font-medium space-y-3 text-slate-600">
            <p>
              <span className="font-semibold text-slate-700">
                Course Title:
              </span>{" "}
              {safe(formData.courseTitle)}
            </p>
            {formData.section && formData.section !== "Both" && (
              <p>
                <span className="font-semibold text-slate-700">Section:</span>{" "}
                {formData.section}
              </p>
            )}
          </div>

          {/* Submission panels */}
          <div className="absolute left-[260px] bottom-[230px] w-[830px] grid grid-cols-2 gap-10">
            <div
              className="rounded-3xl border bg-white/80 backdrop-blur-sm p-8 shadow-lg"
              style={{ borderColor: primary }}
            >
              <h3
                className="text-[30px] font-bold mb-4"
                style={{ color: primary }}
              >
                Submitted By
              </h3>
              <ul className="space-y-1 text-[20px] font-medium text-slate-600">
                <li>{safe(formData.studentName)}</li>
                <li>{safe(formData.studentId)}</li>
                <li>{safe(formData.studentDiscipline)} Discipline</li>
                <li>{safe(formData.studentInstitute)}</li>
              </ul>
            </div>
            <div
              className="rounded-3xl border bg-white/80 backdrop-blur-sm p-8 shadow-lg"
              style={{ borderColor: primary }}
            >
              <h3
                className="text-[30px] font-bold mb-4"
                style={{ color: primary }}
              >
                Submitted To
              </h3>
              <ul className="space-y-1 text-[20px] font-medium text-slate-600">
                <li>{safe(formData.teacherName)}</li>
                <li>{safe(formData.degree)}</li>
                <li>{safe(formData.teacherDiscipline)} Discipline</li>
                <li>{safe(formData.teacherInstitute)}</li>
              </ul>
            </div>
          </div>

          {/* Date footer simplified if needed (already in timeline), optional watermark */}
          <div className="absolute -bottom-10 right-0 opacity-[0.08] select-none pointer-events-none">
            <h1
              className="font-black text-[300px] tracking-tighter"
              style={{
                background: `linear-gradient(90deg, ${secondary}, ${primary})`,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              KU
            </h1>
          </div>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign11.displayName = "CoverDesign11";

export { CoverDesign11 };
export default CoverDesign11;
