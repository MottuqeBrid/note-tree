"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  FaPlus,
  FaImages,
  FaFolderPlus,
  FaTimes,
  FaUpload,
  FaRedoAlt,
  FaSearch,
  FaSync,
  FaTrash,
  FaCopy,
} from "react-icons/fa";
import { uploadFile } from "../../../../lib/uploadFile";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface ImageItem {
  _id: string;
  url: string;
  group: string;
  createdAt: string;
  updatedAt?: string;
  user?: string;
}

type ImageGroups = Record<string, ImageItem[]>; // keyed by group name

export default function ImagePage() {
  const [images, setImages] = useState<ImageGroups>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [newGroup, setNewGroup] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<Set<string>>(new Set());

  const groups = useMemo(
    () => Object.keys(images).sort((a, b) => a.localeCompare(b)),
    [images]
  );

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => g.toLowerCase().includes(q));
  }, [groups, search]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/all`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      if (data.success) {
        setImages(data.images || {});
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load images";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const groupName = newGroup.trim() || selectedGroup || "Ungrouped";
    try {
      setUploading(true);
      const resUrl = await uploadFile(file);
      if (!resUrl.success) throw new Error("Upload failed");
      const payload = { url: resUrl?.file?.url, group: groupName };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/images/upload`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Save failed");
      // Optimistic prepend
      setImages((prev) => ({
        ...prev,
        [groupName]: [data.image, ...(prev[groupName] || [])],
      }));
      toast.success("Image uploaded");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      console.error(err);
      toast.error(msg);
    } finally {
      setUploading(false);
      setFile(null);
      setNewGroup("");
      setSelectedGroup(groupName);
      setOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied URL");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleDelete = async (group: string, image: ImageItem) => {
    const result = await Swal.fire({
      title: "Delete this image?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          setDeleting((prev) => new Set(prev).add(image._id));
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/images/delete/${image._id}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );
          const data = await res.json().catch(() => ({ success: false }));
          if (!res.ok || !data.success)
            throw new Error(data.message || "Delete failed");
          setImages((prev) => {
            const copy = { ...prev };
            copy[group] = (copy[group] || []).filter(
              (i) => i._id !== image._id
            );
            if (!copy[group].length) delete copy[group];
            return copy;
          });
          return true;
        } catch (err) {
          Swal.showValidationMessage(
            err instanceof Error ? err.message : "Delete failed"
          );
          return false;
        } finally {
          setDeleting((prev) => {
            const n = new Set(prev);
            n.delete(image._id);
            return n;
          });
          fetchImages();
        }
      },
    });
    if (result.isConfirmed && result.value) {
      toast.success("Deleted");
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
        <div className="flex items-center gap-3">
          <button
            onClick={fetchImages}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-base-200 hover:bg-base-300 text-sm font-medium disabled:opacity-40"
          >
            {loading ? (
              <>
                <FaSync className="animate-spin" /> Loading
              </>
            ) : (
              <>
                <FaRedoAlt /> Refresh
              </>
            )}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium shadow hover:shadow-md"
          >
            <FaPlus /> Add Image
          </button>
        </div>
      </header>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups..."
            className="input input-bordered pl-8 w-56 h-10"
          />
        </div>
        <span className="text-xs text-gray-500">
          {groups.length} group{groups.length === 1 ? "" : "s"},{" "}
          {Object.values(images).reduce((a, arr) => a + arr.length, 0)} image
          {Object.values(images).reduce((a, arr) => a + arr.length, 0) === 1
            ? ""
            : "s"}
        </span>
      </div>

      <div className="space-y-14">
        {error && (
          <div className="alert alert-error text-sm">
            <span>{error}</span>
          </div>
        )}
        {loading && !groups.length && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl bg-gradient-to-br from-base-200 to-base-300 animate-pulse"
              />
            ))}
          </div>
        )}
        {filteredGroups.map((group) => {
          const list = images[group] || [];
          return (
            <section key={group} className="space-y-5">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-base-200 text-sm font-bold uppercase">
                    {group.slice(0, 3)}
                  </span>
                  <span>
                    {group}{" "}
                    <span className="text-xs text-gray-500">
                      ({list.length})
                    </span>
                  </span>
                </h2>
                <button
                  onClick={() => {
                    setOpen(true);
                    setSelectedGroup(group);
                    setNewGroup("");
                  }}
                  className="text-xs px-3 py-1.5 rounded-full bg-base-200 hover:bg-base-300 flex items-center gap-1"
                >
                  <FaFolderPlus /> Add Here
                </button>
              </div>
              {!list.length && (
                <p className="text-xs text-gray-500 ml-1">
                  No images in this group yet.
                </p>
              )}
              {list.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {list.map((img) => (
                    <figure
                      key={img._id}
                      className="group relative rounded-xl overflow-hidden border border-base-300 bg-base-100 shadow-sm hover:shadow-md transition"
                    >
                      <Image
                        src={img.url}
                        width={400}
                        height={300}
                        alt={group}
                        placeholder="blur"
                        blurDataURL={img.url}
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 33vw, 20vw"
                      />
                      {/* Hover action buttons */}
                      <div className="absolute top-2 z-10 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleCopy(img.url)}
                          title="Copy URL"
                          className="w-8 h-8 rounded-lg bg-black/45 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 text-xs"
                        >
                          <FaCopy />
                        </button>
                        <button
                          onClick={() => handleDelete(group, img)}
                          disabled={deleting.has(img._id)}
                          title="Delete"
                          className="w-8 h-8 rounded-lg bg-red-500/70 hover:bg-red-600 text-white flex items-center justify-center text-xs disabled:opacity-50"
                        >
                          {deleting.has(img._id) ? (
                            <FaSync className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                      <figcaption className="absolute inset-0 bg-black/0 group-hover:bg-black/45 flex items-end justify-between p-2 opacity-0 group-hover:opacity-100 transition text-[10px] text-white">
                        <span className="truncate max-w-[70%]">
                          {new Date(img.createdAt).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-[2px] rounded bg-white/20 backdrop-blur-sm uppercase">
                          {group}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </section>
          );
        })}
        {!loading && !groups.length && !error && (
          <p className="text-sm text-gray-500">
            No images yet. Start by uploading one.
          </p>
        )}
        {!loading && groups.length && !filteredGroups.length && (
          <p className="text-sm text-gray-500">No groups match your search.</p>
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
                  disabled={
                    uploading ||
                    !file ||
                    (!newGroup.trim() && !selectedGroup.trim())
                  }
                  type="submit"
                  className="px-5 py-2.5 text-sm rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium shadow disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {uploading && <FaSync className="animate-spin text-xs" />}
                  {uploading ? "Uploading" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
