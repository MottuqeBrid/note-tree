"use client";
import React, { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaImages,
  FaBookOpen,
  FaPrint,
  FaCloudUploadAlt,
  FaRegClock,
} from "react-icons/fa";

interface StatItem {
  key: string;
  label: string;
  value: number;
  delta?: number; // change vs prior period
  icon: React.ReactNode;
  color: string;
  hint?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo data (placeholder). Replace with API calls when backend ready.
    // Could fetch from: /api/dashboard/summary
    const demo: StatItem[] = [
      {
        key: "notes",
        label: "Notes Created",
        value: 128,
        delta: 12,
        icon: <FaBookOpen className="text-2xl" />,
        color: "from-indigo-500 to-indigo-600",
        hint: "Total individual note documents",
      },
      {
        key: "images",
        label: "Images Added",
        value: 342,
        delta: 28,
        icon: <FaImages className="text-2xl" />,
        color: "from-pink-500 to-rose-500",
        hint: "Uploaded images across notes",
      },
      {
        key: "covers",
        label: "Cover Pages Generated",
        value: 47,
        delta: 5,
        icon: <FaPrint className="text-2xl" />,
        color: "from-emerald-500 to-teal-600",
        hint: "PDF/print cover exports",
      },
      {
        key: "attachments",
        label: "File Attachments",
        value: 89,
        delta: -3,
        icon: <FaCloudUploadAlt className="text-2xl" />,
        color: "from-amber-500 to-orange-500",
        hint: "Non-image supporting files",
      },
      {
        key: "templates",
        label: "Design Templates",
        value: 12,
        icon: <FaFileAlt className="text-2xl" />,
        color: "from-sky-500 to-cyan-500",
        hint: "Available cover designs",
      },
      {
        key: "recent",
        label: "Recent Sessions",
        value: 9,
        icon: <FaRegClock className="text-2xl" />,
        color: "from-violet-500 to-fuchsia-500",
        hint: "User sessions in last 24h (demo)",
      },
    ];
    setTimeout(() => {
      setStats(demo);
      setLoading(false);
    }, 400); // simulate small load delay
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-600">
          Aggregated activity metrics (demo data).
        </p>
      </header>

      <section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading && (
            <div className="col-span-full flex justify-center py-10 text-gray-500 text-sm">
              Loading metrics...
            </div>
          )}
          {!loading &&
            stats.map((s) => {
              const positive = (s.delta ?? 0) > 0;
              const negative = (s.delta ?? 0) < 0;
              return (
                <div
                  key={s.key}
                  className="group relative rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm hover:shadow transition overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br ${s.color} mix-blend-multiply`}
                  />
                  <div className="relative flex items-start justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.color} text-white shadow-md`}
                        >
                          {s.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-500 group-hover:text-gray-100 transition">
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-end gap-3">
                        <span className="text-4xl font-bold tracking-tight group-hover:text-white transition">
                          {s.value}
                        </span>
                        {s.delta !== undefined && (
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm border ${
                              positive
                                ? "text-emerald-600 border-emerald-200 bg-emerald-50 group-hover:bg-emerald-500/20 group-hover:text-emerald-100"
                                : negative
                                ? "text-rose-600 border-rose-200 bg-rose-50 group-hover:bg-rose-500/30 group-hover:text-rose-100"
                                : "text-gray-500 border-gray-200 bg-gray-50 group-hover:bg-gray-500/20 group-hover:text-gray-100"
                            }`}
                          >
                            {positive ? `+${s.delta}` : s.delta}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {s.hint && (
                    <p className="mt-4 text-[11px] leading-relaxed text-gray-500 group-hover:text-gray-200 transition max-w-[180px]">
                      {s.hint}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Next Steps (Demo)
        </h2>
        <ul className="text-sm text-gray-600 list-disc pl-6 space-y-1">
          <li>Replace demo metrics with real API endpoint.</li>
          <li>Add time range filter (7d / 30d / All).</li>
          <li>Drill-down pages for Notes & Cover exports.</li>
          <li>Integrate charts (sparklines for trends).</li>
        </ul>
      </section>
    </div>
  );
}
