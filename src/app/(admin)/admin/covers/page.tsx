"use client";

import React, { useEffect, useMemo, useState } from "react";
// ...existing code...
import { FaSearch, FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

type Cover = {
  _id: string;
  title?: string;
  courseTitle?: string;
  courseCode?: string;
  section?: string;
  teacherName?: string;
  studentName?: string;
  studentId?: string;
  createdAt?: string;
  Category?: string;
  year?: string;
  term?: string;
  teacherDiscipline?: string;
  teacherInstitute?: string;
  studentDiscipline?: string;
  studentInstitute?: string;
  coverType?: string;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    createdAt?: string;
    cover?: unknown[];
    note?: unknown[];
    role?: string;
    isVerified?: boolean;
    photo?: { profile?: string } | null;
  } | null;
};

export default function Page() {
  const [covers, setCovers] = useState<Cover[]>([]);
  const [selected, setSelected] = useState<Cover | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchCovers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/covers/all`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      const arr = data?.covers || [];
      setCovers(Array.isArray(arr) ? arr : []);
    } catch (e) {
      console.error("fetchCovers error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCovers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return covers;
    return covers.filter((c: Cover) => {
      return (
        (c.title || "").toLowerCase().includes(q) ||
        (c.courseTitle || "").toLowerCase().includes(q) ||
        (c.teacherName || "").toLowerCase().includes(q) ||
        (c.studentName || "").toLowerCase().includes(q)
      );
    });
  }, [covers, search]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cover Pages</h1>
          <p className="text-sm text-gray-500">All generated covers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              aria-label="Search covers"
              className="input input-sm input-bordered pl-10 w-64"
              placeholder="Search title, course, teacher, student"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-10 text-center text-sm text-gray-500">
          Loading covers...
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-10 text-center text-sm text-gray-500">
          No covers found.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c: Cover) => (
          <article
            key={c._id}
            className="border border-base-300 rounded-xl overflow-hidden bg-base-100"
          >
            {/* <div className="relative h-40 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
              Cover preview removed
            </div> */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800">{c.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {c.courseTitle} • {c.courseCode}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-base-300 bg-base-200 flex items-center justify-center text-xs">
                    {c.user?.name ? c.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-xs">
                    <div className="font-medium">{c.user?.name || "—"}</div>
                    <div className="text-[11px] text-gray-500">
                      {c.teacherName || c.studentName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelected(c)}
                    className="btn btn-xs btn-ghost flex items-center gap-2"
                  >
                    <FaEye /> View
                  </button>
                  <button
                    onClick={async () => {
                      if (!c._id) return;
                      Swal.fire({
                        title: "Are you sure?",
                        text: "Delete this cover? This cannot be undone.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Delete",
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          setDeletingId(c._id);
                          const resp = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/covers/delete/${c._id}`,
                            {
                              method: "DELETE",
                              credentials: "include",
                            }
                          );
                          if (!resp.ok) {
                            const txt = await resp.text().catch(() => "");
                            throw new Error(
                              `Delete failed: ${resp.status} ${resp.statusText} ${txt}`
                            );
                          }
                          setCovers((prev) =>
                            prev.filter((x) => x._id !== c._id)
                          );
                          if (selected?._id === c._id) setSelected(null);
                        }
                      });
                    }}
                    className="btn btn-xs btn-ghost text-error flex items-center gap-2"
                    aria-disabled={deletingId === c._id}
                  >
                    <FaTrash /> {deletingId === c._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <div>Section: {c.section || "—"}</div>
                  <div>
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
                {/* <div className="flex items-center gap-4 mt-2">
                  <div className="badge badge-ghost badge-sm">
                    Covers: {Array.isArray(c.cover) ? c.cover.length : 0}
                  </div>
                  <div className="badge badge-ghost badge-sm">
                    Notes: {Array.isArray(c.note) ? c.note.length : 0}
                  </div>
                </div> */}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal: show cover details */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-scroll">
          <div className="bg-base-100 rounded-lg shadow-xl max-w-3xl w-full mx-4 overflow-hidden">
            <div className="p-4 border-b border-base-200 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{selected.title}</h2>
                <p className="text-sm text-gray-500">
                  {selected.courseTitle} • {selected.courseCode}
                </p>
                <p className="text-xs text-gray-400">
                  Section: {selected.section || "—"}
                </p>
              </div>
              <div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <div className="mt-3 text-sm text-gray-600">
                  <div>
                    Date:{" "}
                    {selected.createdAt
                      ? new Date(selected.createdAt).toLocaleDateString()
                      : "—"}
                  </div>
                  <div className="mt-2">
                    Covers:{" "}
                    {Array.isArray(selected.user?.cover)
                      ? selected.user?.cover.length
                      : 0}
                  </div>
                  <div>
                    Notes:{" "}
                    {Array.isArray(selected?.user?.note)
                      ? selected.user?.note.length
                      : 0}
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="text-sm text-gray-800 whitespace-pre-line">
                  {`COVER PAGE (ASSIGNMENT)
Category: ${selected.Category || "design4"}
Title: ${selected.title || "—"}
Course: ${selected.courseCode || "—"} ${
                    selected.courseCode ? "- " + selected.courseTitle : ""
                  }
Section: ${selected.section || "—"}
Student: ${selected.studentName || "Name Not Provided"}
Student Discipline: ${"Computer Science & Engineering"}
Degree: ${"B.Sc. Engineering"}
Teacher: ${selected.teacherName || "—"}
Teacher Discipline: ${selected.teacherDiscipline || "—"}
Institutes: ${
                    selected.teacherInstitute
                      ? selected.teacherInstitute
                      : "Khulna University"
                  }
Year: ${selected.year || "3rd Year"}
Term: ${selected.term || "1st Term"}
Date: ${
                    selected.createdAt
                      ? new Date(selected.createdAt).toLocaleDateString()
                      : new Date().toLocaleDateString()
                  }`}
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="p-3 border rounded-md bg-base-50">
                  <h3 className="text-sm font-semibold mb-2">User details</h3>
                  <div className="text-xs text-gray-700">
                    <div>
                      <strong>ID:</strong> {selected.user?._id || "—"}
                    </div>
                    <div className="mt-1">
                      <strong>Name:</strong> {selected.user?.name || "—"}
                    </div>
                    <div className="mt-1">
                      <strong>Email:</strong> {selected.user?.email || "—"}
                    </div>
                    <div className="mt-1">
                      <strong>Phone:</strong> {selected.user?.phone || "—"}
                    </div>
                    <div className="mt-1">
                      <strong>Joined:</strong>{" "}
                      {selected.user?.createdAt
                        ? new Date(selected.user.createdAt).toLocaleDateString()
                        : selected.createdAt
                        ? new Date(selected.createdAt).toLocaleDateString()
                        : "—"}
                    </div>
                    <div className="mt-1">
                      <strong>Role:</strong> {selected.user?.role || "—"}
                    </div>
                    <div className="mt-1">
                      <strong>Verified:</strong>{" "}
                      {selected.user?.isVerified ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-base-200 flex justify-end gap-2">
              <button className="btn btn-sm" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
