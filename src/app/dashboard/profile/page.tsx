"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  FaEnvelope,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaCamera,
  FaPen,
} from "react-icons/fa";
// Simple Modal component
function Modal({
  open,
  onClose,
  onUpload,
  label,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  label: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<File | null>(null);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xs flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4">Upload {label}</h3>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="mb-4"
          onChange={(e) => setSelected(e.target.files?.[0] || null)}
        />
        <div className="flex gap-2">
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!selected}
            onClick={() => selected && onUpload(selected)}
          >
            Upload
          </button>
          <button
            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
import { format } from "date-fns";
import { motion } from "framer-motion";
import { uploadFile } from "../../../../lib/uploadFile";
import Link from "next/link";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  photo?: {
    profile?: string;
    cover?: string;
  };
};

export default function ProfilePage() {
  const [coverModal, setCoverModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const uploadImage = async (file: File, type: "cp" | "pp") => {
    try {
      const data = await uploadFile(file);
      console.log(data);
      if (data.success) {
        // Update user photo in state
        const updatedUser = { ...user, photo: { ...user?.photo } };
        if (type === "cp") {
          updatedUser.photo.cover = data.file.url;
        } else {
          updatedUser.photo.profile = data.file.url;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedUser),
        });
        const userData = await res.json();
        if (!userData.success) {
          console.error("Failed to update user:", userData.error);
          return;
        }
        fetchUser();
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">No user data found</p>;
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cover Photo with upload btn */}
      <motion.div
        className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {user.photo?.cover ? (
          <Image
            width={400}
            height={400}
            src={user.photo.cover}
            alt="Cover Photo"
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="w-full h-full -z-10"
            priority
          />
        ) : (
          <div className="w-full h-full -z-10 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Cover Photo</span>
          </div>
        )}
        {/* Facebook-like camera btn */}
        <button
          className="absolute right-4 bottom-4 z-20 bg-white bg-opacity-80 rounded-full p-2 shadow transition hover:bg-accent hover:text-white hover:bg-opacity-100 focus:outline-none"
          onClick={() => setCoverModal(true)}
          aria-label="Upload Cover1 Photo"
          type="button"
        >
          <FaCamera className="text-xl" />
        </button>
      </motion.div>

      {/* Profile Info with upload btn */}
      <motion.div
        className="flex items-center z-40 gap-4 -mt-0 px-6"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <Image
            src={
              user?.photo?.profile ||
              "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="Profile Photo"
            priority
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-md"
          />
          {/* Facebook-like camera btn */}
          <button
            className="absolute right-0 bottom-0 bg-white bg-opacity-80 rounded-full p-2 shadow transition hover:bg-accent hover:text-white hover:bg-opacity-100 focus:outline-none"
            onClick={() => setProfileModal(true)}
            aria-label="Upload Profile Photo"
          >
            <FaCamera className="text-lg text-gray-700" />
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaUserShield className="text-blue-600" /> {user.name}
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <FaEnvelope className="text-gray-400" /> {user.email}
          </p>
          <span className="text-sm py-1 rounded-full flex items-center gap-1">
            <FaUserShield className="text-gray-500" /> {user.role}
          </span>
          <Link
            href={`/dashboard/profile/${user._id}`}
            className="btn btn-xs bg-primary mt-2 text-natural hover:bg-primary-focus"
          >
            <FaPen /> Update Profile
          </Link>
        </div>
      </motion.div>

      {/* Extra Details */}
      <motion.div
        className="mt-6 bg-white shadow rounded-xl p-6 space-y-2"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-2">Details</h2>
        <p>
          <strong>Phone:</strong> {user.phone || "Not provided"}
        </p>
        <p className="flex items-center gap-2">
          <strong>Verified:</strong>
          {user.isVerified ? (
            <span className="flex items-center text-green-600">
              <FaCheckCircle className="mr-1" /> Yes
            </span>
          ) : (
            <span className="flex items-center text-red-500">
              <FaTimesCircle className="mr-1" /> No
            </span>
          )}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {format(new Date(user.createdAt), "PPP p")}
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {format(new Date(user.updatedAt), "PPP p")}
        </p>
      </motion.div>
      {/* Modals for uploading */}
      <Modal
        open={coverModal}
        onClose={() => setCoverModal(false)}
        onUpload={(file) => {
          // TODO: handle cover photo upload
          setCoverModal(false);
          uploadImage(file, "cp");
        }}
        label="Cover Photo"
      />
      <Modal
        open={profileModal}
        onClose={() => setProfileModal(false)}
        onUpload={(file) => {
          // TODO: handle profile photo upload
          uploadImage(file, "pp");
          setProfileModal(false);
        }}
        label="Profile Photo"
      />
    </motion.div>
  );
}
