"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaTimes, FaSave } from "react-icons/fa";
import Swal from "sweetalert2";

type User = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  photo?: { profile?: string } | null;
  cover?: string[] | null;
  note?: unknown[] | null;
  isVerified?: boolean;
  isPhoneVerified?: boolean;
  isbanned?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
};

type Props = {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

export default function UserModal({ user, open, onClose, onSaved }: Props) {
  const [form, setForm] = useState({ name: "", email: "", role: "user" });
  const [verified, setVerified] = useState(false);
  const [banned, setBanned] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
      });
      setVerified(Boolean(user.isVerified));
      setBanned(Boolean(user.isbanned));
      setDeleted(Boolean(user.isDeleted));
    }
  }, [user]);

  // derived display values
  const statusDescription = user
    ? user.isbanned
      ? "Banned"
      : user.isDeleted
      ? "Deleted"
      : user.isVerified
      ? "Verified"
      : "Not verified"
    : "";

  const statusBadgeClass = user
    ? user.isDeleted
      ? "badge badge-error"
      : user.isbanned
      ? "badge badge-warning"
      : user.isVerified
      ? "badge badge-success"
      : "badge badge-ghost"
    : "badge badge-ghost";

  const coversCount = user?.cover?.length || 0;
  const notesCount = user?.note?.length || 0;

  if (!open || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admin/users/${user._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            role: form.role,
            isVerified: verified,
            isbanned: banned,
            isDeleted: deleted,
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Save failed");
      Swal.fire("Saved", "User updated.", "success");
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "Save failed",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admin/users/${user._id}/resend-verification`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to resend");
      Swal.fire("Sent", "Verification email resent.", "success");
    } catch (e) {
      Swal.fire(
        "Error",
        e instanceof Error ? e.message : "Failed to resend",
        "error"
      );
    }
  };

  // Note: permanent removal handler is implemented below as handleRemoveFromDB

  // Permanently remove user from DB
  const handleRemoveFromDB = async () => {
    const resConfirm = await Swal.fire({
      title: "Remove user from DB?",
      text: "This will permanently delete the user record from the database. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
    });
    if (!resConfirm.isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admin/users/${user._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to remove user");
      }
      Swal.fire("Removed", "User permanently removed.", "success");
      if (onSaved) onSaved();
      onClose();
    } catch (e) {
      Swal.fire("Error", e instanceof Error ? e.message : "Failed", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSave}
        className="relative w-full max-w-2xl bg-base-100 border border-base-300 rounded-2xl p-6 z-10"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-base-200 hover:bg-base-300"
        >
          <FaTimes />
        </button>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-base-300">
                <Image
                  src={
                    user.photo?.profile ||
                    "https://avatars.githubusercontent.com/u/000?v=4"
                  }
                  alt={user.name || "User"}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name || "—"}</h3>
              <div className="text-xs text-gray-500">{user.email || "—"}</div>
              {user.phone && (
                <div className="text-xs text-gray-500 mt-1">{user.phone}</div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={statusBadgeClass}>{statusDescription}</span>
                <span className="text-xs text-gray-400">
                  Joined{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-start">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Notes :</span>
            <span className="text-xl font-medium">{notesCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 mt-2">Covers :</span>
            <span className="text-xl font-medium">{coversCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-sm">
            <span className="text-xs text-gray-500">Name</span>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="input input-bordered"
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-xs text-gray-500">Email</span>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="input input-bordered"
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-xs text-gray-500">Role</span>
            <select
              value={form.role}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, role: e.target.value }))
              }
              className="select select-bordered"
            >
              <option value="user">user</option>
              <option value="moderator">moderator</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="checkbox"
              />{" "}
              <span className="text-sm">Verified</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={banned}
                onChange={(e) => setBanned(e.target.checked)}
                className="checkbox"
              />{" "}
              <span className="text-sm">Banned</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={deleted}
                onChange={(e) => setDeleted(e.target.checked)}
                className="checkbox"
              />{" "}
              <span className="text-sm">Deleted</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResend}
              className="btn btn-sm btn-ghost"
            >
              Resend verification
            </button>
            <button
              type="button"
              onClick={handleRemoveFromDB}
              className="btn btn-sm btn-error"
            >
              Remove from DB
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="btn btn-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-sm btn-primary inline-flex text-neutral items-center gap-2"
            >
              {saving ? "Saving..." : "Save"} <FaSave />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
