"use client";
import CoverDemoForm from "../_component/CoverDemoForm";
import HeroSlogan from "../_component/HeroSlogan";
import AllNewsletter from "../_component/AllNewsletter";
import { useState } from "react";

type Tabs = "hero" | "cover" | "newsletter";

export default function Page() {
  const [tab, setTab] = useState<Tabs>("hero");

  return (
    <div className="p-6">
      <nav
        className="mb-6 bg-base-200 rounded-lg p-1 flex gap-2 items-center"
        role="tablist"
        aria-label="Admin sections"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown")
            setTab((t) => (t === "hero" ? "cover" : "hero"));
          if (e.key === "ArrowLeft" || e.key === "ArrowUp")
            setTab((t) => (t === "cover" ? "hero" : "cover"));
        }}
      >
        <button
          id="tab-hero"
          role="tab"
          aria-controls="panel-hero"
          aria-selected={tab === "hero"}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            tab === "hero"
              ? "bg-primary text-white shadow"
              : "bg-transparent text-base-content/80 hover:bg-base-100"
          }`}
          onClick={() => setTab("hero")}
        >
          Hero
        </button>

        <button
          id="tab-cover"
          role="tab"
          aria-controls="panel-cover"
          aria-selected={tab === "cover"}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            tab === "cover"
              ? "bg-primary text-white shadow"
              : "bg-transparent text-base-content/80 hover:bg-base-100"
          }`}
          onClick={() => setTab("cover")}
        >
          Cover Demo
        </button>

        <button
          id="tab-newsletter"
          role="tab"
          aria-controls="panel-newsletter"
          aria-selected={tab === "newsletter"}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            tab === "newsletter"
              ? "bg-primary text-white shadow"
              : "bg-transparent text-base-content/80 hover:bg-base-100"
          }`}
          onClick={() => setTab("newsletter")}
        >
          Newsletter
        </button>

        {/* <div className="ml-auto text-xs text-gray-500">
          Use ← → to switch tabs
        </div> */}
      </nav>

      <section
        id="panel-hero"
        role="tabpanel"
        aria-labelledby="tab-hero"
        hidden={tab !== "hero"}
      >
        {tab === "hero" && <HeroSlogan />}
      </section>

      <section
        id="panel-cover"
        role="tabpanel"
        aria-labelledby="tab-cover"
        hidden={tab !== "cover"}
      >
        {tab === "cover" && <CoverDemoForm />}
      </section>

      <section
        id="panel-newsletter"
        role="tabpanel"
        aria-labelledby="tab-newsletter"
        hidden={tab !== "newsletter"}
      >
        {tab === "newsletter" && <AllNewsletter />}
      </section>
    </div>
  );
}
