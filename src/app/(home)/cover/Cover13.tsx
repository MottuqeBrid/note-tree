"use client";
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { CoverData, ResponsiveWrapper } from "./CoverDesigns";

export interface CoverDesign13Props {
  formData: CoverData;
  className?: string;
  accent?: string;
  accentAlt?: string;
  neutral?: string;
}

const CoverDesign13 = forwardRef<HTMLDivElement, CoverDesign13Props>(
  (
    {
      formData,
      className,
      accent = "#f97316", // orange-500
      accentAlt = "#fb923c", // orange-400
      neutral = "#0f172a",
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
          {/* Left accent bar */}
          <div
            className="absolute left-0 top-0 h-full w-[140px]"
            style={{
              background: `linear-gradient(180deg, ${accent}, ${accentAlt})`,
            }}
          />
          <div
            className="absolute left-[140px] top-0 h-full w-[10px]"
            style={{ background: accentAlt, opacity: 0.3 }}
          />

          {/* Decorative floating chips */}
          {[160, 420, 680, 940].map((y, i) => (
            <div key={y} className="absolute left-10" style={{ top: y }}>
              <div
                className="w-5 h-5 rounded-full mb-6"
                style={{
                  background: i % 2 ? accentAlt : accent,
                  boxShadow: `0 0 0 6px #ffffff`,
                  border: `2px solid ${i % 2 ? accent : accentAlt}`,
                }}
              />
            </div>
          ))}

          {/* University heading */}
          <div className="absolute left-[210px] top-[170px]">
            <h1 className="text-[84px] font-black leading-[0.95] tracking-tight">
              <span style={{ color: neutral }}>Khulna</span>{" "}
              <span
                className="bg-clip-text text-white/80 rounded-2xl px-2"
                style={{
                  background: `linear-gradient(90deg, ${accent}, ${accentAlt})`,
                }}
              >
                University
              </span>
            </h1>
          </div>

          {/* Cover type pill */}
          <div className="absolute left-[210px] top-[470px]">
            <span
              className="inline-block px-12 py-5 rounded-full border-[6px] bg-white/90 backdrop-blur-sm text-[44px] font-extrabold uppercase tracking-wide shadow"
              style={{ borderColor: accent, color: accent }}
            >
              {safe(formData.coverType)}
            </span>
          </div>

          {/* The requested "ON" pill placed near title */}
          <div className="absolute left-[320px] top-[600px]">
            <span className="inline-block px-8 py-4 rounded-xl border-[3px] bg-white/90 backdrop-blur-sm text-[24px] font-extrabold uppercase tracking-wide shadow">
              ON
            </span>
          </div>

          {/* Title */}
          <div className="absolute left-[180px] top-[720px] w-[580px] text-start">
            <h2
              className="text-[52px] font-semibold leading-[1.05]"
              style={{ color: neutral }}
            >
              {safe(formData.title)}
            </h2>
          </div>

          {/* Meta */}
          <div className="absolute left-[210px] top-[1020px] space-y-4 text-[30px] font-medium text-slate-600">
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
            <p>
              <span className="font-semibold text-slate-700">Code:</span>{" "}
              {safe(formData.courseCode)}
            </p>
            <p className="pt-4">
              <span className="font-semibold text-slate-700">Year:</span>{" "}
              {yearBase}
              <sup>{ord(yearBase)}</sup>{" "}
              <span className="font-semibold ml-6">Term:</span> {termBase}
              <sup>{ord(termBase)}</sup>
            </p>
          </div>

          {/* Submission cards (right side vertical) */}
          <div className="absolute right-[90px] top-[540px] w-[360px] flex flex-col gap-10">
            <div
              className="rounded-3xl border bg-white/85 backdrop-blur-sm p-8 shadow-lg"
              style={{ borderColor: accent }}
            >
              <h3
                className="text-[32px] font-bold mb-4"
                style={{ color: accent }}
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
              className="rounded-3xl border bg-white/85 backdrop-blur-sm p-8 shadow-lg"
              style={{ borderColor: accent }}
            >
              <h3
                className="text-[32px] font-bold mb-4"
                style={{ color: accent }}
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

          {/* Date footer */}
          <div className="absolute bottom-[140px] left-[210px] text-[26px] font-medium text-slate-500">
            <p>Date of Submission</p>
            <p
              className="mt-1 text-[36px] font-semibold"
              style={{ color: accent }}
            >
              {dateFmt}
            </p>
          </div>

          {/* Watermark */}
          <div className="absolute -bottom-20 -right-10 opacity-[0.06] select-none pointer-events-none">
            <h1
              className="font-black text-[340px] tracking-tighter"
              style={{
                background: `linear-gradient(90deg, ${accent}, ${accentAlt})`,
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
CoverDesign13.displayName = "CoverDesign13";

export { CoverDesign13 };
export default CoverDesign13;
