"use client";

import ThemeToggle from "@/sharedComponent/ThemToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes, FaSearch, FaChevronDown } from "react-icons/fa";

export default function AdminNavbar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "Admin Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/covers", label: "Covers" },
    { href: "/admin/group", label: "Groups" },
  ];

  return (
    <header className="w-full bg-base-100 border-b border-base-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 p-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen((s) => !s)}
            className="md:hidden btn btn-ghost btn-square btn-sm"
            aria-label="Toggle menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>

          <Link href="/admin" className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary">Admin Panel</span>
            <span className="text-xs text-gray-400">(manage)</span>
          </Link>

          <nav className={`hidden md:flex items-center gap-3 ml-4`}>
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm px-3 py-2 rounded ${
                  pathname === n.href
                    ? "bg-primary text-white"
                    : "hover:bg-base-200"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 border rounded-md px-2 py-1">
            <FaSearch className="text-gray-400" />
            <input
              className="input input-sm input-ghost w-48"
              placeholder="Search admin..."
            />
          </div>

          <ThemeToggle />

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm gap-2">
              Admin <FaChevronDown />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/">Back to Home</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-base-200 bg-base-50">
          <div className="p-3 flex flex-col gap-2">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3 py-2 rounded ${
                  pathname === n.href
                    ? "bg-primary text-white"
                    : "hover:bg-base-200"
                }`}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
