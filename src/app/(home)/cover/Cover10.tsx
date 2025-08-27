"use client";
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { CoverData, ResponsiveWrapper } from "./CoverDesigns";

export interface CoverDesign10Props {
  formData: CoverData;
  className?: string;
  primary?: string; // main brand color
  secondary?: string; // secondary gradient mate
  accent?: string; // highlight / separators
  scheme?: "indigo" | "teal" | "crimson" | "emerald"; // optional quick palette
}

const CoverDesign10 = forwardRef<HTMLDivElement, CoverDesign10Props>(
  (
    {
      formData,
      className,
      primary = "#4f46e5", // indigo-600
      secondary = "#6366f1", // indigo-500
      accent = "#f97316", // orange-500
      scheme,
    },
    ref
  ) => {
    const safe = (v: string) => v || "—";
    // Palette presets (allows quick font/color scheme switching)
    if (scheme) {
      const palettes: Record<string, { p: string; s: string; a: string }> = {
        indigo: { p: "#4f46e5", s: "#6366f1", a: "#f97316" },
        teal: { p: "#0f766e", s: "#14b8a6", a: "#f59e0b" },
        crimson: { p: "#b91c1c", s: "#dc2626", a: "#fb923c" },
        emerald: { p: "#047857", s: "#10b981", a: "#f59e0b" },
      };
      const chosen = palettes[scheme];
      if (chosen) {
        primary = chosen.p;
        secondary = chosen.s;
        accent = chosen.a;
      }
    }
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
          style={{
            ...({
              "--c-primary": primary,
              "--c-secondary": secondary,
              "--c-accent": accent,
              "--c-text-strong": "#1e293b",
              "--c-text-body": "#334155",
              "--c-text-muted": "#64748b",
            } as React.CSSProperties),
          }}
        >
          {/* Background base subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              aria-hidden="true"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern
                  id="d10grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M20 0H0V20" stroke={primary} strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#d10grid)" />
            </svg>
          </div>

          {/* Diagonal angular strata */}
          <div
            className="absolute -top-10 -left-40 w-[900px] h-[620px] rotate-[-10deg]"
            style={{
              background: `linear-gradient(110deg, ${primary}, ${secondary})`,
              boxShadow: `0 25px 60px -10px ${primary}40`,
            }}
          />
          <div
            className="absolute top-[380px] -left-72 w-[780px] h-[520px] rotate-[12deg] opacity-80"
            style={{
              background: `linear-gradient(120deg, ${secondary}, ${primary})`,
              filter: "blur(2px)",
            }}
          />
          <div
            className="absolute bottom-[-220px] -right-56 w-[1000px] h-[760px] rotate-[18deg]"
            style={{
              background: `linear-gradient(130deg, ${secondary} 0%, ${primary} 60%, ${secondary} 100%)`,
              boxShadow: `0 0 0 120px #ffffff10`,
            }}
          />
          <div
            className="absolute bottom-[260px] right-[-180px] w-[720px] h-[460px] rotate-[-14deg] opacity-70"
            style={{
              background: `linear-gradient(100deg, ${primary}, ${secondary})`,
              filter: "blur(4px)",
            }}
          />

          {/* Accent lines */}
          <div
            className="absolute left-0 top-0 h-full w-[8px]"
            style={{ background: accent }}
          />
          <div
            className="absolute right-0 top-0 h-full w-[4px]"
            style={{ background: primary }}
          />

          {/* Floating metadata cards */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 space-y-6 w-[300px] z-20">
            <div
              className="rounded-2xl border backdrop-blur-sm bg-white/80 p-6 shadow-xl"
              style={{ borderColor: primary }}
            >
              <h3
                className="text-[26px] font-bold mb-2"
                style={{ color: "var(--c-text-strong)" }}
              >
                Submitted By
              </h3>
              <ul
                className="space-y-1 text-[15px] font-medium"
                style={{ color: "var(--c-text-body)" }}
              >
                <li>{safe(formData.studentName)}</li>
                <li>{safe(formData.studentId)}</li>
                <li>{safe(formData.studentDiscipline)} Discipline</li>
                <li>{safe(formData.studentInstitute)}</li>
              </ul>
            </div>
            <div
              className="rounded-2xl border backdrop-blur-sm bg-white/80 p-6 shadow-xl"
              style={{ borderColor: primary }}
            >
              <h3
                className="text-[26px] font-bold mb-2"
                style={{ color: "var(--c-text-strong)" }}
              >
                Submitted To
              </h3>
              <ul
                className="space-y-1 text-[15px] font-medium"
                style={{ color: "var(--c-text-body)" }}
              >
                <li>{safe(formData.teacherName)}</li>
                <li>{safe(formData.degree)}</li>
                <li>{safe(formData.teacherDiscipline)} Discipline</li>
                <li>{safe(formData.teacherInstitute)}</li>
              </ul>
            </div>
          </div>

          {/* Central Content Column */}
          <div
            className="relative z-30 flex flex-col items-center text-center mx-auto"
            style={{ width: "760px", marginTop: "140px" }}
          >
            <h1 className="text-[70px] font-black tracking-tight leading-[1.05] drop-shadow-sm">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  color: "var(--c-text-strong)",
                }}
              >
                KHULNA
              </span>{" "}
              <span style={{ color: "var(--c-text-strong)" }}>UNIVERSITY</span>
            </h1>
            <div
              className="mt-5 h-3 w-60 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${accent}, ${primary})`,
              }}
            />
            <div className="mt-14 flex items-center gap-4">
              <span
                className="px-10 py-4 rounded-full border-[6px] bg-white/90 backdrop-blur-sm text-[40px] font-extrabold uppercase tracking-wide"
                style={{ borderColor: accent, color: primary }}
              >
                {safe(formData.coverType)}
              </span>
              <span
                className="text-[120px] font-black bg-clip-text text-transparent leading-none"
                style={{
                  background: `linear-gradient(90deg, ${primary}, ${accent})`,
                }}
              >
                ON
              </span>
            </div>
            <h2
              className="mt-10 text-[56px] font-semibold leading-tight max-w-[680px]"
              style={{ color: "var(--c-text-strong)" }}
            >
              {safe(formData.title)}
            </h2>
            <div
              className="mt-10 flex flex-col gap-2 text-[26px] font-medium"
              style={{ color: "var(--c-text-body)" }}
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
              <p className="pt-4">
                <span className="font-semibold">Year:</span> {yearBase}
                <sup>{ord(yearBase)}</sup>{" "}
                <span className="font-semibold ml-4">Term:</span> {termBase}
                <sup>{ord(termBase)}</sup>
              </p>
            </div>
            <div
              className="mt-16 text-[22px] font-medium tracking-wide"
              style={{ color: "var(--c-text-muted)" }}
            >
              <p>Date of Submission</p>
              <p
                className="mt-1 text-[36px] font-semibold"
                style={{ color: primary }}
              >
                {dateFmt}
              </p>
            </div>
          </div>

          {/* Subtle center radial highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 55% 48%, ${secondary}20 0%, transparent 62%)`,
            }}
          />

          {/* Decorative angled SVG strokes */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1240 1740"
            aria-hidden="true"
          >
            <path
              d="M-40 420 L840 -40"
              stroke={accent}
              strokeWidth={10}
              opacity="0.15"
            />
            <path
              d="M1240 1320 L400 1840"
              stroke={primary}
              strokeWidth={14}
              opacity="0.10"
            />
            <path
              d="M1240 980 L620 1740"
              stroke={secondary}
              strokeWidth={8}
              opacity="0.10"
            />
          </svg>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign10.displayName = "CoverDesign10";

export { CoverDesign10 };
export default CoverDesign10;
