"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 👉 আপনার backend API থেকে user ডেটা আনবেন
    // Example: GET http://localhost:5000/api/users/me
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          credentials: "include", // যদি cookie/token দরকার হয়
        });
        const data = await res.json();
        console.log(data.user);
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">No user data found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Cover Photo */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
        {user.photo?.cover ? (
          <Image
            src={user.photo.cover}
            width={400}
            height={400}
            alt="Cover Photo"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Cover Photo</span>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex items-center z-40 gap-4 mt-[-3rem] px-6">
        <Image
          src={user.photo?.profile}
          alt="Profile Photo"
          width={100}
          height={100}
          className="rounded-full border-4 border-white shadow-md"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <span className="text-sm px-2 py-1 bg-gray-200 rounded-full">
            {user.role}
          </span>
        </div>
      </div>

      {/* Extra Details */}
      <div className="mt-6 bg-white shadow rounded-xl p-6 space-y-2">
        <h2 className="text-xl font-semibold">Details</h2>
        <p>
          <strong>Phone:</strong> {user.phone || "Not provided"}
        </p>
        <p>
          <strong>Verified:</strong> {user.isVerified ? "✅ Yes" : "❌ No"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
