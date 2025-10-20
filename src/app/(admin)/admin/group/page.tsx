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
  const [search, setSearch] = useState("");

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/all`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      setGroups(
        Array.isArray(data?.groups)
          ? data.groups
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (e) {
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
                        width={80}
                        height={80}
                        src={g.thumbnail}
                        alt={g?.name}
                        priority
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
                    {g.description || "No description"}
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
                        className="btn btn-xs"
                        onClick={() => {
                          setSelectedGroup(g);
                          setShowPostModal(true);
                        }}
                      >
                        Update
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
        <div
          className="fixed inset-0 z-40 flex items-start sm:items-center justify-center bg-black/40"
          onClick={() => setShowPostModal(false)}
        >
          <div
            className="bg-base-100 rounded-lg w-full max-w-2xl mx-4 mt-12 sm:mt-0 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "80vh", overflow: "hidden" }}
          >
            <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-semibold text-lg">
                  {selectedGroup ? "Update Group" : "Create Group"}
                </h2>
                <div className="text-xs text-gray-500">
                  Provide name, type, optional thumbnail and members.
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm self-start sm:self-auto"
                onClick={() => setShowPostModal(false)}
              >
                Close
              </button>
            </div>

            <div
              className="p-4 overflow-auto"
              style={{ maxHeight: "calc(80vh - 128px)" }}
            >
              <CreateGroupForm
                existing={selectedGroup}
                onSaved={() => {
                  setShowPostModal(false);
                  setSelectedGroup(null);
                  fetchGroups();
                }}
              />
            </div>

            <div className="p-3 border-t bg-base-200 flex justify-end gap-2">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setShowPostModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateGroupForm({
  existing,
  onSaved,
}: {
  existing?: Group | null;
  onSaved: () => void;
}) {
  const [name, setName] = useState(existing?.name || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [thumbnail, setThumbnail] = useState(existing?.thumbnail || "");
  const [groupType, setGroupType] = useState("public");

  const [users, setUsers] = useState<Option[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Option[]>(() => {
    const list = existing?.members || [];
    const uniq = Array.from(new Set(list));
    return uniq.map((m) => ({ value: m, label: m }));
  });

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
        if (existing?.members) {
          const uniq = Array.from(new Set(existing.members));
          setSelectedMembers(opts.filter((o) => uniq.includes(o.value)));
        }
      } catch (e) {}
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: {
        name: string;
        description: string;
        thumbnail?: string;
        privacy?: string;
        members?: string[];
      } = {
        name,
        description,
        thumbnail,
        privacy: groupType,
        members: selectedMembers.map((s) => s.value),
      };

      if (existing && existing._id) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/groups/update/${existing._id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/create`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      onSaved();
    } catch (e) {
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

      <div className="mt-3">
        <label className="label">
          <span className="label-text">Group type</span>
        </label>
        <select
          name="groupType"
          id="groupType"
          value={groupType}
          onChange={(e) => setGroupType(e.target.value)}
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

      <label className="label mt-3">
        <span className="label-text">Thumbnail URL</span>
      </label>
      <input
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        placeholder="https://..."
        className="input input-bordered w-full"
      />
      {thumbnail ? (
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1">Preview</div>
          <div className="w-40 h-24 rounded-md overflow-hidden bg-base-200">
            {/* next/image requires host config for external images; this is a simple img fallback */}
            <Image
              width={80}
              height={80}
              priority
              src={thumbnail}
              alt="thumbnail preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="mt-3">
        <label className="label">
          <span className="label-text">Members</span>
        </label>
        <Select<Option, true>
          isMulti
          options={users}
          value={selectedMembers}
          onChange={(newValue) =>
            setSelectedMembers(Array.isArray(newValue) ? [...newValue] : [])
          }
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button className="btn btn-sm btn-ghost" onClick={onSaved}>
          Cancel
        </button>
        <button className="btn btn-sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : existing ? "Update Group" : "Create Group"}
        </button>
      </div>
    </div>
  );
}
