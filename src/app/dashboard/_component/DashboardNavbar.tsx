"use client";
import Logo from "@/sharedComponent/Logo";
import ThemeToggle from "@/sharedComponent/ThemToggle";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaHome,
  FaTachometerAlt,
  FaUser,
  FaStickyNote,
  FaPlus,
  FaImage,
  FaLock,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import Image from "next/image";

type User = {
  email?: string;
  name?: string;
  photo?: {
    profile?: string;
  };
};

type NavLinkItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};
export default function DashboardNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigationLinks: NavLinkItem[] = [
    { href: "/", label: "Home", icon: <FaHome /> },
    { href: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
    {
      href: "/dashboard/all-notes",
      label: "All Notes",
      icon: <FaStickyNote />,
    },
    { href: "/dashboard/add-note", label: "Add Note", icon: <FaPlus /> },
    { href: "/dashboard/image", label: "Image", icon: <FaImage /> },
    {
      href: "/dashboard/update-password",
      label: "Update Password",
      icon: <FaLock />,
    },
  ];

  const getUser = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();

    if (data.success) {
      setUser(data?.user);
    } else {
      setUser(null);
      router.push("/login");
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();

      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been successfully logged out",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: data.message || data.error || "Something went wrong",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href) && href !== "/";
  };

  return (
    <div className="w-full sticky top-0 z-50 bg-base-100/95 backdrop-blur-md border-b border-base-300">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle hover:bg-primary/10"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="Open menu"
            >
              <FaBars className="h-5 w-5" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-64 p-2 shadow-xl border border-base-300"
            >
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${
                      isActiveLink(link.href)
                        ? "bg-primary text-white font-semibold"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <div className="divider my-1"></div>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-error/10 hover:text-error transition-all w-full text-left"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="navbar-center">
          <Logo />
        </div>

        <div className="navbar-end flex items-center gap-2">
          {/* User Profile Avatar */}
          {user && (
            <div className="dropdown dropdown-end hidden sm:block">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
              >
                <div className="w-10 rounded-full">
                  {user?.photo?.profile ? (
                    <Image
                      src={user.photo.profile}
                      alt={user?.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-56 p-2 shadow-xl border border-base-300"
              >
                <li className="menu-title px-4 py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-base-content">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-base-content/60">
                      {user?.email}
                    </span>
                  </div>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2"
                  >
                    <FaUser />
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/update-password"
                    className="flex items-center gap-2"
                  >
                    <FaLock />
                    <span>Change Password</span>
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-error hover:bg-error/10"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="btn btn-primary btn-sm text-neutral gap-2 hidden lg:flex"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
