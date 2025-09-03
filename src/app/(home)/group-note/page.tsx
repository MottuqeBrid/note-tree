"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Post = {
  title?: string;
  description?: string;
  image?: string[];
  tags?: string[];
};

type Group = {
  _id: string;
  name?: string;
  description?: string;
  thumbnail?: string;
  members?: string[];
  post?: Post;
};

export default function GroupNotePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/groups`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );
        const data = await res.json();
        if (data.success) {
          console.log(data);
          setGroups(data.groups || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void fetchGroups();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Group Notes</h1>
        <p className="text-sm text-gray-500">
          Browse public groups and their latest posts.
        </p>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">Loading groups...</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g, i) => (
          <div
            key={i}
            className="border rounded-md p-4 bg-base-100 hover:shadow-md transition"
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-md bg-base-200 overflow-hidden flex items-center justify-center">
                {g.thumbnail ? (
                  <Image
                    src={g.thumbnail}
                    alt={g.name || "group"}
                    width={80}
                    height={80}
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="text-xs text-gray-500 px-2">No image</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{g.name}</h3>
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
                  <Link href={`/group-note/${g._id}`} className="btn btn-xs">
                    View
                  </Link>
                </div>
                {g.post?.title && (
                  <div className="mt-3 text-[12px] text-gray-600">
                    <div className="font-medium">Latest: {g.post.title}</div>
                    <div className="text-[11px] text-gray-400">
                      {g.post?.description
                        ? g.post.description.slice(0, 80) +
                          (g.post.description.length > 80 ? "..." : "")
                        : ""}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
