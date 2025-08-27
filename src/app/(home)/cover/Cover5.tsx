"use client";
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { CoverData, ResponsiveWrapper } from "./CoverDesigns";

/*
 * CoverDesign5 – A clean modern layout emphasizing hierarchy with a left accent band
 *  - Uses ResponsiveWrapper (fixed 1240x1740 artboard with fluid scale)
 *  - Focus on strong typography, generous whitespace, and semantic grouping
 *  - Lightweight (no external images) – pure CSS / SVG for print reliability
 */

export interface CoverDesign5Props {
  formData: CoverData;
  className?: string;
  accent?: string; // primary accent color
  secondary?: string; // secondary accent (defaults derived)
}

const CoverDesign5 = forwardRef<HTMLDivElement, CoverDesign5Props>(
  ({ formData, className, accent = "#0d47a1", secondary = "#1976d2" }, ref) => {
    const safe = (v: string) => v || "—";
    const fmtDate = (() => {
      try {
        return format(new Date(formData.date), "MMM dd, yyyy");
      } catch {
        return safe(formData.date);
      }
    })();

    // Helpers for ordinal extraction like other designs
    const extract = (raw: string) => raw.match(/\d+/)?.[0] || raw;
    const ordinal = (nStr: string) => {
      const n = parseInt(nStr, 10);
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
          className="design-base relative w-[1240px] h-[1740px] bg-white overflow-hidden flex flex-col"
          style={(() => {
            const style: React.CSSProperties & Record<string, string> = {};
            style["--accent"] = accent;
            style["--accent-secondary"] = secondary;
            style["--accent-fade"] = accent + "11"; // low alpha extension
            style["--accent-soft"] = accent + "22";
            return style;
          })()}
        >
          {/* Left vertical accent band */}
          <div
            className="absolute inset-y-0 left-0 w-[130px]"
            style={{
              background: `linear-gradient(180deg,var(--accent),var(--accent-secondary))`,
            }}
          />
          {/* Subtle gradient overlay for depth */}
          <div
            className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
            style={{
              background:
                "linear-gradient(125deg, var(--accent-fade), transparent 55%)",
            }}
          />
          {/* Decorative circles */}
          <div
            className="absolute -top-28 -right-40 w-[520px] h-[520px] rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, var(--accent-soft), transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[-160px] right-[-120px] w-[420px] h-[420px] rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 60% 40%, var(--accent-secondary), transparent 75%)",
            }}
          />

          {/* Header */}
          <header className="pl-[160px] pr-16 pt-20">
            <h1 className="text-[60px] leading-[1.05] font-extrabold tracking-wide uppercase">
              <span style={{ color: accent }}>Khulna</span>{" "}
              <span style={{ color: secondary }}>University</span>
            </h1>
            <div
              className="mt-6 h-[10px] w-[360px] rounded-r-full"
              style={{
                background: `linear-gradient(90deg, ${accent}, ${secondary})`,
              }}
            />
          </header>

          {/* Cover Type & Title */}
          <section className="pl-[160px] pr-16 mt-20">
            <div
              className="inline-block mb-8 px-10 py-5 border-[5px] rounded-2xl bg-white/80 backdrop-blur-sm shadow"
              style={{ borderColor: accent }}
            >
              <p
                className="text-[40px] font-bold uppercase tracking-wide"
                style={{ color: accent }}
              >
                {safe(formData.coverType)}
              </p>
            </div>
            <p
              className="text-[120px] font-black tracking-tighter leading-none uppercase text-transparent bg-clip-text"
              style={{
                background: `linear-gradient(90deg, ${accent}, ${secondary})`,
              }}
            >
              ON
            </p>
            <h2
              className="mt-10 text-[46px] font-semibold leading-snug max-w-[820px]"
              style={{ color: secondary }}
            >
              {safe(formData.title)}
            </h2>
          </section>

          {/* Course Info */}
          <section
            className="pl-[160px] pr-16 mt-16 space-y-3 text-[24px] font-medium"
            style={{ color: accent }}
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
          </section>

          {/* Submission details */}
          <section
            className="mt-20 mx-[160px] rounded-3xl border shadow-sm grid grid-cols-2 gap-10 p-12 text-[22px] leading-relaxed bg-white/80 backdrop-blur-sm"
            style={{ borderColor: accent }}
          >
            <div className="space-y-2">
              <h3
                className="text-[30px] font-bold tracking-wide"
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
                <sup>{ordinal(yearBase)}</sup>{" "}
                <span className="font-semibold ml-3">Term:</span> {termBase}
                <sup>{ordinal(termBase)}</sup>
              </p>
              <p>{safe(formData.studentDiscipline)} Discipline</p>
              <p>{safe(formData.studentInstitute)}</p>
            </div>
            <div className="space-y-2">
              <h3
                className="text-[30px] font-bold tracking-wide"
                style={{ color: accent }}
              >
                Submitted To
              </h3>
              <p>{safe(formData.teacherName)}</p>
              <p>{safe(formData.degree)}</p>
              <p>{safe(formData.teacherDiscipline)} Discipline</p>
              <p>{safe(formData.teacherInstitute)}</p>
            </div>
          </section>

          {/* Footer Date */}
          <footer className="mt-auto mb-20 pl-[160px] pr-16 text-[22px]">
            <p className="tracking-wide text-gray-600">Date of Submission</p>
            <p
              className="mt-1 text-[32px] font-semibold"
              style={{ color: accent }}
            >
              {fmtDate}
            </p>
          </footer>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign5.displayName = "CoverDesign5";

export { CoverDesign5 };
export default CoverDesign5;
