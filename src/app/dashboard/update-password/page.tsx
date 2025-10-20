"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

type FormData = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

type PasswordStrength = {
  score: number;
  label: string;
  color: string;
  bgColor: string;
};

export default function UpdatePasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const passwordValue = watch("password");

  // Password strength calculator
  const passwordStrength = useMemo((): PasswordStrength => {
    if (!passwordValue) return { score: 0, label: "", color: "", bgColor: "" };

    let score = 0;
    if (passwordValue.length >= 8) score++;
    if (passwordValue.length >= 12) score++;
    if (/[a-z]/.test(passwordValue)) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/\d/.test(passwordValue)) score++;
    if (/[^a-zA-Z0-9]/.test(passwordValue)) score++;

    if (score <= 2)
      return { score, label: "Weak", color: "text-error", bgColor: "bg-error" };
    if (score <= 4)
      return {
        score,
        label: "Fair",
        color: "text-warning",
        bgColor: "bg-warning",
      };
    if (score <= 5)
      return { score, label: "Good", color: "text-info", bgColor: "bg-info" };
    return {
      score,
      label: "Strong",
      color: "text-success",
      bgColor: "bg-success",
    };
  }, [passwordValue]);

  // Password requirements
  const requirements = useMemo(
    () => [
      { test: (p: string) => p.length >= 6, label: "At least 6 characters" },
      {
        test: (p: string) => p.length >= 8,
        label: "8+ characters (recommended)",
      },
      { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter" },
      { test: (p: string) => /[a-z]/.test(p), label: "One lowercase letter" },
      { test: (p: string) => /\d/.test(p), label: "One number" },
      {
        test: (p: string) => /[^a-zA-Z0-9]/.test(p),
        label: "One special character",
      },
    ],
    []
  );

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/update-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: data.password }),
          credentials: "include",
        }
      );

      const resData = await res.json();

      if (resData.success) {
        await Swal.fire({
          title: "Success!",
          text: resData.message || "Password updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        reset();
        router.push("/dashboard");
      } else {
        Swal.fire({
          title: "Update Failed",
          text: resData.error || resData.message || "Failed to update password",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Password update failed", error);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-base-200 to-base-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-2xl bg-base-100 shadow-2xl"
      >
        <div className="card-body">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <FaLock className="text-2xl text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Update Password</h1>
              <p className="text-sm text-base-content/60">
                Keep your account secure
              </p>
            </div>
          </div>

          <div className="divider"></div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className={`input input-bordered w-full pr-10 transition-all ${
                    errors.password
                      ? "input-error"
                      : passwordValue
                      ? "input-success"
                      : ""
                  }`}
                  {...register("password", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors z-30"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <FaTimesCircle />
                    {errors.password.message}
                  </span>
                </label>
              )}

              {/* Password Strength Indicator */}
              {passwordValue && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/70">
                      Password strength:
                    </span>
                    <span className={`font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(passwordStrength.score / 6) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`h-full ${passwordStrength.bgColor} rounded-full`}
                    />
                  </div>

                  {/* Requirements checklist */}
                  <div className="mt-3 space-y-1.5">
                    {requirements.map((req, idx) => {
                      const met = req.test(passwordValue);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-center gap-2 text-xs ${
                            met ? "text-success" : "text-base-content/50"
                          }`}
                        >
                          {met ? (
                            <FaCheckCircle className="text-success" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border-2 border-base-content/30" />
                          )}
                          <span>{req.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Confirm New Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className={`input input-bordered w-full pr-10 transition-all ${
                    errors.confirmPassword
                      ? "input-error"
                      : passwordValue &&
                        watch("confirmPassword") === passwordValue
                      ? "input-success"
                      : ""
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors z-30"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <FaTimesCircle />
                    {errors.confirmPassword.message}
                  </span>
                </label>
              )}
              {!errors.confirmPassword &&
                passwordValue &&
                watch("confirmPassword") === passwordValue && (
                  <label className="label">
                    <span className="label-text-alt text-success flex items-center gap-1">
                      <FaCheckCircle />
                      Passwords match
                    </span>
                  </label>
                )}
            </div>

            <div className="divider"></div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                type="submit"
                className="btn btn-primary flex-1 text-neutral"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Update Password
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-ghost flex-1 sm:flex-initial"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Security tip */}
          <div className="alert alert-info mt-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div className="text-sm">
              <p className="font-semibold">Security Tip</p>
              <p className="text-xs opacity-80">
                Use a unique password with a mix of letters, numbers, and
                symbols. Consider using a password manager.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
