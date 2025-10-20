"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Subscriber = {
  _id: string;
  name?: string;
  email: string;
  createdAt?: string;
};

export default function AllNewsletter() {
  const [list, setList] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function fetchList() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/others/newsletter`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data?.success) setList(data.newsletters || []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleDelete(id: string) {
    const ok = await Swal.fire({
      title: "Delete subscriber?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((r) => r.isConfirmed);
    if (!ok) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/others/newsletter/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data?.success) {
        setList((s) => s.filter((i) => i._id !== id));
        Swal.fire({ icon: "success", text: "Deleted" });
      } else {
        Swal.fire({ icon: "error", text: data?.message || "Failed" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", text: "Unexpected error" });
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Newsletter Subscribers</h2>
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : list.length === 0 ? (
        <div className="text-sm text-gray-500">No subscribers found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-left">Email</th>
                <th className="text-left">Subscribed</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s._id}>
                  <td>{s.email}</td>
                  <td>
                    {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
