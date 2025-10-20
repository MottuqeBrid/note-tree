"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

type Hero = {
  slogan?: string;
  subSlogan?: string;
  image?: string;
};

export default function HeroSlogan() {
  const [hero, setHero] = useState<Hero>({
    slogan: "",
    subSlogan: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async function fetchHero() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/others/hero`
        );
        const data = await res.json();
        if (data?.success) {
          setHero({
            slogan: data.hero?.slogan || "",
            subSlogan: data.hero?.subSlogan || "",
            image: data.hero?.image || "",
          });
        }
      } catch (err) {}
    })();
  }, []);

  function update<K extends keyof Hero>(k: K, v: Hero[K]) {
    setHero((s) => ({ ...s, [k]: v }));
  }

  function validate() {
    if (!hero.slogan?.trim()) return "Slogan is required";
    return null;
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const v = validate();
    if (v) return Swal.fire({ icon: "error", text: v });
    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/others/hero`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        Swal.fire({ icon: "success", text: "Hero updated" });
      } else {
        Swal.fire({ icon: "error", text: data?.message || "Failed" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", text: "Unexpected error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 max-w-2xl">
      <h3 className="text-lg font-semibold mb-3">Update Hero</h3>
      <form onSubmit={submit} className="space-y-3">
        <label className="flex flex-col">
          <span className="text-sm font-medium">Slogan</span>
          <input
            className="input input-bordered"
            value={hero.slogan}
            onChange={(e) => update("slogan", e.target.value)}
            placeholder="Main slogan"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Sub slogan</span>
          <textarea
            className="textarea textarea-bordered"
            value={hero.subSlogan}
            onChange={(e) => update("subSlogan", e.target.value)}
            placeholder="Optional sub slogan"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Image URL</span>
          <input
            className="input input-bordered"
            value={hero.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://..."
          />
        </label>

        {hero.image ? (
          <div className="mt-2">
            <span className="text-sm font-medium">Preview</span>
            <div className="mt-2 relative w-full h-48">
              <Image
                src={hero.image}
                alt="hero preview"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            type="submit"
            className="btn btn-primary text-neutral"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() =>
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/hero/reset`, {
                method: "POST",
                credentials: "include",
              })
                .then(() =>
                  Swal.fire({ icon: "success", text: "Reset requested" })
                )
                .catch(() => Swal.fire({ icon: "error", text: "Reset failed" }))
            }
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
