"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FaSync, FaSearch, FaEye } from "react-icons/fa";
import UserModal from "../../_component/UserModal";

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
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  // pagination
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  // reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, perPage]);

  // Actions moved into the UserModal. Table now only contains the View button.

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

            {/* Pagination controls */}
            <div className="flex items-center gap-2 ml-4">
              <label className="text-xs text-gray-500">Per page</label>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="select select-sm select-bordered w-20"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <div className="text-xs text-gray-500 pl-3">
                {total === 0
                  ? "0 items"
                  : `Showing ${(page - 1) * perPage + 1} - ${Math.min(
                      page * perPage,
                      total
                    )} of ${total}`}
              </div>
              <div className="btn-group ml-2">
                <button
                  className="btn btn-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page >= pageCount}
                >
                  Next
                </button>
              </div>
            </div>
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
              {!loading && paginated.length === 0 && (
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
                paginated.map((u, i) => (
                  <tr
                    key={u._id}
                    className={
                      u.isDeleted
                        ? "bg-red-50 text-red-600 opacity-90"
                        : u.isbanned
                        ? "bg-yellow-50 text-yellow-700"
                        : !u.isVerified
                        ? "bg-gray-50 text-gray-500"
                        : ""
                    }
                  >
                    <td className="text-xs">{(page - 1) * perPage + i + 1}</td>
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
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setModalOpen(true);
                          }}
                          className="btn btn-xs btn-ghost flex items-center gap-2"
                        >
                          <FaEye /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <UserModal
          user={selectedUser}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={() => fetchUsers()}
        />
      </div>
    </div>
  );
}
