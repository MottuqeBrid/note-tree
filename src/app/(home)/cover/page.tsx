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
  FaPalette,
  FaCopy,
  FaLayerGroup,
  FaGraduationCap,
} from "react-icons/fa";
import { CoverDesign1, CoverDesign2 } from "./CoverDesigns";

type Theme = "classic" | "modern" | "minimal" | "bordered";

// Matches provided schema
interface CoverData {
  title: string;
  courseTitle: string;
  section: string;
  courseCode: string;
  studentName: string;
  studentId: string;
  year: string;
  term: string; // term/semester
  teacherName: string;
  studentDiscipline: string;
  teacherDiscipline: string;
  degree: string;
  date: string; // ISO string for simplicity
  studentInstitute: string;
  teacherInstitute: string;
  coverType: string;
  Category: string;
}

const demoCover: CoverData = {
  title: "Assignment 02: Graph Traversal Analysis",
  courseTitle: "Data Structures & Algorithms",
  section: "Section A",
  courseCode: "CSE 3101",
  studentName: "John Doe",
  studentId: "CSE-210324",
  year: "2025",
  term: "Fall",
  teacherName: "Dr. Amelia Howard",
  studentDiscipline: "Computer Science & Engineering",
  teacherDiscipline: "Algorithms & Complexity",
  degree: "B.Sc. Engineering",
  date: new Date().toISOString().slice(0, 10),
  studentInstitute: "Global Tech University",
  teacherInstitute: "Global Tech University",
  coverType: "assignment",
  Category: "Academic",
};

