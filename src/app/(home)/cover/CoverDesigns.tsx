"use client";
import React, { forwardRef, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";

// Duplicate of CoverData shape used in page.tsx (kept local to avoid cross-file edit)
export interface CoverData {
  title: string;
  courseTitle: string;
  section: string;
  courseCode: string;
  studentName: string;
  studentId: string;
  year: string; // e.g. "1st Year" or "2nd Year" or numeric fallback
  term: string; // e.g. "1st Term" or "2nd Term" or numeric fallback
  teacherName: string;
  studentDiscipline: string;
  teacherDiscipline: string;
  degree: string;
  date: string; // ISO date string
  studentInstitute: string;
  teacherInstitute: string;
  coverType: string; // assignment | lab test etc
  Category: string; // mapped to theme elsewhere
}

// Utility helpers
function extractOrdinalBase(raw: string): string {
  const digits = raw.match(/\d+/);
  return digits ? digits[0] : raw; // fallback to raw if no digits
}

function ordinalSuffix(nStr: string): string {
  const n = parseInt(nStr, 10);
  if (isNaN(n)) return "";
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "st";
  if (mod10 === 2 && mod100 !== 12) return "nd";
  if (mod10 === 3 && mod100 !== 13) return "rd";
  return "th";
}

interface DesignProps {
  formData: CoverData;
  className?: string;
}

/*
 * Base design (Design 1) adapted from user-provided markup.
 * Differences vs original snippet:
 *  - Handles year/term strings like "1st Year" gracefully.
 *  - Formats date from ISO string stored in formData.date.
 */
// Reusable responsive wrapper to preserve original 1240x1740 design while scaling down fluidly
export function ResponsiveWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const resize = () => {
      if (!el) return;
      const w = el.clientWidth;
      setScale(w / 1240);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      ro.disconnect();
    };
  }, []);
  return (
    <div
      data-theme="light"
      ref={wrapRef}
      className={`relative w-full max-w-[1240px] mx-auto ${className || ""}`}
    >
      {/* aspect ratio spacer */}
      <div style={{ paddingTop: `${(1740 / 1240) * 100}%` }} />
      <div
        className="responsive-inner absolute inset-0 origin-top-left"
        style={{ width: 1240, height: 1740, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

export const CoverDesign1 = forwardRef<HTMLDivElement, DesignProps>(
  ({ formData, className }, ref) => {
    const formattedDate = (() => {
      try {
        return format(new Date(formData.date), "MMM dd, yyyy");
      } catch {
        return formData.date;
      }
    })();

    const yearBase = extractOrdinalBase(formData.year);
    const termBase = extractOrdinalBase(formData.term);

    return (
      <ResponsiveWrapper className={className}>
        <div
          ref={ref}
          className="design-base bg-white relative overflow-hidden z-70 w-[1240px] h-[1740px] print:w-[1240px] print:h-[1740px]"
        >
          {/* Blue Circle (slightly reduced to avoid print overflow) */}
          <div className="absolute w-[860px] bg-white h-[860px] border-[140px] border-[#4472c4] rounded-full right-[-430px] top-[-340px] z-20" />

          {/* University Header */}
          <div className="absolute top-[95px] left-[70px] flex items-center gap-4 z-30 drop-shadow-sm">
            <Image
              src="https://i.ibb.co/tyzqDkn/VYA8kwz-BQ1-CV2ptz-Iu96xs-YFA3hxj-T7.png"
              alt="Logo"
              width={115}
              height={115}
              className="w-[115px] h-auto"
            />
            <h1 className="text-[56px] font-semibold uppercase leading-[1.05] tracking-tight">
              <span className="text-[#f5821f] block drop-shadow-sm">
                Khulna
              </span>
              <span className="text-[#6d8da1] -mt-3 block drop-shadow-sm">
                University
              </span>
            </h1>
          </div>

          {/* Main Content Box */}
          <div className="absolute top-[15%] left-[7.5%] w-[85%] h-[48%] border-[18px] border-black rounded-[80px] overflow-hidden z-10 bg-gradient-to-br from-white via-white to-[#eef5ff]">
            {/* White Overlay Circle */}
            <div className="absolute w-[700px] h-[700px] bg-white rounded-full right-[-190px] top-[-290px] opacity-90" />

            {/* Assignment / Lab Text */}
            <div className="absolute top-[10%] left-[8%] text-[38px] text-[#4472c4] font-bold uppercase border-2 border-black py-[18px] px-[44px] tracking-wide bg-white/80 backdrop-blur-sm">
              {formData.coverType}
            </div>

            {/* ON Text */}
            <div className="absolute top-[25%] left-[18%] text-[48px] text-[#588413] font-semibold">
              ON
            </div>

            {/* Title */}
            <div className="absolute top-[35%] left-[8%] w-[84%] text-[42px] text-[#4a6f16] font-bold leading-tight pr-4">
              {formData.title}
            </div>

            {/* Course Info (standardized larger headings) */}
            <div className="absolute text-start top-[69%] left-[8%] text-[19px] text-[#30548a] space-y-6">
              <h1 className="font-bold text-3xl">
                Course Title: {formData.courseTitle}
              </h1>
              {formData.section && formData.section !== "Both" && (
                <h1 className="font-bold text-3xl">
                  Section: {formData.section}
                </h1>
              )}
              <h1 className="font-bold text-3xl">
                Course Code: {formData.courseCode}
              </h1>
            </div>
          </div>

          {/* Submission Table */}
          <table className="absolute top-[68%] left-[10%] w-[80%] border-collapse shadow-md">
            <thead>
              <tr className="bg-[#4472c4]">
                <th className="p-[25px_10px] text-[35px] font-bold text-center border-2 border-[#4472c4]">
                  SUBMITTED BY
                </th>
                <th className="p-[25px_10px] text-[35px] font-bold text-center border-2 border-[#4472c4]">
                  SUBMITTED TO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-[20px] text-[29px] font-semibold border-2 border-[#4472c4] bg-[#d9e2f3] leading-[1.22]">
                  NAME: {formData.studentName}
                  <br />
                  ID: {formData.studentId}
                  <br />
                  YEAR: {yearBase}
                  <sup>{ordinalSuffix(yearBase)}</sup> TERM: {termBase}
                  <sup>{ordinalSuffix(termBase)}</sup>
                  <br />
                  {formData.studentDiscipline} Discipline <br />
                  {formData.studentInstitute}
                </td>
                <td className="p-[10px] text-[29px] font-semibold border-2 border-[#4472c4] bg-[#d9e2f3] leading-[1.22]">
                  {formData.teacherName},
                  <br />
                  {formData.degree}, <br />
                  {formData.teacherDiscipline} Discipline
                  <br />
                  {formData.teacherInstitute}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Date Footer */}
          <div className="absolute bottom-[1%] left-1/2 transform -translate-x-1/2 text-center">
            <Image
              src="https://i.ibb.co/d0JWqffG/dataBar.png"
              alt="Data Bar"
              width={1000}
              height={120}
              className="w-[1000px] h-auto mx-auto mb-8"
            />
            <p className="text-[23px] text-black tracking-wide">
              Date of submission:
            </p>
            <h2 className="text-[33px] text-black font-semibold tracking-tight">
              {formattedDate}
            </h2>
          </div>

          <div className="absolute -bottom-36 left-0 w-[400px] h-[400px]">
            <svg
              viewBox="0 0 500 250"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "400px", height: "400px" }}
              className=""
            >
              <path d="M0,0 Q40,150 250,200 L0,200 Z" fill="#4472c4" />
            </svg>
          </div>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign1.displayName = "CoverDesign1";

/*
 * Design 2 - Variant palette (green accent) built from the same structural layout.
 * Only color values & a few accent positions changed to illustrate alternate design.
 */
export const CoverDesign2 = forwardRef<HTMLDivElement, DesignProps>(
  ({ formData, className }, ref) => {
    const formattedDate = (() => {
      try {
        return format(new Date(formData.date), "MMM dd, yyyy");
      } catch {
        return formData.date;
      }
    })();

    const yearBase = extractOrdinalBase(formData.year);
    const termBase = extractOrdinalBase(formData.term);

    return (
      <ResponsiveWrapper className={className}>
        <div
          ref={ref}
          className="design-base bg-white relative overflow-hidden z-70 w-[1240px] h-[1740px] print:w-[1240px] print:h-[1740px]"
        >
          {/* Outer Accent Ring (reduced) */}
          <div className="absolute w-[860px] bg-white h-[860px] border-[140px] border-[#16a34a] rounded-full right-[-430px] top-[-340px] z-20" />

          {/* University Header */}
          <div className="absolute top-[105px] left-[70px] flex items-center gap-4 z-30 drop-shadow-sm">
            <Image
              src="https://i.ibb.co/tyzqDkn/VYA8kwz-BQ1-CV2ptz-Iu96xs-YFA3hxj-T7.png"
              alt="Logo"
              width={115}
              height={115}
              className="w-[115px] h-auto"
            />
            <h1 className="text-[54px] font-bold uppercase tracking-tight leading-[1.05]">
              <span className="text-[#14532d]">Khulna</span>{" "}
              <span className="text-[#16a34a]">University</span>
            </h1>
          </div>

          {/* Main Content Box */}
          <div className="absolute top-[17%] left-[8%] w-[84%] h-[46%] border-[17px] border-[#14532d] rounded-[68px] overflow-hidden z-10 shadow-xl bg-gradient-to-br from-white via-white to-[#e9fdf1]">
            <div className="absolute w-[690px] h-[690px] bg-white rounded-full right-[-170px] top-[-290px] opacity-90" />

            {/* Cover Type */}
            <div className="absolute top-[9%] left-[8%] text-[36px] text-[#16a34a] font-bold uppercase border-2 border-[#14532d] py-[16px] px-[42px] tracking-wide bg-white/80 backdrop-blur-sm">
              {formData.coverType}
            </div>
            <div className="absolute top-[24%] left-[18%] text-[48px] text-[#15803d] font-semibold">
              ON
            </div>
            <div className="absolute top-[34%] left-[8%] w-[84%] text-[40px] text-[#166534] font-bold leading-tight pr-4">
              {formData.title}
            </div>
            <div className="absolute text-start top-[69%] left-[8%] text-[19px] text-[#14532d] space-y-6">
              <h1 className="font-bold text-3xl">
                Course Title: {formData.courseTitle}
              </h1>
              {formData.section && formData.section !== "Both" && (
                <h1 className="font-bold text-3xl">
                  Section: {formData.section}
                </h1>
              )}
              <h1 className="font-bold text-3xl">
                Course Code: {formData.courseCode}
              </h1>
            </div>
          </div>

          {/* Submission Table */}
          <table className="absolute top-[68%] left-[10%] w-[80%] border-collapse shadow-md">
            <thead>
              <tr className="bg-[#14532d]">
                <th className="p-[22px_10px] text-[34px] font-bold text-center border-2 border-[#14532d] text-white">
                  SUBMITTED BY
                </th>
                <th className="p-[22px_10px] text-[34px] font-bold text-center border-2 border-[#14532d] text-white">
                  SUBMITTED TO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-[18px] text-[27px] font-semibold border-2 border-[#14532d] bg-[#dcfce7] leading-[1.24] text-[#064e3b]">
                  NAME: {formData.studentName}
                  <br />
                  ID: {formData.studentId}
                  <br />
                  YEAR: {yearBase}
                  <sup>{ordinalSuffix(yearBase)}</sup> TERM: {termBase}
                  <sup>{ordinalSuffix(termBase)}</sup>
                  <br />
                  {formData.studentDiscipline} Discipline <br />
                  {formData.studentInstitute}
                </td>
                <td className="p-[10px] text-[27px] font-semibold border-2 border-[#14532d] bg-[#dcfce7] leading-[1.24] text-[#064e3b]">
                  {formData.teacherName},
                  <br />
                  {formData.degree}, <br />
                  {formData.teacherDiscipline} Discipline
                  <br />
                  {formData.teacherInstitute}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Date Footer */}
          <div className="absolute bottom-[1%] left-1/2 transform -translate-x-1/2 text-center">
            <Image
              src="https://i.ibb.co/d0JWqffG/dataBar.png"
              alt="Data Bar"
              width={1000}
              height={120}
              className="w-[1000px] h-auto mx-auto mb-8"
            />
            <p className="text-[23px] text-[#14532d] tracking-wide">
              Date of submission:
            </p>
            <h2 className="text-[32px] text-[#14532d] font-semibold tracking-tight">
              {formattedDate}
            </h2>
          </div>

          <div className="absolute -bottom-36 left-0 w-[400px] h-[400px]">
            <svg
              viewBox="0 0 500 250"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "400px", height: "400px" }}
              className=""
            >
              <path d="M0,0 Q40,150 250,200 L0,200 Z" fill="#16a34a" />
            </svg>
          </div>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign2.displayName = "CoverDesign2";

/* Additional Color Variants */
export const CoverDesign3 = forwardRef<HTMLDivElement, DesignProps>(
  ({ formData, className }, ref) => {
    const formattedDate = (() => {
      try {
        return format(new Date(formData.date), "MMM dd, yyyy");
      } catch {
        return formData.date;
      }
    })();
    const yearBase = extractOrdinalBase(formData.year);
    const termBase = extractOrdinalBase(formData.term);
    return (
      <ResponsiveWrapper className={className}>
        <div
          ref={ref}
          className="design-base bg-white relative overflow-hidden z-70 w-[1240px] h-[1740px] print:w-[1240px] print:h-[1740px]"
        >
          <div className="absolute w-[860px] bg-white h-[860px] border-[140px] border-[#6d28d9] rounded-full right-[-430px] top-[-340px] z-20" />
          <div className="absolute top-[105px] left-[70px] flex items-center gap-4 z-30 drop-shadow-sm">
            <Image
              src="https://i.ibb.co/tyzqDkn/VYA8kwz-BQ1-CV2ptz-Iu96xs-YFA3hxj-T7.png"
              alt="Logo"
              width={115}
              height={115}
              className="w-[115px] h-auto"
            />
            <h1 className="text-[54px] font-bold uppercase tracking-tight leading-[1.05]">
              <span className="text-[#4c1d95]">Khulna</span>{" "}
              <span className="text-[#7c3aed]">University</span>
            </h1>
          </div>
          <div className="absolute top-[17%] left-[8%] w-[84%] h-[46%] border-[17px] border-[#4c1d95] rounded-[68px] overflow-hidden z-10 shadow-xl bg-gradient-to-br from-white via-white to-[#f3e8ff]">
            <div className="absolute w-[690px] h-[690px] bg-white rounded-full right-[-170px] top-[-290px] opacity-90" />
            <div className="absolute top-[9%] left-[8%] text-[36px] text-[#7c3aed] font-bold uppercase border-2 border-[#4c1d95] py-[16px] px-[42px] tracking-wide bg-white/80 backdrop-blur-sm">
              {formData.coverType}
            </div>
            <div className="absolute top-[24%] left-[18%] text-[48px] text-[#5b21b6] font-semibold">
              ON
            </div>
            <div className="absolute top-[34%] left-[8%] w-[84%] text-[40px] text-[#4c1d95] font-bold leading-tight pr-4">
              {formData.title}
            </div>
            <div className="absolute text-start top-[69%] left-[8%] text-[19px] text-[#4c1d95] space-y-6">
              <h1 className="font-bold text-3xl">
                Course Title: {formData.courseTitle}
              </h1>
              {formData.section && formData.section !== "Both" && (
                <h1 className="font-bold text-3xl">
                  Section: {formData.section}
                </h1>
              )}
              <h1 className="font-bold text-3xl">
                Course Code: {formData.courseCode}
              </h1>
            </div>
          </div>
          <table className="absolute top-[68%] left-[10%] w-[80%] border-collapse shadow-md">
            <thead>
              <tr className="bg-[#4c1d95]">
                <th className="p-[22px_10px] text-[34px] font-bold text-center border-2 border-[#4c1d95] text-white">
                  SUBMITTED BY
                </th>
                <th className="p-[22px_10px] text-[34px] font-bold text-center border-2 border-[#4c1d95] text-white">
                  SUBMITTED TO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-[18px] text-[27px] font-semibold border-2 border-[#4c1d95] bg-[#ede9fe] leading-[1.24] text-[#4c1d95]">
                  NAME: {formData.studentName}
                  <br />
                  ID: {formData.studentId}
                  <br />
                  YEAR: {yearBase}
                  <sup>{ordinalSuffix(yearBase)}</sup> TERM: {termBase}
                  <sup>{ordinalSuffix(termBase)}</sup>
                  <br />
                  {formData.studentDiscipline} Discipline <br />
                  {formData.studentInstitute}
                </td>
                <td className="p-[10px] text-[27px] font-semibold border-2 border-[#4c1d95] bg-[#ede9fe] leading-[1.24] text-[#4c1d95]">
                  {formData.teacherName},<br />
                  {formData.degree}, <br />
                  {formData.teacherDiscipline} Discipline
                  <br />
                  {formData.teacherInstitute}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="absolute bottom-[1%] left-1/2 transform -translate-x-1/2 text-center">
            <Image
              src="https://i.ibb.co/d0JWqffG/dataBar.png"
              alt="Data Bar"
              width={1000}
              height={120}
              className="w-[1000px] h-auto mx-auto mb-8"
            />
            <p className="text-[23px] text-[#4c1d95] tracking-wide">
              Date of submission:
            </p>
            <h2 className="text-[32px] text-[#4c1d95] font-semibold tracking-tight">
              {formattedDate}
            </h2>
          </div>
          <div className="absolute -bottom-36 left-0 w-[400px] h-[400px]">
            <svg
              viewBox="0 0 500 250"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "400px", height: "400px" }}
              className=""
            >
              <path d="M0,0 Q40,150 250,200 L0,200 Z" fill="#6d28d9" />
            </svg>
          </div>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign3.displayName = "CoverDesign3";

export const CoverDesign4 = forwardRef<HTMLDivElement, DesignProps>(
  ({ formData, className }, ref) => {
    const formattedDate = (() => {
      try {
        return format(new Date(formData.date), "MMM dd, yyyy");
      } catch {
        return formData.date;
      }
    })();
    const yearBase = extractOrdinalBase(formData.year);
    const termBase = extractOrdinalBase(formData.term);
    return (
      <ResponsiveWrapper className={className}>
        <div
          ref={ref}
          className="design-base bg-white relative overflow-hidden z-70 w-[1240px] h-[1740px] print:w-[1240px] print:h-[1740px]"
        >
          <div className="absolute w-[860px] bg-white h-[860px] border-[140px] border-[#b91c1c] rounded-full right-[-430px] top-[-340px] z-20" />
          <div className="absolute top-[105px] left-[70px] flex items-center gap-4 z-30 drop-shadow-sm">
            <Image
              src="https://i.ibb.co/tyzqDkn/VYA8kwz-BQ1-CV2ptz-Iu96xs-YFA3hxj-T7.png"
              alt="Logo"
              width={115}
              height={115}
              className="w-[115px] h-auto"
            />
            <h1 className="text-[54px] font-bold uppercase tracking-tight leading-[1.05]">
              <span className="text-[#7f1d1d]">Khulna</span>{" "}
              <span className="text-[#dc2626]">University</span>
            </h1>
          </div>
          <div className="absolute top-[17%] left-[8%] w-[84%] h-[46%] border-[17px] border-[#7f1d1d] rounded-[68px] overflow-hidden z-10 shadow-xl bg-gradient-to-br from-white via-white to-[#fee2e2]">
            <div className="absolute w-[690px] h-[690px] bg-white rounded-full right-[-170px] top-[-290px] opacity-90" />
            <div className="absolute top-[9%] left-[8%] text-[36px] text-[#dc2626] font-bold uppercase border-2 border-[#7f1d1d] py-[16px] px-[42px] tracking-wide bg-white/80 backdrop-blur-sm">
              {formData.coverType}
            </div>
            <div className="absolute top-[24%] left-[18%] text-[48px] text-[#991b1b] font-semibold">
              ON
            </div>
            <div className="absolute top-[34%] left-[8%] w-[84%] text-[40px] text-[#7f1d1d] font-bold leading-tight pr-4">
              {formData.title}
            </div>
            <div className="absolute text-start top-[69%] left-[8%] text-[19px] text-[#7f1d1d] space-y-6">
              <h1 className=" font-bold text-3xl">
                Course Title: {formData.courseTitle}
              </h1>
              {formData.section && formData.section !== "Both" && (
                <h1 className="font-bold text-3xl">
                  Section: {formData.section}
                </h1>
              )}
              <h1 className="font-bold text-3xl">
                Course Code: {formData.courseCode}
              </h1>
            </div>
          </div>
          <table className="absolute top-[68%] left-[10%] w-[80%] border-collapse shadow-md">
            <thead>
              <tr className="bg-[#7f1d1d]">
                <th className="p-[22px_10px] text-[34px] font-bold text-center border-2 border-[#7f1d1d] text-white">
                  SUBMITTED BY
                </th>
                <th className="p-[22px_10px] text-[34px] font-bold text-center border-2 border-[#7f1d1d] text-white">
                  SUBMITTED TO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-[18px] text-[27px] font-semibold border-2 border-[#7f1d1d] bg-[#fee2e2] leading-[1.24] text-[#7f1d1d]">
                  NAME: {formData.studentName}
                  <br />
                  ID: {formData.studentId}
                  <br />
                  YEAR: {yearBase}
                  <sup>{ordinalSuffix(yearBase)}</sup> TERM: {termBase}
                  <sup>{ordinalSuffix(termBase)}</sup>
                  <br />
                  {formData.studentDiscipline} Discipline <br />
                  {formData.studentInstitute}
                </td>
                <td className="p-[10px] text-[27px] font-semibold border-2 border-[#7f1d1d] bg-[#fee2e2] leading-[1.24] text-[#7f1d1d]">
                  {formData.teacherName},<br />
                  {formData.degree}, <br />
                  {formData.teacherDiscipline} Discipline
                  <br />
                  {formData.teacherInstitute}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="absolute bottom-[1%] left-1/2 transform -translate-x-1/2 text-center">
            <Image
              src="https://i.ibb.co/d0JWqffG/dataBar.png"
              alt="Data Bar"
              width={1000}
              height={120}
              className="w-[1000px] h-auto mx-auto mb-8"
            />
            <p className="text-[23px] text-[#7f1d1d] tracking-wide">
              Date of submission:
            </p>
            <h2 className="text-[32px] text-[#7f1d1d] font-semibold tracking-tight">
              {formattedDate}
            </h2>
          </div>
          <div className="absolute -bottom-36 left-0 w-[400px] h-[400px]">
            <svg
              viewBox="0 0 500 250"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "400px", height: "400px" }}
              className=""
            >
              <path d="M0,0 Q40,150 250,200 L0,200 Z" fill="#b91c1c" />
            </svg>
          </div>
        </div>
      </ResponsiveWrapper>
    );
  }
);
CoverDesign4.displayName = "CoverDesign4";

const CoverDesigns = { CoverDesign1, CoverDesign2, CoverDesign3, CoverDesign4 };
export default CoverDesigns;
