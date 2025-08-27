"use client";

import { useEffect, useState, useCallback } from "react";

type ThemeMode = "light" | "dark" | "system";

function getPreferred(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as ThemeMode | null;
  if (stored) return stored;
  return "system";
}

function resolve(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return mode;
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => getPreferred());
  const [mounted, setMounted] = useState(false);
  const applied = resolve(mode);

  // Mark mounted (prevents hydration diff when markup changed between versions)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", applied);
  }, [applied]);

  // React to system change if in system mode
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      const next = mq.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
    };
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [mode]);

  const cycle = useCallback(() => {
    setMode((prev) => {
      const order: ThemeMode[] = ["light", "dark", "system"];
      const next = order[(order.indexOf(prev) + 1) % order.length];
      localStorage.setItem("theme", next === "system" ? "system" : next);
      return next;
    });
  }, []);

  const label = mode === "system" ? `System (${applied})` : mode;

  // While not mounted, render a static placeholder that matches server output (sun icon, light label)
  if (!mounted) {
    return (
      <button
        type="button"
        className="btn btn-ghost btn-sm gap-2"
        aria-label="Toggle theme"
        disabled
        suppressHydrationWarning
      >
        <span className="inline-flex w-4 h-4 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </span>
        <span className="text-xs capitalize" suppressHydrationWarning>
          light
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="btn btn-ghost btn-sm gap-2"
      aria-label="Toggle theme"
      title="Toggle theme (light / dark / system)"
    >
      <span className="inline-flex w-4 h-4 items-center justify-center">
        {applied === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M21.752 15.002A9.718 9.718 0 0112.004 22C6.486 22 2 17.514 2 12.004 2 7.278 5.486 3.345 10.017 2.2a1 1 0 01.977 1.64A7.718 7.718 0 0012.004 20a7.72 7.72 0 006.153-3.133 1 1 0 011.595-.135z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        )}
      </span>
      <span className="text-xs capitalize">{label}</span>
    </button>
  );
}
