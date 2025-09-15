"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // ✅ required for cookies
      });

      const resData = await res.json();

      if (resData.success) {
        // Set token in cookies if returned from backend
        if (resData.token) {
          Cookies.set("auth_token", resData.token, { expires: 30, path: "/" });
        }
        Swal.fire({
          title: "Login Successful",
          text: "Welcome back to NoteTree!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/"); // redirect to dashboard/home
        });
      } else {
        Swal.fire({
          title: "Login Failed",
          text: resData.message || resData.error || "Invalid credentials.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Login Error",
        text:
          typeof error === "object" && error !== null
            ? "message" in error
              ? (error as { message?: string }).message
              : "error" in error
              ? (error as { error?: string }).error
              : "An unexpected error occurred."
            : "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Login failed", error);
    }
  };

  return (
    <section className="hero p-0 bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8">
        {/* Left Info */}
        <div className="text-center lg:text-left max-w-md">
          <Image
            src="/login.png"
            alt="Login Illustration"
            className="drop-shadow-accent"
            width={500}
            height={500}
          />
        </div>

        {/* Login Card */}
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <div className="card-body">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-center">Login Now!</h2>
                <p className="py-6 opacity-70">
                  Access your NoteTree account and continue managing your notes
                  securely.
                </p>
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
