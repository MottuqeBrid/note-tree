"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import Image from "next/image";

type Group = {
  _id: string;
  name: string;
  description?: string;
  members?: string[];
  image?: string[];
  post?: Post;
};

type Post = {
  image?: string[];
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
  const [showViewPost, setShowViewPost] = useState(false);

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-sm text-gray-500">Manage groups and posts</p>
        </div>
        <div>
          <button
            className="btn btn-sm"
            onClick={() => {
              setSelectedGroup(null);
              setShowPostModal(true);
            }}
          >
            Create Post
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
        {groups.map((g) => (
          <div key={g._id} className="border rounded-md p-4 bg-base-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{g.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{g.description}</p>
                <p className="text-[11px] text-gray-400 mt-2">
                  Members: {g.members?.length || 0}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <button
                    className="btn btn-xs"
                    onClick={() => {
                      setSelectedGroup(g);
                      setShowPostModal(true);
                    }}
                  >
                    Post
                  </button>
                  <button
                    className="btn btn-xs btn-outline"
                    onClick={() => {
                      setSelectedGroup(g);
                      setShowViewPost(true);
                    }}
                    disabled={!g.post}
                  >
                    View Post
                  </button>
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
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-base-100 rounded-lg w-full max-w-2xl mx-4">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">
                {selectedGroup
                  ? `Post for ${selectedGroup.name}`
                  : "Create Post"}
              </h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowPostModal(false)}
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <PostForm
                onSaved={() => {
                  setShowPostModal(false);
                  fetchGroups();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Post Modal (read-only) */}
      {showViewPost && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-base-100 rounded-lg w-full max-w-3xl mx-4 overflow-auto max-h-[90vh]">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  {selectedGroup.post?.title || "Post"}
                </h2>
                <div className="text-xs text-gray-500">
                  {selectedGroup.name} •{" "}
                  {selectedGroup.post?.createdAt
                    ? new Date(selectedGroup.post.createdAt).toLocaleString()
                    : ""}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowViewPost(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {selectedGroup.post?.image &&
                selectedGroup.post.image.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedGroup.post.image.map((src, i) => (
                      <div
                        key={i}
                        className="relative w-full h-32 rounded overflow-hidden"
                      >
                        <Image
                          src={src}
                          alt={`post-img-${i}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

              <div className="prose max-w-none">
                <h3>Description</h3>
                <p>{selectedGroup.post?.description || "—"}</p>
              </div>

              {selectedGroup.post?.tags &&
                selectedGroup.post.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium">Tags</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedGroup.post.tags.map((t, i) => (
                        <span key={i} className="badge badge-outline">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {selectedGroup.post?.link &&
                selectedGroup.post.link.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium">Links</h4>
                    <ul className="mt-2 list-disc list-inside">
                      {selectedGroup.post.link.map((l, i) => (
                        <li key={i}>
                          <a
                            className="link"
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {l.name || l.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedGroup.post?.file &&
                selectedGroup.post.file.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium">Files</h4>
                    <ul className="mt-2 list-inside list-disc">
                      {selectedGroup.post.file.map((f, i) => (
                        <li key={i}>
                          <a
                            className="link"
                            href={f.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {f.name || f.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="flex justify-end">
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    setShowViewPost(false);
                  }}
                >
                  Close
                </button>
              </div>
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

function PostForm({ onSaved }: { onSaved: () => void }) {
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
