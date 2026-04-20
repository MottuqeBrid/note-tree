"use client";
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { CoverData, ResponsiveWrapper } from "./CoverDesigns";

export interface CoverDesign14Props {
  formData: CoverData;
  className?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
}

const CoverDesign14 = forwardRef<HTMLDivElement, CoverDesign14Props>(
  (
    {
      formData,
      className,
      primary = "#7c3aed",
      secondary = "#a78bfa",
      accent = "#f59e0b",
    },
    ref,
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
          <div
            className="absolute top-0 left-0 w-full h-[380px]"
            style={{
              background: `linear-gradient(180deg, ${primary}, ${secondary})`,
            }}
          />

          <div
            className="absolute top-[380px] left-0 w-full h-[16px]"
            style={{
              background: `linear-gradient(180deg, ${secondary}, transparent)`,
              opacity: 0.6,
            }}
          />

          <svg
            className="absolute top-[280px] left-[-100px] w-[500px] h-[500px]"
            viewBox="0 0 500 500"
            aria-hidden="true"
          >
            <circle cx="250" cy="250" r="250" fill={secondary} opacity="0.15" />
          </svg>
          <svg
            className="absolute top-[20px] right-[-80px] w-[400px] h-[400px]"
            viewBox="0 0 400 400"
            aria-hidden="true"
          >
            <circle cx="200" cy="200" r="200" fill={accent} opacity="0.2" />
          </svg>

          <div className="absolute top-[80px] left-0 right-0 text-center z-10">
            <h1 className="text-[82px] font-black tracking-tight text-white drop-shadow-lg">
              KHULNA UNIVERSITY
            </h1>
            <div
              className="mt-4 h-2 w-40 mx-auto rounded-full"
              style={{ background: accent }}
            />
          </div>

          <div className="absolute top-[520px] left-[100px] right-[100px]">
            <div className="text-center 0b-8" style={{ color: primary }}>
              <span className="inline-block px-16 py-6 rounded-full border-[6px] bg-white/90 backdrop-blur-sm text-[48px] font-extrabold uppercase tracking-wide shadow-lg">
                {safe(formData.coverType)}
              </span>
            </div>

            <div className="text-center mb-4">
              <span className="text-[130px] font-black tracking-tight text-slate-400">
                ON
              </span>
            </div>

            <h2 className="text-[56px] font-semibold text-center leading-tight text-slate-800 mb-8">
              {safe(formData.title)}
            </h2>

            <div className="flex justify-center gap-8 text-[28px] font-medium text-slate-600">
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
            </div>

            <div className="text-center mt-6 text-[26px] font-medium text-slate-500">
              <span className="font-semibold">Year:</span> {yearBase}
              <sup>{ord(yearBase)}</sup>{" "}
              <span className="font-semibold ml-4">Term:</span> {termBase}
              <sup>{ord(termBase)}</sup>
            </div>
          </div>

          <div className="absolute left-[100px] right-[100px] bottom-[220px] grid grid-cols-2 gap-16">
            <div
              className="rounded-3xl border bg-white/90 backdrop-blur-sm p-8 shadow-xl"
              style={{ borderColor: primary }}
            >
              <h3
                className="text-[34px] font-bold mb-4"
                style={{ color: primary }}
              >
                Submitted By
              </h3>
              <ul className="space-y-2 text-[22px] font-medium text-slate-600">
                <li>{safe(formData.studentName)}</li>
                <li>{safe(formData.studentId)}</li>
                <li>{safe(formData.studentDiscipline)} Discipline</li>
                <li>{safe(formData.studentInstitute)}</li>
              </ul>
            </div>
            <div
              className="rounded-3xl border bg-white/90 backdrop-blur-sm p-8 shadow-xl"
              style={{ borderColor: primary }}
            >
              <h3
                className="text-[34px] font-bold mb-4"
                style={{ color: primary }}
              >
                Submitted To
              </h3>
              <ul className="space-y-2 text-[22px] font-medium text-slate-600">
                <li>{safe(formData.teacherName)}</li>
                <li>{safe(formData.degree)}</li>
                <li>{safe(formData.teacherDiscipline)} Discipline</li>
                <li>{safe(formData.teacherInstitute)}</li>
              </ul>
            </div>
          </div>

          <div className="absolute bottom-[80px] left-0 right-0 text-center">
            <div className="inline-block px-10 py-4 rounded-full bg-slate-300 text-black text-[24px] font-medium">
              <span className="text-slate-900">Date of Submission:</span>{" "}
              {dateFmt}
            </div>
          </div>

          <div className="absolute -bottom-32 -right-10 opacity-[0.04] select-none pointer-events-none">
            <h1
              className="font-black text-[400px] tracking-tighter"
              // style={{
              //   background: `linear-gradient(90deg, ${secondary}, ${primary})`,
              //   WebkitBackgroundClip: "text",
              //   color: "transparent",
              // }}
            >
              KU
            </h1>
          </div>
        </div>
      </ResponsiveWrapper>
    );
  },
);
CoverDesign14.displayName = "CoverDesign14";

export { CoverDesign14 };
export default CoverDesign14;
