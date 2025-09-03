"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

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

export default function Page() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchGroup = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/groups/get/${id}`,
        {
          credentials: "include",
          cache: "no-store",
          next: {
            revalidate: 10,
          },
        }
      );
      const data = await res.json();
      if (data?.success) {
        setGroup(data.group);
      } else setGroup(null);
    } catch (e) {
      console.error(e);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchGroup();
  }, [fetchGroup]);

  if (loading)
    return <div className="p-6 text-sm text-gray-500">Loading group...</div>;

  if (!group)
    return <div className="p-6 text-sm text-gray-500">Group not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-base-200 flex items-center justify-center">
            {group.thumbnail ? (
              <Image
                width={80}
                height={80}
                priority
                src={group.thumbnail}
                alt={group.name || "group"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-sm text-gray-500">No Image</div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{group.name || "Group"}</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              {group.description}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <span className="badge badge-outline">
                Members: {group.members?.length || 0}
              </span>
              <span className="badge badge-outline">
                Privacy: {group.privacy || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/group-note" className="btn btn-sm btn-ghost">
            Back
          </Link>
          <button
            className="btn btn-sm btn-error"
            onClick={async () => {
              try {
                const result = await Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Yes, leave it!",
                  cancelButtonText: "No, cancel!",
                });

                if (result.isConfirmed) {
                  // fallback: PATCH leave (backend may accept)
                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/groups/leave/${id}`,
                    {
                      method: "PATCH",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                    }
                  );
                  const data = await res.json();
                  if (data?.success) {
                    void fetchGroup();
                    Swal.fire(
                      "Left!",
                      data?.message || "You have left the group.",
                      "success"
                    );
                    router.push("/group-note");
                  } else {
                    Swal.fire(
                      "Error!",
                      "Could not leave group — try again later.",
                      "error"
                    );
                  }
                }
              } catch (err) {
                console.error(err);
                Swal.fire("Error!", "Unexpected error leaving group.", "error");
              }
            }}
          >
            Leave Group
          </button>
        </div>
      </div>

      <section className="mt-6">
        <h3 className="text-lg font-medium mb-2">Group Post</h3>
        {group.post ? (
          <article className="p-4 bg-base-300 rounded-lg shadow-sm border">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="lg:w-1/3 w-full">
                {group.post.image && group.post.image.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    {Array.from(new Set(group.post.image))
                      .slice(0, 4)
                      .map((src, i) => (
                        <a
                          key={src + `-${i}`}
                          href={src}
                          target="_blank"
                          rel="noreferrer"
                          className="block"
                        >
                          <Image
                            src={src}
                            alt={`img-${i}`}
                            width={600}
                            height={400}
                            priority
                            className="w-full h-36 sm:h-40 md:h-44 object-cover rounded"
                          />
                        </a>
                      ))}
                  </div>
                ) : (
                  <div className="h-28 sm:h-32 md:h-36 bg-base-200 rounded flex items-center justify-center text-sm text-gray-500">
                    No images
                  </div>
                )}
              </div>

              <div className="lg:flex-1 w-full">
                <h4 className="text-lg sm:text-xl font-semibold">
                  {group.post.title || "Untitled"}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  {group.post.description || ""}
                </p>

                {group.post.tags && group.post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from(new Set(group.post.tags)).map((t, idx) => (
                      <span key={t + `-${idx}`} className="badge badge-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    </div>
  );
}
