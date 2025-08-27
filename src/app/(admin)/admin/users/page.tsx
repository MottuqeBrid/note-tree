"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FaSync, FaSearch, FaEye } from "react-icons/fa";
import Link from "next/link";
import Swal from "sweetalert2";

type User = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
  isVerified?: boolean;
  isPhoneVerified?: boolean;
  isDeleted?: boolean;
  isbanned?: boolean;
};

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admin/users`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );
      const data = await res.json();
      console.log(data);
      const arr = data?.users || [];
      setUsers(Array.isArray(arr) ? arr : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call API to delete user
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/users/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isDeleted: true }),
        })
          .then((res) => {
            if (res.ok) {
              Swal.fire("Deleted!", "User has been deleted.", "success");
              fetchUsers();
            } else {
              Swal.fire("Error!", "Failed to delete user.", "error");
            }
          })
          .catch((error) => {
            Swal.fire("Error!", error.message, "error");
          });
      }
    });
  };

  const handleBan = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, ban it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call API to ban user
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/users/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isbanned: !users.find((u) => u._id === id)?.isbanned,
          }),
        })
          .then((res) => {
            if (res.ok) {
              Swal.fire("Banned!", "User has been banned.", "success");
              fetchUsers();
            } else {
              Swal.fire("Error!", "Failed to ban user.", "error");
            }
          })
          .catch((error) => {
            Swal.fire("Error!", error.message, "error");
          });
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-sm text-gray-500">Manage application users</p>
            <p>Total Users: {users.length}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input input-sm input-bordered pl-10"
                placeholder="Search name, email or role"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={fetchUsers}
              className="btn btn-sm btn-ghost"
              disabled={loading}
            >
              <FaSync className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-base-300 bg-base-100 overflow-x-auto">
          {error && <div className="p-4 text-sm text-red-600">{error}</div>}
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-xs">#</th>
                <th className="text-xs">Name</th>
                <th className="text-xs">Email</th>
                <th className="text-xs">Role</th>
                <th className="text-xs">Verified</th>
                <th className="text-xs">Created</th>
                <th className="text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-sm text-gray-500"
                  >
                    Loading users...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((u, i) => (
                  <tr
                    key={u._id}
                    className={u.isDeleted ? "opacity-60 text-red-500" : ""}
                  >
                    <td className="text-xs">{i + 1}</td>
                    <td className="text-sm font-medium">{u.name || "—"}</td>
                    <td className="text-sm">{u.email || "—"}</td>
                    <td className="text-sm">{u.role || "user"}</td>
                    <td className="text-sm">{u.isVerified ? "Yes" : "No"}</td>
                    <td className="text-sm">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/users/${u._id}`}
                          className="btn btn-xs btn-ghost flex items-center gap-2"
                        >
                          <FaEye /> View
                        </Link>
                        <button
                          disabled={u.isDeleted}
                          onClick={() => handleDelete(u._id)}
                          className="btn btn-xs btn-ghost flex items-center gap-2"
                        >
                          Delete
                        </button>
                        {u.isbanned ? (
                          <button
                            onClick={() => handleBan(u._id)}
                            className="btn btn-xs text-red-600 font-medium"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBan(u._id)}
                            className="btn btn-xs btn-ghost flex items-center gap-2"
                          >
                            Ban
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
