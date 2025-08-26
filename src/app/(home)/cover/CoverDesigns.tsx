"use client";
import React, { forwardRef } from "react";
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
      <div
        ref={ref}
        className={`design-base w-[1240px] h-[1740px] bg-white relative overflow-hidden z-70 print:w-[1240px] print:h-[1740px] ${
          className || ""
        }`}
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
            <span className="text-[#f5821f] block drop-shadow-sm">Khulna</span>
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

          {/* Course Info */}
          <div className="absolute top-[70%] left-[8%] text-[19px] text-[#30548a] space-y-6">
            <h1 className=" font-bold">Course Title: {formData.courseTitle}</h1>
            {formData.section && formData.section !== "Both" && (
              <h1 className="font-bold">Section: {formData.section}</h1>
            )}
            <h1 className="font-bold">Course Code: {formData.courseCode}</h1>
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

        <Image
          src="https://i.ibb.co/Hfrht4dX/bottom.png"
          alt="Decoration"
          width={300}
          height={300}
          className="absolute bottom-0 left-0 w-[300px] h-[300px]"
        />
      </div>
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
      <div
        ref={ref}
        className={`design-base w-[1240px] h-[1740px] bg-white relative overflow-hidden z-70 print:w-[1240px] print:h-[1740px] ${
          className || ""
        }`}
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
          <div className="absolute top-[69%] left-[8%] text-[19px] text-[#14532d] space-y-6">
            <h1 className=" font-bold">Course Title: {formData.courseTitle}</h1>
            {formData.section && formData.section !== "Both" && (
              <h1 className="font-bold">Section: {formData.section}</h1>
            )}
            <h1 className="font-bold">Course Code: {formData.courseCode}</h1>
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

        <Image
          src="https://i.ibb.co/Hfrht4dX/bottom.png"
          alt="Decoration"
          width={300}
          height={300}
          className="absolute bottom-0 left-0 w-[300px] h-[300px]"
        />
      </div>
    );
  }
);
CoverDesign2.displayName = "CoverDesign2";

const CoverDesigns = { CoverDesign1, CoverDesign2 };
export default CoverDesigns;
