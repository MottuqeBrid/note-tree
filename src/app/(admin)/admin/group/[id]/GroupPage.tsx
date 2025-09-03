"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type Post = {
  image?: string[];
  tags?: string[];
  title?: string;
  description?: string;
  createdAt?: string;
  link?: { name?: string; url?: string }[];
  file?: { name?: string; url?: string }[];
};

type Group = {
  _id: string;
  name?: string;
  description?: string;
  members?: string[];
  thumbnail?: string;
  post?: Post;
  privacy?: string;
};

export default function GroupPage({ id }: { id: string }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const fetchGroup = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/groups/get/${id}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );
      const data = await response.json();
      if (data?.success) setGroup(data.group);
      else setGroup(null);
    } catch (e) {
      console.error(e);
      setGroup(null);
    }
  }, [id]);

  useEffect(() => {
    void fetchGroup();
  }, [fetchGroup]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-base-200 flex items-center justify-center">
            {group?.thumbnail ? (
              <Image
                width={80}
                height={80}
                src={group.thumbnail}
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-sm text-gray-500">No Image</div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{group?.name || "Group"}</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              {group?.description}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <span className="badge badge-outline">
                Members: {group?.members?.length || 0}
              </span>
              <span className="badge badge-outline">
                Privacy: {group?.privacy || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-primary text-neutral"
            onClick={() => setShowPostModal(true)}
          >
            {group?.post ? "Edit Post" : "Create Post"}
          </button>
        </div>
      </div>

      <section className="mt-6">
        <h3 className="text-lg font-medium mb-2">Group Post</h3>
        {group?.post ? (
          <article className="p-4 bg-base-300 rounded-lg shadow-sm border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3">
                {group.post.image && group.post.image.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {group.post.image.slice(0, 4).map((src, i) => (
                      <a
                        key={i}
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                      >
                        <Image
                          src={src}
                          alt={`img-${i}`}
                          width={300}
                          height={200}
                          className="w-full h-28 object-cover rounded"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="h-28 bg-base-200 rounded flex items-center justify-center text-sm text-gray-500">
                    No images
                  </div>
                )}
              </div>

              <div className="md:flex-1">
                <h4 className="text-xl font-semibold">
                  {group.post.title || "Untitled"}
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  {group.post.description || ""}
                </p>

                {group.post.tags && group.post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.post.tags.map((t, idx) => (
                      <span key={idx} className="badge badge-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Links</div>
                    <ul className="list-disc list-inside mt-2">
                      {group.post.link?.map((l, i) => (
                        <li key={i}>
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="link"
                          >
                            {l.name || l.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Files</div>
                    <ul className="list-disc list-inside mt-2">
                      {group.post.file?.map((f, i) => (
                        <li key={i}>
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noreferrer"
                            className="link"
                          >
                            {f.name || f.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <div className="text-sm text-gray-500">No post yet.</div>
        )}
      </section>

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 overflow-auto max-h-[80vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {group?.post ? "Edit Post" : "Create Post"}
              </h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowPostModal(false)}
              >
                Close
              </button>
            </div>

            <PostForm
              groupId={id}
              existing={group?.post}
              onSaved={() => {
                setShowPostModal(false);
                void fetchGroup();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PostForm({
  groupId,
  existing,
  onSaved,
}: {
  groupId: string;
  existing?: Post;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [image, setImage] = useState<string[]>(
    existing?.image ? [...existing.image] : []
  );
  const [file, setFile] = useState<{ name?: string; url?: string }[]>(
    existing?.file ? [...existing.file] : []
  );
  const [links, setLinks] = useState<{ name?: string; url?: string }[]>(
    (existing?.link || []).map((l) => ({ name: l.name, url: l.url }))
  );
  const [tags, setTags] = useState<string[]>(
    existing?.tags ? [...existing.tags] : []
  );
  const [saving, setSaving] = useState(false);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("");

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImage((s) => [...s, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };
  const removeImage = (idx: number) =>
    setImage((s) => s.filter((_, i) => i !== idx));

  const addFile = () => {
    if (newFileUrl.trim()) {
      setFile((s) => [
        ...s,
        { name: newFileName || undefined, url: newFileUrl.trim() },
      ]);
      setNewFileName("");
      setNewFileUrl("");
    }
  };
  const removeFile = (idx: number) =>
    setFile((s) => s.filter((_, i) => i !== idx));

  const addLink = () => setLinks((s) => [...s, { name: "", url: "" }]);
  const updateLink = (idx: number, key: "name" | "url", value: string) =>
    setLinks((s) => s.map((l, i) => (i === idx ? { ...l, [key]: value } : l)));
  const removeLink = (idx: number) =>
    setLinks((s) => s.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        post: { title, description, image, file, tags, link: links },
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/groups/update/${groupId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      await res.json();
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
        <span className="label-text">Title</span>
      </label>
      <input
        className="input input-bordered w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="label mt-3">
        <span className="label-text">Description</span>
      </label>
      <textarea
        className="textarea textarea-bordered w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Images</h4>
          <div className="flex items-center gap-2">
            <input
              className="input input-sm input-bordered"
              placeholder="image url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <button className="btn btn-sm" type="button" onClick={addImage}>
              Add
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {image.map((src, i) => (
            <div
              key={i}
              className="bg-base-200 rounded px-2 py-1 text-xs flex items-center gap-2"
            >
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                className="underline truncate max-w-[200px]"
              >
                {src}
              </a>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => removeImage(i)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Files</h4>
          <div className="flex items-center gap-2">
            <input
              className="input input-sm input-bordered"
              placeholder="file name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
            <input
              className="input input-sm input-bordered"
              placeholder="file url"
              value={newFileUrl}
              onChange={(e) => setNewFileUrl(e.target.value)}
            />
            <button className="btn btn-sm" type="button" onClick={addFile}>
              Add
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {file.map((f, i) => (
            <div key={i} className="flex items-center justify-between">
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm link"
              >
                {f.name || f.url}
              </a>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => removeFile(i)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Links</h4>
          <button className="btn btn-xs" type="button" onClick={addLink}>
            Add Link
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {links.map((l, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input input-sm input-bordered w-1/3"
                placeholder="name"
                value={l.name}
                onChange={(e) => updateLink(i, "name", e.target.value)}
              />
              <input
                className="input input-sm input-bordered flex-1"
                placeholder="url"
                value={l.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
              />
              <button
                className="btn btn-xs btn-ghost"
                type="button"
                onClick={() => removeLink(i)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <label className="label">
          <span className="label-text">Tags (comma-separated)</span>
        </label>
        <input
          className="input input-bordered w-full"
          value={tags.join(",")}
          onChange={(e) =>
            setTags(
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          className="btn btn-sm btn-ghost"
          type="button"
          onClick={onSaved}
        >
          Cancel
        </button>
        <button
          className="btn btn-sm btn-primary text-neutral"
          type="button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Post"}
        </button>
      </div>
    </div>
  );
}
