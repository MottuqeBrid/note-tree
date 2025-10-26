"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUniversity,
  FaFileAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaIdCard,
  FaCalendarAlt,
  FaPrint,
  FaCopy,
  FaLayerGroup,
  FaGraduationCap,
} from "react-icons/fa";
import {
  CoverDesign1,
  CoverDesign2,
  CoverDesign3,
  CoverDesign4,
} from "./CoverDesigns";
import { Cover2Blue, Cover2Green, Cover2Purple, Cover2Red } from "./Cover2";
import { CoverDesign5 } from "./Cover5";
import { CoverDesign6 } from "./Cover6";
import { CoverDesign7 } from "./Cover7";
import { CoverDesign8 } from "./Cover8";
import { CoverDesign9 } from "./Cover9";
import { CoverDesign10 } from "./Cover10";
import { CoverDesign11 } from "./Cover11";
import { CoverDesign12 } from "./Cover12";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { toast, ToastContainer } from "react-toastify";

interface CoverData {
  title: string;
  courseTitle: string;
  section: string;
  courseCode: string;
  studentName: string;
  studentId: string;
  year: string;
  term: string;
  teacherName: string;
  studentDiscipline: string;
  teacherDiscipline: string;
  degree: string;
  date: string;
  studentInstitute: string;
  teacherInstitute: string;
  coverType: string;
  Category: string;
}

const demoCover: CoverData = {
  title: "Assignment 02: Graph Traversal Analysis",
  courseTitle: "Data Structures & Algorithms",
  section: "B",
  courseCode: "0542 3101 CSE",
  studentName: "John Doe",
  studentId: "210324",
  year: "3rd Year",
  term: "1st Term",
  teacherName: "Dr. Amelia Howard",
  studentDiscipline: "Computer Science & Engineering",
  teacherDiscipline: "Algorithms & Complexity",
  degree: "B.Sc. Engineering",
  date: new Date().toISOString().slice(0, 10),
  studentInstitute: "Global Tech University",
  teacherInstitute: "Global Tech University",
  coverType: "lab test",
  Category: "design4",
};

function formatDateForInput(d?: string) {
  if (!d) return new Date().toISOString().slice(0, 10);
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return "";
  }
}

