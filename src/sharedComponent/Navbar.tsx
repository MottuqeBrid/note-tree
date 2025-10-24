"use client";
import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemToggle";
import Image from "next/image";
import { useEffect, useState } from "react";

type User = {
  email?: string;
  name?: string;
  role?: string;
  photo?: {
    profile?: string;
  };
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: "GET",
      credentials: "include", // very important
      cache: "no-store",
    });
    const data = await res.json();

    if (data.success) {
      setUser(data?.user);
    } else {
      setUser(null);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const authLink = user ? (
    <>
      <div className="btn btn-ghost btn-circle avatar ">
        <div className="w-10 rounded-full">
          <Image
            src={
              user?.photo?.profile ||
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={user?.name || "profile picture"}
            width={32}
            height={32}
          />
        </div>
      </div>
    </>
  ) : (
    <>
      <Link href="/login" className="btn btn-primary text-neutral">
        Login
      </Link>
      <Link href="/register" className="btn btn-secondary text-neutral">
        Register
      </Link>
    </>
  );
  const navLinks = (
    <>
      <li>
        <Link href="/" className="font-bold">
          Home
        </Link>
      </li>
      {user && (
        <>
          <li>
            <Link href="/dashboard" className="">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/group-note" className="">
              Group Note
            </Link>
          </li>
          <li>
            <Link href="/cover" className="">
              Cover Page
            </Link>
          </li>

          {user?.role === "admin" && (
            <li>
              <Link href="/admin" className="">
                Admin
              </Link>
            </li>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="shadow-sm w-full sticky top-0 z-50 bg-base-100/40  bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <nav className="navbar max-w-7xl mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navLinks}
            </ul>
          </div>
          <Logo />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>
        <div className="navbar-end">
          <div className="flex gap-2">
            {/* <ThemeToggle /> */}
            {authLink}
          </div>
        </div>
      </nav>
    </div>
  );
}
