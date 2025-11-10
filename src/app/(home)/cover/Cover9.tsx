"use client";
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { CoverData, ResponsiveWrapper } from "./CoverDesigns";

/*
 * CoverDesign9 – Concentric ring focus layout with radial accent & floating info chips.
 *  - Central hero circle containing core metadata.
 *  - Peripheral chips for submitted by / to; large subtle radial background.
 *  - Pure CSS/SVG, print friendly.
 */

export interface CoverDesign9Props {
  formData: CoverData;
  className?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
}

const CoverDesign9 = forwardRef<HTMLDivElement, CoverDesign9Props>(
  (
    {
      formData,
      className,
      primary = "#1d4ed8", // blue-700
      secondary = "#3b82f6", // blue-500
      accent = "#f59e0b", // amber-500
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
          className="design-base relative w-[1240px] h-[1740px] bg-white overflow-hidden flex items-center justify-center"
        >
          {/* Radial background */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${secondary}11 0%, #ffffff 70%)`,
            }}
          />

          {/* Concentric decorative rings */}
          {[520, 760, 1000].map((d, i) => (
            <div
              key={d}
              className="absolute rounded-full border"
              style={{
                width: d,
                height: d,
                borderColor: i === 1 ? secondary + "44" : secondary + "22",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* Central Content Circle */}
          <div
            className="relative z-10 w-[880px] h-[880px] rounded-full bg-white shadow-xl border-8 flex flex-col items-center text-center px-24 pt-32 pb-28"
            style={{ borderColor: secondary }}
          >
            <h1 className="text-[66px] font-extrabold leading-[1.05] tracking-tight mb-8">
              <span style={{ color: primary }}>Khulna</span>{" "}
              <span style={{ color: secondary }}>University</span>
            </h1>
            <div
              className="h-2 w-52 rounded-full mb-16"
              style={{
                background: `linear-gradient(90deg, ${primary}, ${secondary})`,
              }}
            />
            <div
              className="inline-block mb-14 px-12 py-5 border-[6px] rounded-3xl bg-white/80 backdrop-blur-sm shadow"
              style={{ borderColor: primary }}
            >
              <p
                className="text-[44px] font-bold uppercase tracking-wide"
                style={{ color: primary }}
              >
                {safe(formData.coverType)}
              </p>
            </div>
            <p
              className="text-[118px] font-black leading-none bg-clip-text"
              style={
                {
                  // background: `linear-gradient(90deg, ${accent}, ${primary})`,
                }
              }
            >
              ON
            </p>
            <h2
              className="mt-12 text-[54px] font-semibold leading-tight max-w-[640px]"
              style={{ color: primary }}
            >
              {safe(formData.title)}
            </h2>
            <div
              className="mt-12 text-[26px] font-medium"
              style={{ color: secondary }}
            >
              <p>
                <span className="font-semibold">Course:</span>{" "}
                {safe(formData.courseTitle)}
              </p>
              {formData.section && formData.section !== "Both" && (
                <p>
                  <span className="font-semibold">Section:</span>{" "}
                  {formData.section}
                </p>
              )}
              <p>
                <span className="font-semibold">Code:</span>{" "}
                {safe(formData.courseCode)}
              </p>
              <p className="mt-6">
                <span className="font-semibold">Year:</span> {yearBase}
                <sup>{ord(yearBase)}</sup>{" "}
                <span className="font-semibold ml-4">Term:</span> {termBase}
                <sup>{ord(termBase)}</sup>
              </p>
            </div>
            <div className="mt-auto pt-12">
              <p className="text-[22px] tracking-wide text-gray-600">
                Date of Submission
              </p>
              <p
                className="mt-1 text-[34px] font-semibold"
                style={{ color: primary }}
              >
                {dateFmt}
              </p>
            </div>
          </div>

          {/* Floating Chips */}
          <div className="absolute z-20 left-24 top-1/2 -translate-y-1/2 w-[300px] space-y-6">
            <div
              className="rounded-2xl border bg-white/90 backdrop-blur-sm p-6 shadow"
              style={{ borderColor: primary }}
            >
              <h3
                className="text-[26px] font-bold mb-2"
                style={{ color: primary }}
              >
                Submitted By
              </h3>
              <p
                className="text-[20px] font-medium"
                style={{ color: secondary }}
              >
                {safe(formData.studentName)}
              </p>
              <p className="text-[18px]" style={{ color: secondary }}>
                {safe(formData.studentId)}
              </p>
              <p className="text-[16px] mt-2" style={{ color: secondary }}>
                {safe(formData.studentDiscipline)} Discipline
              </p>
              <p className="text-[16px]" style={{ color: secondary }}>
                {safe(formData.studentInstitute)}
              </p>
            </div>
            <div
              className="rounded-2xl border bg-white/90 backdrop-blur-sm p-6 shadow"
              style={{ borderColor: primary }}
            >
              <h3
                className="text-[26px] font-bold mb-2"
                style={{ color: primary }}
              >
                Submitted To
              </h3>
              <p
                className="text-[20px] font-medium"
                style={{ color: secondary }}
              >
                {safe(formData.teacherName)}
              </p>
              <p className="text-[18px]" style={{ color: secondary }}>
                {safe(formData.degree)}
              </p>
              <p className="text-[16px] mt-2" style={{ color: secondary }}>
                {safe(formData.teacherDiscipline)} Discipline
              </p>
              <p className="text-[16px]" style={{ color: secondary }}>
                {safe(formData.teacherInstitute)}
              </p>
            </div>
          </div>

          {/* Accent arcs */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1240 1740"
            aria-hidden="true"
          >
            <path
              d="M620 10 a610 610 0 0 1 0 1220"
              stroke={accent}
              strokeWidth={14}
              fill="none"
              opacity="0.08"
            />
            <path
              d="M620 250 a360 360 0 0 1 0 720"
              stroke={primary}
              strokeWidth={10}
              fill="none"
              opacity="0.08"
            />
          </svg>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign9.displayName = "CoverDesign9";

export { CoverDesign9 };
export default CoverDesign9;