export default function CoverPage() {
  const [theme, setTheme] = useState<Theme>("classic");
  const [data, setData] = useState<CoverData>(demoCover);
  const [copied, setCopied] = useState(false);
  const [design, setDesign] = useState<"standard" | "design1" | "design2">(
    "standard"
  );
  const designRef = useRef<HTMLDivElement | null>(null);

  // Sync Category with theme (Category means theme per user request)
  useEffect(() => {
    // If using standard theme-driven design, sync Category with theme; otherwise with design key
    if (design === "standard") {
      setData((d) => ({ ...d, Category: theme }));
    } else {
      setData((d) => ({ ...d, Category: design }));
    }
  }, [theme, design]);

  const updateField = (key: keyof CoverData, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const resetDemo = () => {
    setData(demoCover);
  };

  const themeClasses: Record<Theme, string> = {
    classic:
      "bg-white text-gray-700 [&_.heading]:font-serif [&_.uni]:tracking-wide",
    modern:
      "bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-slate-700 [&_.heading]:font-semibold",
    minimal: "bg-white text-gray-800 [&_.heading]:font-light",
    bordered:
      "bg-white text-gray-700 border-4 border-gray-800 [&_.heading]:font-serif",
  };

  const accentColors: Record<Theme, string> = {
    classic: "text-blue-700",
    modern: "text-indigo-600",
    minimal: "text-gray-900",
    bordered: "text-gray-900",
  };

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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
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
`}</style>
      <header className="flex flex-col lg:flex-row lg:items-end gap-6">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FaUniversity className="text-primary" /> Cover Page Builder
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl">
            Schema-aligned academic cover generator (demo data). Modify fields,
            select a theme, then print or copy.
          </p>
          <div className="flex flex-wrap gap-5 items-center">
            {/* Design Selector */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 font-medium">Design:</span>
              {(["standard", "design1", "design2"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDesign(d)}
                  className={`px-4 py-1.5 rounded-full text-xs capitalize border transition ${
                    design === d
                      ? "bg-primary text-white border-primary"
                      : "bg-base-100 border-base-300 hover:border-primary/40"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            {/* Cover Type Toggle */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 font-medium">Cover Type:</span>
              {(["assignment", "lab test"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => updateField("coverType", t)}
                  className={`px-4 py-1.5 rounded-full text-xs capitalize border transition ${
                    data.coverType === t
                      ? "bg-primary text-white border-primary"
                      : "bg-base-100 border-base-300 hover:border-primary/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {design === "standard" && (
              <div className="flex items-center gap-2 text-sm">
                <FaPalette className="text-primary" /> Theme:
                {(["classic", "modern", "minimal", "bordered"] as Theme[]).map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setTheme(c)}
                      className={`px-3 py-1 rounded-full text-xs capitalize border transition ${
                        theme === c
                          ? "bg-primary text-white border-primary"
                          : "bg-base-100 border-base-300 hover:border-primary/40"
                      }`}
                    >
                      {c}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 no-print">
          <button
            onClick={copyPlainText}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-base-200 hover:bg-base-300 text-sm font-medium"
          >
            <FaCopy /> {copied ? "Copied" : "Copy Text"}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium shadow hover:shadow-md"
          >
            <FaPrint /> Print
          </button>
          <button
            onClick={resetDemo}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-base-300 text-sm font-medium hover:bg-base-200"
          >
            Reset
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
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
              <input
                className="input input-bordered w-full"
                value={data.section}
                onChange={(e) => updateField("section", e.target.value)}
                placeholder="Section A"
              />
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
          {design === "standard" ? (
            <motion.div
              key={"standard-" + theme + data.coverType}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`print-area relative rounded-2xl p-10 shadow-xl ring-1 ring-black/5 min-h-[900px] flex flex-col justify-between ${themeClasses[theme]}`}
            >
              <div className="space-y-8">
                <div className="text-center space-y-3">
                  <h2
                    className={`uni text-xl md:text-2xl font-semibold ${accentColors[theme]}`}
                  >
                    {printable.studentInstitute}
                  </h2>
                  <p className="text-sm md:text-base font-medium tracking-wide">
                    {printable.studentDiscipline}
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent w-2/3 mx-auto" />
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    {printable.coverType} Cover Page • {theme} theme
                  </p>
                </div>
                <div className="mt-10 space-y-6">
                  <section className="space-y-2 text-center">
                    <h1
                      className={`heading text-2xl md:text-3xl font-bold leading-snug ${accentColors[theme]}`}
                    >
                      {printable.title}
                    </h1>
                  </section>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm leading-relaxed">
                    <div className="space-y-2">
                      <Info label="Course Code" value={printable.courseCode} />
                      <Info
                        label="Course Title"
                        value={printable.courseTitle}
                      />
                      <Info label="Section" value={printable.section} />
                    </div>
                    <div className="space-y-2">
                      <Info label="Student" value={printable.studentName} />
                      <Info label="Student ID" value={printable.studentId} />
                      <Info label="Degree" value={printable.degree} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm mt-4">
                    <Info label="Teacher" value={printable.teacherName} />
                    <Info
                      label="Teacher Discipline"
                      value={printable.teacherDiscipline}
                    />
                    <Info
                      label="Teacher Institute"
                      value={printable.teacherInstitute}
                    />
                    <Info label="Year" value={printable.year} />
                    <Info label="Term" value={printable.term} />
                    <Info label="Date" value={printable.date} />
                  </div>
                </div>
              </div>
              <footer className="pt-12 text-center text-[11px] text-gray-500">
                Generated with Cover Page Builder (Schema Demo)
              </footer>
            </motion.div>
          ) : design === "design1" ? (
            <motion.div
              key={"design1"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto"
            >
              <CoverDesign1 ref={designRef} formData={printable} />
            </motion.div>
          ) : (
            <motion.div
              key={"design2"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="print-area mx-auto"
            >
              <CoverDesign2 ref={designRef} formData={printable} />
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex gap-2">
      <span className="font-semibold text-gray-500 w-32 shrink-0">
        {label}:
      </span>
      <span className="font-medium text-gray-700 break-words">
        {value || "-"}
      </span>
    </p>
  );
}