export default function CoverPage() {
  const [data, setData] = useState<CoverData>(demoCover);
  const [copied, setCopied] = useState(false);
  const [asOrLabs, setAsOrLabs] = useState<"assignment" | "lab test">(
    demoCover.coverType === "lab test" ? "lab test" : "assignment"
  );
  const [design, setDesign] = useState<
    | "design1"
    | "design2"
    | "design3"
    | "design4"
    | "cover2-blue"
    | "cover2-green"
    | "cover2-purple"
    | "cover2-red"
    | "design5"
    | "design6"
    | "design7"
    | "design8"
    | "design9"
    | "design10"
    | "design11"
    | "design12"
  >("design1");
  const designRef = useRef<HTMLDivElement | null>(null);

  // Sync Category with chosen design
  useEffect(() => {
    setData((d) => ({ ...d, Category: design }));
  }, [design]);

  const updateField = (key: keyof CoverData, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const resetDemo = async () => {
    await loadDemoData();
  };
  const loadDemoData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/covers/demo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      // ensure date is normalized for input[type=date]
      const remote = data?.cover || {};
      remote.date = formatDateForInput(remote?.date);
      setData(remote);
      setDesign(remote?.Category || remote?.category);
      setAsOrLabs(remote?.coverType === "lab test" ? "lab test" : "assignment");
    } else {
      setData(demoCover);
    }
  };
  useEffect(() => {
    loadDemoData();
  }, []);
  // Removed theme variations with standard design; only alternate fixed designs remain.

  const copyPlainText = () => {
    const plain = `COVER PAGE (${data.coverType.toUpperCase()})\nCategory: ${
      data.Category
    }\nTitle: ${data.title}\nCourse: ${data.courseCode} - ${
      data.courseTitle
    }\nSection: ${data.section}\nStudent: ${data.studentName} (${
      data.studentId
    })\nStudent Discipline: ${data.studentDiscipline}\nDegree: ${
      data.degree
    }\nTeacher: ${data.teacherName}\nTeacher Discipline: ${
      data.teacherDiscipline
    }\nInstitutes: Student @ ${data.studentInstitute}; Teacher @ ${
      data.teacherInstitute
    }\nYear: ${data.year}\nTerm: ${data.term}\nDate: ${data.date}`;
    navigator.clipboard.writeText(plain).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const printable = useMemo(() => ({ ...data }), [data]);

  const handleDownloadPDF = async () => {
    // Capture only the active preview (designRef points to inner design base of selected design)
    const base = designRef.current;
    if (!base) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/covers/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      const resData = await res.json();
      if (resData.success) {
        toast.success("Cover page created.");
      } else {
        toast.error("Failed to create cover page.");
      }
    } catch (error) {
      toast.error("Failed to create cover page.");
    } finally {
      const wrapper = base
        .closest(".print-area")
        ?.querySelector(".responsive-inner") as HTMLElement | null;
      const target = wrapper || base;

      const prevTransform = target.style.transform;
      target.style.transform = "scale(1)";

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      target.style.transform = prevTransform;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const imgAspect = canvas.width / canvas.height;
      let renderWidth = pageWidth;
      let renderHeight = renderWidth / imgAspect;
      if (renderHeight > pageHeight) {
        renderHeight = pageHeight;
        renderWidth = renderHeight * imgAspect;
      }
      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;
      pdf.addImage(
        imgData,
        "PNG",
        x,
        y,
        renderWidth,
        renderHeight,
        undefined,
        "FAST"
      );
      pdf.save(`${data.studentId}-${data.title || "cover-page"}.pdf`);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <style>{`/* Standard themed design print visibility */
@media print { body * { visibility:hidden !important; } .print-area, .print-area * { visibility:visible !important; } .no-print { display:none !important; } .print-area { position:absolute; inset:0; margin:0; width:100%; height:auto; box-shadow:none !important; } }
/* Full-bleed page for alternate fixed designs */
@page { size:A4 portrait; margin:0; }
@media print {
  html,body{margin:0;padding:0;background:#fff;}
  .print-design, .print-design *{visibility:visible !important;}
  .print-design{width:210mm !important;height:297mm !important;margin:0 auto !important;padding:9mm 14mm 14mm 14mm !important;box-sizing:border-box;display:flex;align-items:flex-start;justify-content:flex-start;background:#fff;overflow:hidden;position:relative;}
  /* Use physical units instead of transform scaling for cross-device consistency */
  .print-design .design-scale{width:calc(210mm - 28mm); /* page width - horizontal padding */ aspect-ratio:1240/1685; height:auto; position:relative;}
  .print-design .design-scale{transform:none !important;}
  /* Minor font smoothing for print */
  .print-design .design-scale *{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .print-design ~ * { display:none !important; }
  .print-design, .print-design * { page-break-before:avoid; page-break-after:avoid; page-break-inside:avoid; }
}
/* Lock cover preview area to light palette so global theme doesn't alter fixed design colors */
.cover-theme-lock,[data-theme="light"].cover-theme-lock{color-scheme:light;}
.cover-theme-lock *{--tw-prose-invert:initial;}
`}</style>
      <ToastContainer />
      <div className="flex flex-col  gap-6">
        <div className="w-full space-y-4">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FaUniversity className="text-primary" /> Cover Page Builder
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl">
            Schema-aligned academic cover generator (demo data). Modify fields,
            select a theme, then print or copy.
          </p>
          <div className="flex flex-wrap gap-5 items-center">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="text-gray-600 font-medium">Design:</span>
              {(
                [
                  "design1",
                  "design2",
                  "design3",
                  "design4",
                  "cover2-blue",
                  "cover2-green",
                  "cover2-purple",
                  "cover2-red",
                  "design5",
                  "design6",
                  "design7",
                  "design8",
                  "design9",
                  "design10",
                  "design11",
                  "design12",
                ] as const
              ).map((d) => (
                <button
                  key={d}
                  onClick={() => setDesign(d)}
                  className={`px-4 py-1.5 rounded-full text-xs capitalize border transition ${
                    design === d
                      ? "bg-primary text-white border-primary"
                      : "bg-base-100 border-base-300 hover:border-primary/40"
                  }`}
                >
                  {d.startsWith("cover2")
                    ? d.replace("cover2-", "Cover2 ")
                    : d.replace("design", "Design ")}
                </button>
              ))}
            </div>
            {/* Visual Thumbnails for Designs */}
            <div className="flex items-start gap-1 flex-wrap no-print overflow-x-auto pb-2">
              {[
                {
                  key: "design1" as const,
                  label: "Design 1",
                  Comp: CoverDesign1,
                },
                {
                  key: "design2" as const,
                  label: "Design 2",
                  Comp: CoverDesign2,
                },
                {
                  key: "design3" as const,
                  label: "Design 3",
                  Comp: CoverDesign3,
                },
                {
                  key: "design4" as const,
                  label: "Design 4",
                  Comp: CoverDesign4,
                },
                {
                  key: "cover2-blue" as const,
                  label: "Cover2 Blue",
                  Comp: Cover2Blue,
                },
                {
                  key: "cover2-green" as const,
                  label: "Cover2 Green",
                  Comp: Cover2Green,
                },
                {
                  key: "cover2-purple" as const,
                  label: "Cover2 Purple",
                  Comp: Cover2Purple,
                },
                {
                  key: "cover2-red" as const,
                  label: "Cover2 Red",
                  Comp: Cover2Red,
                },
                {
                  key: "design5" as const,
                  label: "Design 5",
                  Comp: CoverDesign5,
                },
                {
                  key: "design6" as const,
                  label: "Design 6",
                  Comp: CoverDesign6,
                },
                {
                  key: "design7" as const,
                  label: "Design 7",
                  Comp: CoverDesign7,
                },
                {
                  key: "design8" as const,
                  label: "Design 8",
                  Comp: CoverDesign8,
                },
                {
                  key: "design9" as const,
                  label: "Design 9",
                  Comp: CoverDesign9,
                },
                {
                  key: "design10" as const,
                  label: "Design 10",
                  Comp: CoverDesign10,
                },
                {
                  key: "design11" as const,
                  label: "Design 11",
                  Comp: CoverDesign11,
                },
                {
                  key: "design12" as const,
                  label: "Design 12",
                  Comp: CoverDesign12,
                },
              ].map(({ key, label, Comp }) => (
                <button
                  key={key}
                  onClick={() => setDesign(key)}
                  className={`relative group shrink-0 border rounded-md p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 ${
                    design === key
                      ? "ring-2 ring-primary border-primary"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                >
                  <div className="w-24 overflow-hidden rounded-sm">
                    <Comp formData={printable} />
                  </div>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[9px] px-1 py-[1px] rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                    {label}
                  </span>
                </button>
              ))}
            </div>
            {/* Cover Type Toggle */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 font-medium">Cover Type:</span>
              {(["assignment", "lab test"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setAsOrLabs(t);
                    updateField("coverType", t);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs capitalize border transition ${
                    asOrLabs === t
                      ? "bg-primary text-white border-primary"
                      : "bg-base-100 border-base-300 hover:border-primary/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {/* Theme selector removed */}
          </div>
        </div>
        <div className="flex gap-3 no-print">
          <button
            onClick={copyPlainText}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-base-200 hover:bg-base-300 text-sm font-medium cursor-copy"
          >
            <FaCopy /> {copied ? "Copied" : "Copy Text"}
          </button>
          <button
            // window.print()
            onClick={() => handleDownloadPDF()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium shadow hover:shadow-md cursor-pointer"
          >
            <FaPrint /> Print
          </button>
          <button
            onClick={resetDemo}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-base-300 text-sm font-medium hover:bg-base-200 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 items-start">
        {/* Form */}
        <motion.form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6 no-print"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Title" icon={<FaFileAlt />}>
              <input
                className="input input-bordered w-full"
                value={data.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Assignment / Lab Title"
              />
            </Field>
            <Field label="Course Title" icon={<FaFileAlt />}>
              <input
                className="input input-bordered w-full"
                value={data.courseTitle}
                onChange={(e) => updateField("courseTitle", e.target.value)}
                placeholder="Course Title"
              />
            </Field>
            <Field label="Course Code" icon={<FaFileAlt />}>
              <input
                className="input input-bordered w-full"
                value={data.courseCode}
                onChange={(e) => updateField("courseCode", e.target.value)}
                placeholder="CSE 3101"
              />
            </Field>
            <Field label="Section" icon={<FaLayerGroup />}>
              <select
                className="select select-bordered w-full"
                value={data.section}
                onChange={(e) => updateField("section", e.target.value)}
              >
                {["A", "B", "Both"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Student Name" icon={<FaUserGraduate />}>
              <input
                className="input input-bordered w-full"
                value={data.studentName}
                onChange={(e) => updateField("studentName", e.target.value)}
                placeholder="Student Name"
              />
            </Field>
            <Field label="Student ID" icon={<FaIdCard />}>
              <input
                className="input input-bordered w-full"
                value={data.studentId}
                onChange={(e) => updateField("studentId", e.target.value)}
                placeholder="ID"
              />
            </Field>
            <Field label="Student Discipline" icon={<FaGraduationCap />}>
              <input
                className="input input-bordered w-full"
                value={data.studentDiscipline}
                onChange={(e) =>
                  updateField("studentDiscipline", e.target.value)
                }
                placeholder="Discipline"
              />
            </Field>
            <Field label="Student Institute" icon={<FaUniversity />}>
              <input
                className="input input-bordered w-full"
                value={data.studentInstitute}
                onChange={(e) =>
                  updateField("studentInstitute", e.target.value)
                }
                placeholder="Institute"
              />
            </Field>
            <Field label="Teacher Name" icon={<FaChalkboardTeacher />}>
              <input
                className="input input-bordered w-full"
                value={data.teacherName}
                onChange={(e) => updateField("teacherName", e.target.value)}
                placeholder="Teacher Name"
              />
            </Field>
            <Field label="Teacher Discipline" icon={<FaChalkboardTeacher />}>
              <input
                className="input input-bordered w-full"
                value={data.teacherDiscipline}
                onChange={(e) =>
                  updateField("teacherDiscipline", e.target.value)
                }
                placeholder="Teacher's Discipline"
              />
            </Field>
            <Field label="Teacher Institute" icon={<FaUniversity />}>
              <input
                className="input input-bordered w-full"
                value={data.teacherInstitute}
                onChange={(e) =>
                  updateField("teacherInstitute", e.target.value)
                }
                placeholder="Institute"
              />
            </Field>
            <Field label="Degree" icon={<FaGraduationCap />}>
              <input
                className="input input-bordered w-full"
                value={data.degree}
                onChange={(e) => updateField("degree", e.target.value)}
                placeholder="B.Sc. Engineering"
              />
            </Field>
            <Field label="Year" icon={<FaCalendarAlt />}>
              <select
                className="select select-bordered w-full"
                value={data.year}
                onChange={(e) => updateField("year", e.target.value)}
              >
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Term" icon={<FaCalendarAlt />}>
              <select
                className="select select-bordered w-full"
                value={data.term}
                onChange={(e) => updateField("term", e.target.value)}
              >
                {["1st Term", "2nd Term"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date" icon={<FaCalendarAlt />}>
              <input
                type="date"
                className="input input-bordered w-full"
                value={data.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </Field>
            {/* Category & Cover Type now handled at top; hidden fields retained for data completeness */}
          </div>
        </motion.form>

        {/* Preview */}
        <AnimatePresence mode="wait">
          {design === "design1" && (
            <motion.div
              key="design1"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
            >
              <CoverDesign1 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design2" && (
            <motion.div
              key="design2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign2 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design3" && (
            <motion.div
              key="design3"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign3 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design4" && (
            <motion.div
              key="design4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign4 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "cover2-blue" && (
            <motion.div
              key="cover2-blue"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <Cover2Blue ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "cover2-green" && (
            <motion.div
              key="cover2-green"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <Cover2Green ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "cover2-purple" && (
            <motion.div
              key="cover2-purple"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <Cover2Purple ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "cover2-red" && (
            <motion.div
              key="cover2-red"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <Cover2Red ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design5" && (
            <motion.div
              key="design5"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign5 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design6" && (
            <motion.div
              key="design6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign6 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design7" && (
            <motion.div
              key="design7"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign7 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design8" && (
            <motion.div
              key="design8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign8 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design9" && (
            <motion.div
              key="design9"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign9 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design10" && (
            <motion.div
              key="design10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign10 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design11" && (
            <motion.div
              key="design11"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign11 ref={designRef} formData={printable} />
            </motion.div>
          )}
          {design === "design12" && (
            <motion.div
              key="design12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto cover-theme-lock"
              data-theme="light"
            >
              <CoverDesign12 ref={designRef} formData={printable} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium tracking-wide">
      <span className="flex items-center gap-1 text-gray-600">
        {icon && <span className="text-gray-400 text-sm">{icon}</span>}
        {label}
      </span>
      {children}
    </label>
  );
}

// Removed Info component (was used only in standard design)
