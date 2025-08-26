"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaTransgender,
  FaMapMarkerAlt,
  FaGlobe,
  FaBook,
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
  FaHeart,
  FaBackward,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Link from "next/link";

interface EditUserFormProps {
  id: string;
}

interface Photo {
  profile?: string;
  cover?: string;
}
interface Location {
  permanentAddress?: string;
  currentAddress?: string;
  country?: string;
}
interface Social {
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
}
interface Education {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
}
interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  phone?: string;
  photo?: Photo;
  isVerified: boolean;
  isDeleted: boolean;
  isPhoneVerified: boolean;
  gender: "male" | "female" | "other";
  bio?: string;
  location?: Location;
  social?: Social;
  hobbies?: string[];
  education?: Education;
}

// Helper type for social field paths for react-hook-form
type SocialFieldPath =
  | "social.facebook"
  | "social.twitter"
  | "social.instagram"
  | "social.github"
  | "social.linkedin"
  | "social.website"
  | "social.portfolio"
  | "social.youtube"
  | "social.tiktok"
  | "social.snapchat"
  | "social.reddit"
  | "social.quora";

export default function EditUserForm({ id }: EditUserFormProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      phone: "",
      photo: { profile: "", cover: "" },
      isVerified: false,
      isDeleted: false,
      isPhoneVerified: false,
      gender: "other",
      bio: "",
      location: {
        permanentAddress: "",
        currentAddress: "",
        country: "Bangladesh",
      },
      social: {},
      hobbies: [],
      education: {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: undefined,
        endYear: undefined,
      },
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/single/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        setValue("name", data.user.name);
        setValue("email", data.user.email);
        setValue("phone", data.user.phone || "");
        setValue("photo.profile", data.user.photo?.profile || "");
        setValue("photo.cover", data.user.photo?.cover || "");
        setValue("isVerified", data.user.isVerified);
        setValue("isDeleted", data.user.isDeleted);
        setValue("isPhoneVerified", data.user.isPhoneVerified);
        setValue("gender", data.user.gender || "other");
        setValue("bio", data.user.bio || "");
        setValue(
          "location.permanentAddress",
          data.user.location?.permanentAddress || ""
        );
        setValue(
          "location.currentAddress",
          data.user.location?.currentAddress || ""
        );
        setValue(
          "location.country",
          data.user.location?.country || "Bangladesh"
        );
        setValue("social.facebook", data.user.social?.facebook || "");
        setValue("social.twitter", data.user.social?.twitter || "");
        setValue("social.instagram", data.user.social?.instagram || "");
        setValue("social.github", data.user.social?.github || "");
        setValue("social.linkedin", data.user.social?.linkedin || "");
        setValue("social.website", data.user.social?.website || "");
        setValue("social.portfolio", data.user.social?.portfolio || "");
        setValue("social.youtube", data.user.social?.youtube || "");
        setValue("social.tiktok", data.user.social?.tiktok || "");
        setValue("social.snapchat", data.user.social?.snapchat || "");
        setValue("social.reddit", data.user.social?.reddit || "");
        setValue("social.quora", data.user.social?.quora || "");
        setValue("hobbies", data.user.hobbies || []);
        setValue(
          "education.institution",
          data.user.education?.institution || ""
        );
        setValue("education.degree", data.user.education?.degree || "");
        setValue(
          "education.fieldOfStudy",
          data.user.education?.fieldOfStudy || ""
        );
        setValue("education.startYear", data.user.education?.startYear);
        setValue("education.endYear", data.user.education?.endYear);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [id, setValue]);

  const onSubmit = async (data: User) => {
    // TODO: handle update logic
    console.log(data);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (result.success) {
      Swal.fire({
        title: "Success!",
        text: "User updated successfully",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: result.error || "Failed to update user",
        icon: "error",
      });
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user)
    return <div className="text-center py-10 text-red-500">User not found</div>;

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-base-100/80 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto space-y-10 border border-base-300"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/profile"
          className="text-secondary hover:underline flex items-center gap-1 mb-4"
        >
          <FaBackward />
          Back to Profile
        </Link>
        <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
          <FaUserShield className="text-blue-600" /> Edit User
        </h2>
      </div>
      <div className="space-y-12">
        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-lg border border-base-300 p-6 bg-gradient-to-br from-white via-base-100 to-base-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <FaUser className="text-primary" /> Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                Name
              </label>
              <div className="flex items-center gap-2">
                <FaUser className="opacity-70" />
                <input
                  type="text"
                  placeholder="Name"
                  className={`input input-bordered w-full ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.name.message as string}
                </span>
              )}
            </div>
            <div>
              <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                Email (read-only)
              </label>
              <div className="flex items-center gap-2">
                <FaEnvelope className="opacity-70" />
                <input
                  type="email"
                  readOnly
                  placeholder="Email"
                  className={`input input-bordered w-full bg-base-200/60 cursor-not-allowed ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  {...register("email", { required: "Email is required" })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                Gender
              </label>
              <div className="flex items-center gap-2">
                <FaTransgender className="opacity-70" />
                <select
                  className="input input-bordered w-full"
                  {...register("gender", { required: true })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                Phone
              </label>
              <div className="flex items-center gap-2">
                <FaPhone className="opacity-70" />
                <input
                  type="text"
                  placeholder="Phone"
                  className="input input-bordered w-full"
                  {...register("phone")}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                Bio
              </label>
              <div className="flex items-start gap-2">
                <FaBook className="opacity-70 mt-3" />
                <textarea
                  placeholder="Short bio..."
                  className="textarea textarea-bordered w-full min-h-[90px]"
                  {...register("bio")}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-lg border border-base-300 p-6 bg-gradient-to-br from-base-100 via-white to-base-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-secondary" /> Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-1">
              <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                Permanent
              </label>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="opacity-70" />
                <input
                  type="text"
                  placeholder="Permanent Address"
                  className="input input-bordered w-full"
                  {...register("location.permanentAddress")}
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                Current
              </label>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="opacity-70" />
                <input
                  type="text"
                  placeholder="Current Address"
                  className="input input-bordered w-full"
                  {...register("location.currentAddress")}
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                Country
              </label>
              <div className="flex items-center gap-2">
                <FaGlobe className="opacity-70" />
                <input
                  type="text"
                  placeholder="Country"
                  className="input input-bordered w-full"
                  {...register("location.country")}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-lg border border-base-300 p-6 bg-gradient-to-br from-white via-base-100 to-base-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <FaLink className="text-accent" /> Social Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <FaFacebook />, name: "facebook", label: "Facebook" },
              { icon: <FaTwitter />, name: "twitter", label: "Twitter" },
              { icon: <FaInstagram />, name: "instagram", label: "Instagram" },
              { icon: <FaGithub />, name: "github", label: "GitHub" },
              { icon: <FaLinkedin />, name: "linkedin", label: "LinkedIn" },
              { icon: <FaLink />, name: "website", label: "Website" },
              { icon: <FaLink />, name: "portfolio", label: "Portfolio" },
              { icon: <FaYoutube />, name: "youtube", label: "YouTube" },
              { icon: <FaTiktok />, name: "tiktok", label: "TikTok" },
              {
                icon: <FaSnapchatGhost />,
                name: "snapchat",
                label: "Snapchat",
              },
              { icon: <FaRedditAlien />, name: "reddit", label: "Reddit" },
              { icon: <FaQuora />, name: "quora", label: "Quora" },
            ].map((f) => {
              const path = `social.${f.name}` as SocialFieldPath;
              return (
                <label
                  key={f.name}
                  className="flex items-center gap-2 bg-base-200/40 px-2 py-1 rounded"
                >
                  <span className="text-base opacity-70">{f.icon}</span>
                  <input
                    type="text"
                    placeholder={f.label}
                    className="input input-bordered w-full h-9"
                    {...register(path as unknown as keyof User)}
                  />
                </label>
              );
            })}
          </div>
        </motion.div>

        {/* Hobbies & Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-lg border border-base-300 p-6 bg-gradient-to-br from-base-100 via-white to-base-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <FaHeart className="text-pink-500" /> Hobbies & Education
          </h3>
          <div className="space-y-6">
            <div>
              <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                Hobbies (comma separated)
              </label>
              <div className="flex items-center gap-2">
                <FaHeart className="opacity-70" />
                <input
                  type="text"
                  placeholder="e.g. Reading, Coding, Music"
                  className="input input-bordered w-full"
                  {...register("hobbies", {
                    setValueAs: (v) =>
                      typeof v === "string"
                        ? v
                            .split(",")
                            .map((h: string) => h.trim())
                            .filter(Boolean)
                        : Array.isArray(v)
                        ? v
                        : [],
                  })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="md:col-span-1">
                <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                  Institution
                </label>
                <div className="flex items-center gap-2">
                  <FaBook className="opacity-70" />
                  <input
                    type="text"
                    placeholder="Institution"
                    className="input input-bordered w-full"
                    {...register("education.institution")}
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                  Degree
                </label>
                <div className="flex items-center gap-2">
                  <FaBook className="opacity-70" />
                  <input
                    type="text"
                    placeholder="Degree"
                    className="input input-bordered w-full"
                    {...register("education.degree")}
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                  Field of Study
                </label>
                <div className="flex items-center gap-2">
                  <FaBook className="opacity-70" />
                  <input
                    type="text"
                    placeholder="Field of Study"
                    className="input input-bordered w-full"
                    {...register("education.fieldOfStudy")}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                  Start Year
                </label>
                <div className="flex items-center gap-2">
                  <FaBook className="opacity-70" />
                  <input
                    type="number"
                    placeholder="Start"
                    className="input input-bordered w-full"
                    {...register("education.startYear", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase font-medium tracking-wide mb-1 block">
                  End Year
                </label>
                <div className="flex items-center gap-2">
                  <FaBook className="opacity-70" />
                  <input
                    type="number"
                    placeholder="End"
                    className="input input-bordered w-full"
                    {...register("education.endYear", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium shadow hover:shadow-md transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : null}
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </motion.form>
  );
}
