"use client";
import Link from "next/link";
import Logo from "./Logo";

const sections: { title: string; links: { label: string; href: string }[] }[] =
  [
    {
      title: "Product",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Cover Builder", href: "/cover" },
        { label: "Image Library", href: "/dashboard/image" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Docs (soon)", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/terms/privacy" },
      ],
    },
  ];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-base-300/60 bg-base-100/60 backdrop-blur supports-[backdrop-filter]:bg-base-100/50 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-12 md:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-gray-500 leading-relaxed text-xs md:text-[13px] max-w-xs">
            Manage your study notes, generate polished cover pages, organize
            images by group, and track productivity — all in one place.
          </p>
        </div>
        {sections.map((s) => (
          <div key={s.title} className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wide uppercase text-gray-500">
              {s.title}
            </h4>
            <ul className="space-y-2">
              {s.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-gray-600 hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="space-y-4 md:col-span-1">
          <h4 className="text-xs font-semibold tracking-wide uppercase text-gray-500">
            Newsletter
          </h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-3"
          >
            <div className="flex gap-2">
              <input
                required
                type="email"
                placeholder="Email address"
                className="input input-bordered input-sm flex-1"
              />
              <button className="btn text-neutral btn-primary btn-sm">
                Join
              </button>
            </div>
            <p className="text-[10px] text-gray-500 leading-snug">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
      <div className="border-t border-base-300/60">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-500">
            &copy; {year} Note Tree. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/terms/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <span className="text-gray-400">•</span>
            <a
              href="https://github.com/MottuqeBrid"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
