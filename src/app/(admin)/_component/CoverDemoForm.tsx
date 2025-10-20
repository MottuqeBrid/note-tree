"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

type CoverDemo = {
  title?: string;
  courseTitle?: string;
  section?: string;
  courseCode?: string;
  studentName?: string;
  studentId?: string;
  year?: string;
  term?: string;
  teacherName?: string;
  studentDiscipline?: string;
  teacherDiscipline?: string;
  degree?: string;
  date?: string; // YYYY-MM-DD
  studentInstitute?: string;
  teacherInstitute?: string;
  coverType?: "assignment" | "lab test";
  category?: string;
};

type Props = {
  initial?: CoverDemo;
  onSaved?: (data: unknown) => void;
};

export default function CoverDemoForm({ initial, onSaved }: Props) {
  const [form, setForm] = useState<CoverDemo>({
    title: initial?.title ?? "",
    courseTitle: initial?.courseTitle ?? "",
    section: initial?.section ?? "",
    courseCode: initial?.courseCode ?? "",
    studentName: initial?.studentName ?? "",
    studentId: initial?.studentId ?? "",
    year: initial?.year ?? "",
    term: initial?.term ?? "",
    teacherName: initial?.teacherName ?? "",
    studentDiscipline: initial?.studentDiscipline ?? "",
    teacherDiscipline: initial?.teacherDiscipline ?? "",
    degree: initial?.degree ?? "",
    date: initial?.date ? formatDateForInput(initial.date) : "",
    studentInstitute: initial?.studentInstitute ?? "",
    teacherInstitute: initial?.teacherInstitute ?? "",
    coverType: initial?.coverType ?? "assignment",
    category: initial?.category ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CoverDemo>(k: K, v: CoverDemo[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function formatDateForInput(d?: string) {
    if (!d) return "";
    // accept ISO or yyyy-mm-dd
    try {
      // if already in yyyy-mm-dd, return
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

  const fetchCoverData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/others/cover`);
    const data = await res.json();
    if (data?.success) {
      const remote = data?.cover?.coverDemo || {};
      setForm((s) => ({
        ...s,
        ...remote,
        date: formatDateForInput(remote?.date),
      }));
    }
  };
  useEffect(() => {
    fetchCoverData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validate() {
    // basic validation: require title and studentName
    if (!form.title?.trim()) return "Title is required";
    if (!form.studentName?.trim()) return "Student name is required";
    return null;
  }

  async function submit() {
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/others/cover`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coverDemo: form }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Cover demo saved successfully",
        });
        onSaved?.(data);
      } else {
        setError(data?.message || "Failed to save");
      }
    } catch (err) {
      setError("Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        <label className="input-group">
          <span>Title</span>
          <input
            className="input input-bordered w-full"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Course Title</span>
          <input
            className="input input-bordered w-full"
            value={form.courseTitle}
            onChange={(e) => update("courseTitle", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Section</span>
          <select
            className="select select-bordered w-full"
            value={form.section}
            onChange={(e) => update("section", e.target.value)}
          >
            <option value="">Select section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="Both">Both</option>
          </select>
        </label>
        <label className="input-group">
          <span>Course Code</span>
          <input
            className="input input-bordered w-full"
            value={form.courseCode}
            onChange={(e) => update("courseCode", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Student Name</span>
          <input
            className="input input-bordered w-full"
            value={form.studentName}
            onChange={(e) => update("studentName", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Student ID</span>
          <input
            className="input input-bordered w-full"
            value={form.studentId}
            onChange={(e) => update("studentId", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Year</span>
          <select
            className="select select-bordered w-full"
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
          >
            <option value="">Select year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </label>
        <label className="input-group">
          <span>Term</span>
          <select
            className="select select-bordered w-full"
            value={form.term}
            onChange={(e) => update("term", e.target.value)}
          >
            <option value="">Select term</option>
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
          </select>
        </label>
        <label className="input-group">
          <span>Teacher Name</span>
          <input
            className="input input-bordered w-full"
            value={form.teacherName}
            onChange={(e) => update("teacherName", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Student Discipline</span>
          <input
            className="input input-bordered w-full"
            value={form.studentDiscipline}
            onChange={(e) => update("studentDiscipline", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Teacher Discipline</span>
          <input
            className="input input-bordered w-full"
            value={form.teacherDiscipline}
            onChange={(e) => update("teacherDiscipline", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Degree</span>
          <input
            className="input input-bordered w-full"
            value={form.degree}
            onChange={(e) => update("degree", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Date</span>
          <input
            type="date"
            className="input input-bordered w-full"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Student Institute</span>
          <input
            className="input input-bordered w-full"
            value={form.studentInstitute}
            onChange={(e) => update("studentInstitute", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Teacher Institute</span>
          <input
            className="input input-bordered w-full"
            value={form.teacherInstitute}
            onChange={(e) => update("teacherInstitute", e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Cover Type</span>
          <select
            className="select select-bordered w-full"
            value={form.coverType}
            onChange={(e) =>
              update("coverType", e.target.value as CoverDemo["coverType"])
            }
          >
            <option value="assignment">Assignment</option>
            <option value="lab test">Lab test</option>
          </select>
        </label>
        <label className="input-group">
          <span>Category</span>
          <select
            className="select select-bordered w-full"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">Select design</option>
            <option value="design1">design1</option>
            <option value="design2">design2</option>
            <option value="design3">design3</option>
            <option value="design4">design4</option>
            <option value="cover2-blue">cover2-blue</option>
            <option value="cover2-green">cover2-green</option>
            <option value="cover2-purple">cover2-purple</option>
            <option value="cover2-red">cover2-red</option>
            <option value="design5">design5</option>
            <option value="design6">design6</option>
            <option value="design7">design7</option>
            <option value="design8">design8</option>
            <option value="design9">design9</option>
            <option value="design10">design10</option>
            <option value="design11">design11</option>
            <option value="design12">design12</option>
          </select>
        </label>
      </div>

      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}

      <div className="mt-4 flex items-center gap-3">
        <button
          className="btn btn-primary text-neutral"
          disabled={saving}
          onClick={submit}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
