"use client";
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { CoverData, ResponsiveWrapper } from "./CoverDesigns";

/*
 * CoverDesign6 – Minimal centered layout with geometric accent bars.
 *  - Focus on symmetrical balance and quick readability.
 *  - Pure CSS/SVG; no external images.
 */

export interface CoverDesign6Props {
  formData: CoverData;
  className?: string;
  primary?: string;
  accent?: string;
}

const CoverDesign6 = forwardRef<HTMLDivElement, CoverDesign6Props>(
  (
    {
      formData,
      className,
      primary = "#1e3a8a", // indigo-800
      accent = "#f97316", // orange-500
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
      const mod10 = n % 10;
      const mod100 = n % 100;
      if (mod10 === 1 && mod100 !== 11) return "st";
      if (mod10 === 2 && mod100 !== 12) return "nd";
      if (mod10 === 3 && mod100 !== 13) return "rd";
      return "th";
    };
    const yearBase = extract(formData.year);
    const termBase = extract(formData.term);

    return (
      <ResponsiveWrapper className={className}>
        <div
          data-theme="light"
          ref={ref}
          className="design-base relative w-[1240px] h-[1740px] bg-white flex flex-col items-center px-28 pt-32 pb-24 text-center"
        >
          {/* Top accent bars */}
          <div className="absolute top-0 left-0 right-0 flex flex-col gap-2 p-10">
            <div
              className="h-3 w-full rounded-full"
              style={{ background: primary }}
            />
            <div
              className="h-3 w-3/5 rounded-full ml-auto"
              style={{ background: accent }}
            />
          </div>

          {/* University */}
          <h1 className="mt-10 text-[68px] font-extrabold tracking-tight leading-[1.05]">
            <span style={{ color: accent }}>Khulna</span>{" "}
            <span style={{ color: primary }}>University</span>
          </h1>
          <div
            className="mt-6 h-1 w-64 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accent}, ${primary})`,
            }}
          />

          {/* Type */}
          <p
            className="mt-24 text-[44px] font-bold uppercase tracking-wide"
            style={{ color: primary }}
          >
            {safe(formData.coverType)}
          </p>
          <p
            className="mt-3 text-[70px] font-black leading-none bg-clip-text"
            style={{ color: primary }}
          >
            ON
          </p>

          {/* Title */}
          <h2
            className="mt-12 text-[50px] font-semibold leading-tight max-w-4xl"
            style={{ color: primary }}
          >
            {safe(formData.title)}
          </h2>

          {/* Course */}
          <div
            className="mt-16 space-y-3 text-[26px] font-medium"
            style={{ color: primary }}
          >
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

          {/* Submission */}
          <div className="mt-24 grid grid-cols-2 gap-16 text-left text-[24px] leading-relaxed font-medium">
            <div>
              <h3
                className="text-[30px] font-bold mb-3"
                style={{ color: accent }}
              >
                Submitted By
              </h3>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {safe(formData.studentName)}
              </p>
              <p>
                <span className="font-semibold">ID:</span>{" "}
                {safe(formData.studentId)}
              </p>
              <p>
                <span className="font-semibold">Year:</span> {yearBase}
                <sup>{ord(yearBase)}</sup>{" "}
                <span className="font-semibold ml-3">Term:</span> {termBase}
                <sup>{ord(termBase)}</sup>
              </p>
              <p>{safe(formData.studentDiscipline)} Discipline</p>
              <p>{safe(formData.studentInstitute)}</p>
            </div>
            <div>
              <h3
                className="text-[30px] font-bold mb-3"
                style={{ color: accent }}
              >
                Submitted To
              </h3>
              <p>{safe(formData.teacherName)}</p>
              <p>{safe(formData.degree)}</p>
              <p>{safe(formData.teacherDiscipline)} Discipline</p>
              <p>{safe(formData.teacherInstitute)}</p>
            </div>
          </div>

          {/* Date */}
          <div className="mt-auto pt-24">
            <p className="text-[24px] tracking-wide text-gray-600">
              Date of Submission
            </p>
            <p
              className="mt-1 text-[36px] font-semibold"
              style={{ color: primary }}
            >
              {dateStr}
            </p>
          </div>

          {/* Bottom accent bars */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-10">
            <div
              className="h-3 w-2/3 rounded-full"
              style={{ background: accent }}
            />
            <div
              className="h-3 w-full rounded-full ml-auto"
              style={{ background: primary }}
            />
          </div>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign6.displayName = "CoverDesign6";

export { CoverDesign6 };
export default CoverDesign6;
