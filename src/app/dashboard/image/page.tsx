"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  FaPlus,
  FaImages,
  FaFolderPlus,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import { uploadFile } from "../../../../lib/uploadFile";

interface ImageItem {
  id: string;
  url: string;
  group: string;
  createdAt: string;
}
interface GroupBucket {
  name: string;
  images: ImageItem[];
}

// Demo seeded groups (would come from API)
const seedImages: ImageItem[] = [
  {
    id: "1",
    url: "https://picsum.photos/seed/a/400/260",
    group: "Diagrams",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    url: "https://picsum.photos/seed/b/400/260",
    group: "Diagrams",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    url: "https://picsum.photos/seed/c/400/260",
    group: "UI Mockups",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    url: "https://picsum.photos/seed/d/400/260",
    group: "UI Mockups",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    url: "https://picsum.photos/seed/e/400/260",
    group: "Research",
    createdAt: new Date().toISOString(),
  },
];

export default function ImagePage() {
  const [images, setImages] = useState<ImageItem[]>(seedImages);
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [newGroup, setNewGroup] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const groups = Array.from(new Set(images.map((i) => i.group))).sort();
  const buckets: GroupBucket[] = groups.map((g) => ({
    name: g,
    images: images.filter((i) => i.group === g),
  }));

  const fetchImages = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/all`);
    const data = await res.json();
    console.log(data);
    if (data.success) {
      setImages(data.images);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);
  // Auto select first group in modal if exists
  useEffect(() => {
    if (open && !selectedGroup && groups.length) setSelectedGroup(groups[0]);
  }, [open, groups, selectedGroup]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const groupName = newGroup.trim()
      ? newGroup.trim()
      : selectedGroup || "Ungrouped";

    try {
      const resUrl = await uploadFile(file);
      if (resUrl.success) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/images/upload`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: resUrl?.file?.url,
              group: groupName,
            }),
          }
        );
        const data = await res.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // Reset modal state
      setFile(null);
      setNewGroup("");
      setSelectedGroup(groupName);
      setOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FaImages className="text-primary" /> Image Library
          </h1>
          <p className="text-sm text-gray-600">
            Grouped image assets (demo data). Upload new images to existing or
            new groups.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium shadow hover:shadow-md"
        >
          <FaPlus /> Add Image
        </button>
      </header>

      {/* Grouped Gallery */}
      <div className="space-y-14">
        {buckets.map((bucket) => (
          <section key={bucket.name} className="space-y-5">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold tracking-tight flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-base-200 text-sm font-bold">
                  {bucket.images.length}
                </span>
                {bucket.name}
              </h2>
              <button
                onClick={() => {
                  setOpen(true);
                  setSelectedGroup(bucket.name);
                  setNewGroup("");
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-base-200 hover:bg-base-300 flex items-center gap-1"
              >
                <FaFolderPlus /> Add Here
              </button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {bucket.images.map((img) => (
                <figure
                  key={img.id}
                  className="group relative rounded-xl overflow-hidden border border-base-300 bg-base-100 shadow-sm hover:shadow-md transition"
                >
                  <Image
                    src={img.url}
                    alt={bucket.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 33vw, 20vw"
                  />
                  <figcaption className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-end justify-between p-2 opacity-0 group-hover:opacity-100 transition text-[10px] text-white">
                    <span className="truncate max-w-[70%]">
                      {new Date(img.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-[2px] rounded bg-white/20 backdrop-blur-sm">
                      {bucket.name}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
        {!buckets.length && (
          <p className="text-sm text-gray-500">
            No images yet. Start by uploading one.
          </p>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-xl rounded-2xl bg-base-100 border border-base-300 shadow-xl p-8 space-y-8">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-base-200 hover:bg-base-300 flex items-center justify-center"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold tracking-tight flex items-center gap-3">
              <FaUpload /> Upload Image
            </h3>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6 items-start">
                {/* Existing group selector */}
                <label className="flex flex-col gap-2 text-xs font-medium tracking-wide">
                  <span className="text-gray-600">Existing Group</span>
                  <select
                    disabled={!groups.length}
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="" disabled>
                      Select group
                    </option>
                    {groups.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>
                {/* New group */}
                <label className="flex flex-col gap-2 text-xs font-medium tracking-wide">
                  <span className="text-gray-600">New Group (optional)</span>
                  <input
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    placeholder="e.g. Week 05"
                    className="input input-bordered w-full"
                  />
                </label>
              </div>
              <div className="flex flex-col gap-2 text-xs font-medium tracking-wide">
                <span className="text-gray-600">Image File</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="file-input file-input-bordered w-full"
                />
                {file && (
                  <p className="text-[11px] text-gray-500">
                    Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-base-200 hover:bg-base-300"
                >
                  Cancel
                </button>
                <button
                  disabled={!file && !newGroup && !selectedGroup}
                  type="submit"
                  className="px-5 py-2.5 text-sm rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium shadow disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
