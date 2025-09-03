"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import Link from "next/link";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";

type Group = {
  _id: string;
  name: string;
  thumbnail?: string;
  description?: string;
  members?: string[];
  image?: string[];
  post?: Post;
};

type Post = {
  image?: string[];
  _id?: string;
  name?: string;
  title?: string;
  description?: string;
  createdAt?: string;
  createdBy?: string;
  link?: { name?: string; url?: string }[];
  file?: { name?: string; url?: string }[];
  tags?: string[];
};

type Option = { value: string; label: string };

export default function Page() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [search, setSearch] = useState("");

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/all`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      console.log(data);
      setGroups(
        Array.isArray(data?.groups)
          ? data.groups
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-sm text-gray-500">
            Manage groups and posts —{" "}
            <span className="font-medium">{groups.length}</span> total
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groups..."
              className="input input-sm input-bordered pl-10 w-full"
            />
          </div>
          <button
            className="btn btn-sm"
            onClick={() => {
              setSelectedGroup(null);
              setShowPostModal(true);
            }}
          >
            Create Group
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">Loading groups...</div>
      )}

      {!loading && groups.length === 0 && (
        <div className="text-sm text-gray-500">No groups found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(groups || [])
          .filter((g) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return (
              (g.name || "").toLowerCase().includes(q) ||
              (g.description || "").toLowerCase().includes(q)
            );
          })
          .map((g) => (
            <div
              key={g._id}
              className="border rounded-md p-4 bg-base-100 hover:shadow-md transition"
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-md bg-base-200 overflow-hidden flex items-center justify-center">
                  {g?.thumbnail && g?.thumbnail.length > 0 ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={g.thumbnail}
                        alt={g.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 px-2">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{g.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {g.description || "—"}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-[11px] text-gray-400">
                      Members:{" "}
                      <span className="font-medium">
                        {g.members?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/group/${g._id}`}
                        className="btn btn-xs"
                      >
                        View Group
                      </Link>
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={() => {
                          setSelectedGroup(g);
                          setShowMembers(true);
                        }}
                      >
                        Members
                      </button>
                    </div>
                  </div>
                  {g.post?.title && (
                    <div className="mt-3 text-[12px] text-gray-600">
                      <div className="font-medium">Latest: {g.post.title}</div>
                      <div className="text-[11px] text-gray-400">
                        {g.post.createdAt
                          ? new Date(g.post.createdAt).toLocaleDateString()
                          : ""}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add Group Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-base-100 rounded-lg w-full max-w-2xl mx-4">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Create Group</h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowPostModal(false)}
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <CreateGroupForm
                onSaved={() => {
                  setShowPostModal(false);
                  fetchGroups();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {showMembers && (
        <MembersModal
          group={selectedGroup}
          onClose={() => {
            setShowMembers(false);
            setSelectedGroup(null);
            fetchGroups();
          }}
        />
      )}
    </div>
  );
}

function CreateGroupForm({ onSaved }: { onSaved: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { name, description };
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onSaved();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <label className="label">
        <span className="label-text">Group Name</span>
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full"
      />

      <div className="">
        <label className="label">
          <span className="label-text">Group type</span>
        </label>
        <select
          name="groupType"
          id="groupType"
          className="select select-bordered w-full"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <label className="label mt-3">
        <span className="label-text">Group Description</span>
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea textarea-bordered w-full"
      />

      <div className="mt-4 flex justify-end gap-2">
        <button className="btn btn-sm btn-ghost" onClick={onSaved}>
          Cancel
        </button>
        <button className="btn btn-sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Post"}
        </button>
      </div>
    </div>
  );
}

function MembersModal({
  group,
  onClose,
}: {
  group: Group | null;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/admin/users`,
          { credentials: "include", cache: "no-store" }
        );
        const data = await res.json();
        const opts: Option[] = (data?.users || []).map(
          (u: { _id: string; name?: string; email?: string }) => ({
            value: u._id,
            label: u.name || u.email || u._id,
          })
        );
        setUsers(opts);
        if (group?.members)
          setSelected(
            opts.filter((o: Option) => group.members?.includes(o.value))
          );
      } catch (e) {
        console.error(e);
      }
    };
    fetchUsers();
  }, [group]);

  const handleSave = async () => {
    if (!group) return;
    try {
      setSaving(true);
      const memberIds = selected.map((s) => s.value);
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/groups/update/${group._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ members: memberIds }),
        }
      );
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-base-100 rounded-md w-full max-w-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Manage Members for {group?.name}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <div>
          <label className="label">
            <span className="label-text">Members</span>
          </label>
          <Select<Option, true>
            isMulti
            options={users}
            value={selected}
            onChange={(newValue) =>
              setSelected(Array.isArray(newValue) ? [...newValue] : [])
            }
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
