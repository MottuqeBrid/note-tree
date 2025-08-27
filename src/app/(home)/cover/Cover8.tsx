"use client";
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { CoverData, ResponsiveWrapper } from "./CoverDesigns";

/*
 * CoverDesign8 – Grid modular layout with left metadata rail & right content panel
 *  - Distinct vertical rail for quick scanning (course + submission)
 *  - Uses CSS grid; pure CSS/SVG (print friendly)
 */

export interface CoverDesign8Props {
  formData: CoverData;
  className?: string;
  accent?: string;
  accentAlt?: string;
}

const CoverDesign8 = forwardRef<HTMLDivElement, CoverDesign8Props>(
  (
    {
      formData,
      className,
      accent = "#0f766e", // teal-700
      accentAlt = "#14b8a6", // teal-500
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
          className="design-base relative w-[1240px] h-[1740px] bg-white overflow-hidden grid"
          style={{ gridTemplateColumns: "340px 1fr" }}
        >
          {/* Left Rail */}
          <aside
            className="relative h-full flex flex-col"
            style={{
              background: `linear-gradient(180deg, ${accent} 0%, ${accentAlt} 100%)`,
            }}
          >
            <div className="p-12 text-white flex flex-col gap-10">
              <header>
                <h1 className="text-[54px] font-extrabold leading-[1.05] tracking-tight">
                  <span className="block">Khulna</span>
                  <span className="block">University</span>
                </h1>
                <div className="mt-4 h-1.5 w-32 rounded-full bg-white/80" />
              </header>

              <section className="space-y-3 text-[20px] font-medium">
                <p>
                  <span className="font-semibold">Course:</span>
                  <br /> {safe(formData.courseTitle)}
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
              </section>

              <section className="space-y-2 text-[17px]">
                <h3 className="text-[22px] font-bold tracking-wide">
                  Submitted By
                </h3>
                <p className="font-medium">{safe(formData.studentName)}</p>
                <p>{safe(formData.studentId)}</p>
                <p>{safe(formData.studentDiscipline)} Discipline</p>
                <p>{safe(formData.studentInstitute)}</p>
              </section>

              <section className="space-y-2 text-[17px]">
                <h3 className="text-[22px] font-bold tracking-wide">
                  Submitted To
                </h3>
                <p className="font-medium">{safe(formData.teacherName)}</p>
                <p>{safe(formData.degree)}</p>
                <p>{safe(formData.teacherDiscipline)} Discipline</p>
                <p>{safe(formData.teacherInstitute)}</p>
              </section>

              <section className="mt-auto pt-8 text-[18px] font-medium">
                <p>Date:</p>
                <p className="text-[22px] font-semibold">{dateFmt}</p>
              </section>
            </div>
            {/* Decorative vertical stripes */}
            <div className="absolute top-0 right-0 h-full w-[10px] bg-white/25" />
            <div className="absolute top-0 right-[18px] h-full w-[4px] bg-white/35" />
          </aside>

          {/* Right Content Panel */}
          <main className="relative h-full flex flex-col p-24">
            {/* Background pattern (light grid) */}
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(0deg,#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            {/* Large watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-[250px] font-black tracking-tighter text-[rgba(0,0,0,0.03)] leading-none">
                KU
              </span>
            </div>

            <div className="relative z-10">
              <div
                className="inline-block mb-14 px-12 py-6 border-[6px] rounded-3xl shadow-sm bg-white/70 backdrop-blur-sm"
                style={{ borderColor: accent }}
              >
                <p
                  className="text-[46px] font-bold uppercase tracking-wide"
                  style={{ color: accent }}
                >
                  {safe(formData.coverType)}
                </p>
              </div>
              <p
                className="text-[110px] font-black uppercase leading-none tracking-tight text-transparent bg-clip-text"
                style={{
                  background: `linear-gradient(90deg, ${accent}, ${accentAlt})`,
                }}
              >
                ON
              </p>
              <h2
                className="mt-12 text-[56px] font-semibold leading-tight max-w-[760px]"
                style={{ color: accent }}
              >
                {safe(formData.title)}
              </h2>
              <div className="mt-12 text-[26px] font-medium text-neutral-700">
                <p>
                  <span className="font-semibold">Year:</span> {yearBase}
                  <sup>{ord(yearBase)}</sup>{" "}
                  <span className="font-semibold ml-4">Term:</span> {termBase}
                  <sup>{ord(termBase)}</sup>
                </p>
              </div>
            </div>

            {/* Bottom indicator bar */}
            <div className="relative z-10 mt-auto pt-24">
              <div
                className="h-4 w-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${accent}, ${accentAlt})`,
                }}
              />
            </div>
          </main>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign8.displayName = "CoverDesign8";

export { CoverDesign8 };
export default CoverDesign8;
