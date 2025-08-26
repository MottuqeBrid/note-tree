"use client";

import { useEffect, useState, useRef, Fragment } from "react";
import Image from "next/image";
import {
  FaEnvelope,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaCamera,
  FaPen,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaLink,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaRedditAlien,
  FaQuora,
  FaPhone,
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

type Photo = {
  profile?: string;
  cover?: string;
};
type Location = {
  permanentAddress?: string;
  currentAddress?: string;
  country?: string;
};
type Social = {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  portfolio?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
  reddit?: string;
  quora?: string;
};
type Education = {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
};
type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  isVerified: boolean;
  isDeleted: boolean;
  isPhoneVerified: boolean;
  gender: "male" | "female" | "other";
  bio?: string;
  location?: Location;
  social?: Social;
  hobbies?: string[];
  education?: Education;
  createdAt: string;
  updatedAt: string;
  photo?: Photo;
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
      console.log(data.user);
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
    // Simple skeleton loader
    return (
      <div className="max-w-3xl mx-auto p-6 animate-pulse space-y-6">
        <div className="h-48 w-full rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300" />
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-200 to-gray-300" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-40 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <p className="text-center mt-10">No user data found</p>;
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cover Photo with upload btn */}
      <motion.div
        className="relative w-full h-60 rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5 group"
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
          className="absolute right-4 bottom-4 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow transition hover:bg-primary hover:text-white focus:outline-none"
          onClick={() => setCoverModal(true)}
          aria-label="Upload Cover1 Photo"
          type="button"
        >
          <FaCamera className="text-xl" />
        </button>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition" />
      </motion.div>

      {/* Profile Info with upload btn */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center z-40 gap-6 px-2 sm:px-6"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative shrink-0">
          <Image
            src={
              user?.photo?.profile ||
              "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="Profile Photo"
            priority
            width={130}
            height={130}
            className="rounded-full border-4 border-white shadow-xl -top-4 relative object-cover w-32 h-32"
          />
          {/* Facebook-like camera btn */}
          <button
            className="absolute right-1 bottom-1 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow transition hover:bg-primary hover:text-white focus:outline-none"
            onClick={() => setProfileModal(true)}
            aria-label="Upload Profile Photo"
          >
            <FaCamera className="text-lg text-gray-700" />
          </button>
        </div>
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
            <FaUserShield className="text-primary" /> {user.name}
            {user.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full border border-green-400/30">
                <FaCheckCircle /> Verified
              </span>
            )}
          </h1>
          <p className="text-gray-600 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <FaEnvelope className="text-gray-400" /> {user.email}
            </span>
            {user.phone && (
              <span className="flex items-center gap-1">
                <FaPhone className="text-emerald-500" /> {user.phone}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-xs uppercase tracking-wide bg-blue-500/10 text-blue-600 px-2 py-1 rounded border border-blue-400/30 flex items-center gap-1">
              <FaUserShield /> {user.role}
            </span>
            <span
              className={`text-xs uppercase tracking-wide px-2 py-1 rounded border flex items-center gap-1 ${
                user.isPhoneVerified
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-400/30"
                  : "bg-red-500/10 text-red-600 border-red-400/30"
              }`}
            >
              {user.isPhoneVerified ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
              Phone
            </span>
          </div>
          <Link
            href={`/dashboard/profile/${user._id}`}
            className="inline-flex items-center gap-2 text-sm mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white shadow hover:shadow-md transition"
          >
            <FaPen /> Update Profile
          </Link>
        </div>
      </motion.div>
      {/* Details Grid */}
      <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Personal / Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl p-5 bg-base-200 border border-base-300 shadow-sm flex flex-col"
        >
          <h3 className="font-semibold text-base mb-3 tracking-wide">About</h3>
          <dl className="space-y-2 text-sm flex-1">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Gender :</dt>
              <dd className="font-medium capitalize">{user.gender}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Phone :</dt>
              <dd className="font-medium">{user.phone || "-"}</dd>
            </div>
            <div>
              <dt className="text-gray-500 mb-1">Bio :</dt>
              <dd className=" text-sm leading-relaxed line-clamp-5 whitespace-pre-line">
                {user.bio || "No bio provided."}
              </dd>
            </div>
          </dl>
        </motion.div>
        {/* Address */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl p-5 bg-base-200 border border-base-300 shadow-sm"
        >
          <h3 className="font-semibold text-base mb-3 tracking-wide">
            Address
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="text-gray-500">Permanent:</span>{" "}
              <span className="font-medium">
                {user.location?.permanentAddress || "-"}
              </span>
            </li>
            <li>
              <span className="text-gray-500">Current:</span>{" "}
              <span className="font-medium">
                {user.location?.currentAddress || "-"}
              </span>
            </li>
            <li>
              <span className="text-gray-500">Country:</span>{" "}
              <span className="font-medium">
                {user.location?.country || "-"}
              </span>
            </li>
          </ul>
        </motion.div>
        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl p-5 bg-base-200 border border-base-300 shadow-sm"
        >
          <h3 className="font-semibold text-base mb-3 tracking-wide">
            Education
          </h3>
          {user.education ? (
            <ul className="text-sm space-y-1">
              <li>
                <span className="text-gray-500">Institution:</span>{" "}
                <span className="font-medium">
                  {user.education.institution || "-"}
                </span>
              </li>
              <li>
                <span className="text-gray-500">Degree:</span>{" "}
                <span className="font-medium">
                  {user.education.degree || "-"}
                </span>
              </li>
              <li>
                <span className="text-gray-500">Field:</span>{" "}
                <span className="font-medium">
                  {user.education.fieldOfStudy || "-"}
                </span>
              </li>
              <li>
                <span className="text-gray-500">Years:</span>{" "}
                <span className="font-medium">
                  {user.education.startYear || "-"} –{" "}
                  {user.education.endYear || "-"}
                </span>
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No education data.</p>
          )}
        </motion.div>
        {/* Hobbies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="rounded-2xl p-5 bg-base-200 border border-base-300 shadow-sm"
        >
          <h3 className="font-semibold text-base mb-3 tracking-wide">
            Hobbies
          </h3>
          {user.hobbies && user.hobbies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.hobbies.map((h) => (
                <span
                  key={h}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30"
                >
                  {h}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hobbies specified.</p>
          )}
        </motion.div>
        {/* Status & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl p-5 bg-base-200 border border-base-300 shadow-sm"
        >
          <h3 className="font-semibold text-base mb-3 tracking-wide">Status</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              {user.isVerified ? (
                <span className="flex items-center gap-1 text-green-600">
                  <FaCheckCircle /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <FaTimesCircle /> Not Verified
                </span>
              )}
            </li>
            <li className="flex items-center gap-2">
              {user.isPhoneVerified ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <FaCheckCircle /> Phone Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <FaTimesCircle /> Phone Not Verified
                </span>
              )}
            </li>
            <li>
              <span className="text-gray-500">Created:</span>{" "}
              <span className="font-medium">
                {format(new Date(user.createdAt), "PPP p")}
              </span>
            </li>
            <li>
              <span className="text-gray-500">Updated:</span>{" "}
              <span className="font-medium">
                {format(new Date(user.updatedAt), "PPP p")}
              </span>
            </li>
          </ul>
        </motion.div>
        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-2xl p-5 bg-base-200 border border-base-300 shadow-sm"
        >
          <h3 className="font-semibold text-base mb-3 tracking-wide">Social</h3>
          <div className="flex flex-wrap gap-4 items-center">
            {user.social &&
            Object.entries(user.social).filter(([, v]) => v).length > 0 ? (
              <Fragment>
                {[
                  {
                    key: "facebook",
                    Icon: FaFacebook,
                    className: "text-blue-600 hover:text-blue-800",
                  },
                  {
                    key: "twitter",
                    Icon: FaTwitter,
                    className: "text-sky-500 hover:text-sky-700",
                  },
                  {
                    key: "instagram",
                    Icon: FaInstagram,
                    className: "text-pink-500 hover:text-pink-700",
                  },
                  {
                    key: "github",
                    Icon: FaGithub,
                    className: "text-gray-800 hover:text-black",
                  },
                  {
                    key: "linkedin",
                    Icon: FaLinkedin,
                    className: "text-blue-700 hover:text-blue-900",
                  },
                  {
                    key: "website",
                    Icon: FaLink,
                    className: "text-gray-600 hover:text-black",
                  },
                  {
                    key: "portfolio",
                    Icon: FaLink,
                    className: "text-gray-600 hover:text-black",
                  },
                  {
                    key: "youtube",
                    Icon: FaYoutube,
                    className: "text-red-600 hover:text-red-800",
                  },
                  {
                    key: "tiktok",
                    Icon: FaTiktok,
                    className: "text-black hover:text-gray-700",
                  },
                  {
                    key: "snapchat",
                    Icon: FaSnapchatGhost,
                    className: "text-yellow-500 hover:text-yellow-700",
                  },
                  {
                    key: "reddit",
                    Icon: FaRedditAlien,
                    className: "text-orange-600 hover:text-orange-800",
                  },
                  {
                    key: "quora",
                    Icon: FaQuora,
                    className: "text-red-700 hover:text-red-900",
                  },
                ].map(({ key, Icon, className }) => {
                  const social = user.social as Record<
                    string,
                    string | undefined
                  >;
                  const href = social[key];
                  if (!href) return null;
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${className} text-2xl transition`}
                      title={key.charAt(0).toUpperCase() + key.slice(1)}
                    >
                      <Icon />
                    </a>
                  );
                })}
              </Fragment>
            ) : (
              <span className="text-gray-500 text-sm">No social links</span>
            )}
          </div>
        </motion.div>
      </div>
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
