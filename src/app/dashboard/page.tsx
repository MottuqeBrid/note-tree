"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  FaFileAlt,
  FaImages,
  FaBookOpen,
  FaPrint,
} from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

interface StatItem {
  key: string;
  label: string;
  value: number;
  delta?: number; // change vs prior period
  icon: React.ReactNode;
  color: string;
  hint?: string;
}

interface UserSummary {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  photo?: { profile?: string };
  location?: { country?: string };
  cover?: string[];
  image?: string[];
  note?: unknown[]; // unknown shape
  role?: string;
  gender?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/dashboard/summary`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );
      const data = await res.json();
      if (res.ok && data?.user) {
        setUser(data.user);
      } else {
        throw new Error(data.message || "Failed to load dashboard");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const derivedStats = useMemo<StatItem[]>(() => {
    if (!user) return [];
    const notes = user.note?.length || 0;
    const images = user.image?.length || 0;
    const covers = user.cover?.length || 0;

    const groups = 1;
    const templates = 12; // current number of cover templates in app
    const base: StatItem[] = [
      {
        key: "notes",
        label: "Notes Created",
        value: notes,
        icon: <FaBookOpen className="text-2xl" />,
        color: "from-indigo-500 to-indigo-600",
        hint: "Total note entries",
      },
      {
        key: "images",
        label: "Images Added",
        value: images,
        icon: <FaImages className="text-2xl" />,
        color: "from-pink-500 to-rose-500",
        hint: "Images uploaded",
      },
      {
        key: "covers",
        label: "Cover Pages Generated",
        value: covers,
        icon: <FaPrint className="text-2xl" />,
        color: "from-emerald-500 to-teal-600",
        hint: "Generated cover designs",
      },
      {
        key: "groups",
        label: "Groups are you joined",
        value: groups,
        icon: <FaUserGroup className="text-2xl" />,
        color: "from-amber-500 to-orange-500",
        hint: "Other uploaded files",
      },
      {
        key: "templates",
        label: "Design Templates",
        value: templates,
        icon: <FaFileAlt className="text-2xl" />,
        color: "from-sky-500 to-cyan-500",
        hint: "Available cover layouts",
      },
    ];
    return base;
  }, [user]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setStats(derivedStats);
  }, [derivedStats]);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      <header className="space-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            {user && (
              <p className="text-sm text-gray-500">
                Welcome back, <span className="font-medium">{user.name}</span>
              </p>
            )}
          </div>
          {user && (
            <div className="flex items-center gap-4 p-3 rounded-xl border border-base-300 bg-base-100/70">
              <Image
                src={
                  user.photo?.profile ||
                  "https://avatars.githubusercontent.com/u/000?v=4"
                }
                alt={user.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-xl object-cover border border-base-300"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-[11px] text-gray-400">
                  Joined {new Date(user.createdAt).toLocaleDateString()} •{" "}
                  {user.location?.country || "Unknown"}
                </p>
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="alert alert-error max-w-md text-sm py-2">
            <span>{error}</span>
          </div>
        )}
      </header>

      <section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading && (
            <div className="col-span-full flex justify-center py-10 text-gray-500 text-sm">
              Loading metrics...
            </div>
          )}
          {!loading &&
            stats.length > 0 &&
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
          {!loading && !stats.length && !error && (
            <div className="col-span-full text-center py-10 text-xs text-gray-500">
              No statistics to display.
            </div>
          )}
        </div>
      </section>

      {user && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Snapshot</h2>
          <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
            <table className="table table-sm">
              <tbody className="text-xs">
                <tr>
                  <th className="font-medium">Role</th>
                  <td>{user.role || "user"}</td>
                  <th className="font-medium">Gender</th>
                  <td>{user.gender || "—"}</td>
                </tr>
                <tr>
                  <th className="font-medium">Notes</th>
                  <td>{user.note?.length || 0}</td>
                  <th className="font-medium">Images</th>
                  <td>{user.image?.length || 0}</td>
                </tr>
                <tr>
                  <th className="font-medium">Covers</th>
                  <td>{user.cover?.length || 0}</td>
                  <th className="font-medium">Updated</th>
                  <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
