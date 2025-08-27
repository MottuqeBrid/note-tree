"use client";
import React, { forwardRef } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { CoverData, ResponsiveWrapper } from "./CoverDesigns";

type Cover2Variant = "blue" | "green" | "purple" | "red";

interface Cover2BaseProps {
  formData: CoverData;
  className?: string;
  variant?: Cover2Variant; // default blue
}

function extractDigits(raw: string): string {
  const m = raw.match(/\d+/);
  return m ? m[0] : raw;
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

const palette: Record<
  Cover2Variant,
  {
    heading: string; // coverType color
    on: string; // ON / title color
    title: string; // title text color
    course: string; // course info color
    bannerGrad?: string;
    tableBg: string; // table cell background
    panelBg: string; // panel bg (if any)
  }
> = {
  blue: {
    heading: "#4472c4",
    on: "#588413",
    title: "#588413",
    course: "#4472c4",
    tableBg: "#d9e2f3",
    panelBg: "#d9e2f3",
  },
  green: {
    heading: "#16a34a",
    on: "#15803d",
    title: "#166534",
    course: "#14532d",
    tableBg: "#dcfce7",
    panelBg: "#dcfce7",
  },
  purple: {
    heading: "#7c3aed",
    on: "#5b21b6",
    title: "#5b21b6",
    course: "#4c1d95",
    tableBg: "#ede9fe",
    panelBg: "#ede9fe",
  },
  red: {
    heading: "#dc2626",
    on: "#991b1b",
    title: "#991b1b",
    course: "#7f1d1d",
    tableBg: "#fee2e2",
    panelBg: "#fee2e2",
  },
};

const BaseCover2 = forwardRef<HTMLDivElement, Cover2BaseProps>(
  ({ formData, className, variant = "blue" }, ref) => {
    const colors = palette[variant];
    const formattedDate = (() => {
      try {
        return format(new Date(formData.date), "MMM dd, yyyy");
      } catch {
        return formData.date;
      }
    })();
    const yearBase = extractDigits(formData.year || "");
    const termBase = extractDigits(formData.term || "");
    return (
      <ResponsiveWrapper className={className}>
        <div
          data-theme="light"
          ref={ref}
          className="design-base bg-white relative overflow-hidden z-70 w-[1240px] h-[1740px] flex flex-col px-[96px] pt-16 pb-[72px]"
        >
          <h1 className="text-5xl font-bold text-center my-20 uppercase">
            <span className="text-[#f5821f]">Khulna</span>{" "}
            <span className="text-[#6d8da1]">University</span>
          </h1>
          <div className="flex justify-center my-20">
            <Image
              src="https://i.ibb.co/tyzqDkn/VYA8kwz-BQ1-CV2ptz-Iu96xs-YFA3hxj-T7.png"
              alt="Logo"
              width={160}
              height={160}
              className="w-[160px] h-auto"
            />
          </div>
          <h1
            className="text-5xl font-semibold text-center uppercase my-20"
            style={{ color: colors.heading }}
          >
            {formData.coverType}
          </h1>
          <h2
            className="text-3xl text-center uppercase mb-10"
            style={{ color: colors.on }}
          >
            ON
          </h2>
          <p
            className="text-2xl text-center font-semibold mb-20"
            style={{ color: colors.title }}
          >
            {formData.title}
          </p>
          <div
            className="text-lg mb-10 space-y-1"
            style={{ color: colors.course }}
          >
            <p>Course Title: {formData.courseTitle}</p>
            {formData.section && formData.section !== "Both" ? (
              <p>Section: {formData.section}</p>
            ) : null}
            <p>Course Code: {formData.courseCode}</p>
          </div>
          <div
            className="flex justify-between text-lg p-4 px-10 rounded"
            style={{ backgroundColor: colors.panelBg }}
          >
            <div>
              <h3 className="font-bold text-xl mb-2">Submitted By</h3>
              <p>Name: {formData.studentName}</p>
              <p>ID: {formData.studentId}</p>
              <p>
                Year: {yearBase}
                <sup>{ordinalSuffix(yearBase)}</sup> Term: {termBase}
                <sup>{ordinalSuffix(termBase)}</sup>
              </p>
              <p>{formData.studentDiscipline} Discipline,</p>
              <p>{formData.studentInstitute}</p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Submitted To</h3>
              <p>{formData.teacherName},</p>
              <p>{formData.degree},</p>
              <p>{formData.teacherDiscipline} Discipline,</p>
              <p>{formData.teacherInstitute}</p>
            </div>
          </div>
          <div className="text-center mt-auto pt-10">
            <p className="text-lg">Date of submission:</p>
            <h2 className="text-2xl font-semibold">{formattedDate}</h2>
          </div>
        </div>
      </ResponsiveWrapper>
    );
  }
);
BaseCover2.displayName = "BaseCover2";

// Variant wrappers (so page can treat them as individual design components)
export const Cover2Blue = forwardRef<
  HTMLDivElement,
  Omit<Cover2BaseProps, "variant">
>((props, ref) => <BaseCover2 ref={ref} variant="blue" {...props} />);
Cover2Blue.displayName = "Cover2Blue";
export const Cover2Green = forwardRef<
  HTMLDivElement,
  Omit<Cover2BaseProps, "variant">
>((props, ref) => <BaseCover2 ref={ref} variant="green" {...props} />);
Cover2Green.displayName = "Cover2Green";
export const Cover2Purple = forwardRef<
  HTMLDivElement,
  Omit<Cover2BaseProps, "variant">
>((props, ref) => <BaseCover2 ref={ref} variant="purple" {...props} />);
Cover2Purple.displayName = "Cover2Purple";
export const Cover2Red = forwardRef<
  HTMLDivElement,
  Omit<Cover2BaseProps, "variant">
>((props, ref) => <BaseCover2 ref={ref} variant="red" {...props} />);
Cover2Red.displayName = "Cover2Red";

// Default export keeps backward compatibility (blue variant)
export default Cover2Blue;
