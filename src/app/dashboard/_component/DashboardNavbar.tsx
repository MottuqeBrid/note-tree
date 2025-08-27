"use client";
import Logo from "@/sharedComponent/Logo";
import ThemeToggle from "@/sharedComponent/ThemToggle";

import Link from "next/link";
import { useEffect, useState } from "react";
type User = {
  email?: string;
  name?: string;
  photo?: {
    profile?: string;
  };
};
export default function DashboardNavbar() {
  const [user, setUser] = useState<User | null>(null);

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
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  //   const authLink = user ? (
  //     <>
  //       <div className="btn btn-ghost btn-circle avatar">
  //         <div className="w-10 rounded-full">
  //           <Image
  //             src={
  //               user?.photo?.profile ||
  //               "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  //             }
  //             alt={user?.name || "profile picture"}
  //             width={32}
  //             height={32}
  //           />
  //         </div>
  //       </div>
  //     </>
  //   ) : (
  //     <>
  //       <Link href="/login" className="btn btn-primary text-neutral">
  //         Login
  //       </Link>
  //       <Link href="/register" className="btn btn-secondary text-neutral">
  //         Register
  //       </Link>
  //     </>
  //   );
  const navLinks = (
    <>
      <li>
        <Link href="/" className="">
          Home
        </Link>
      </li>
      <li>
        <Link href="/dashboard" className="">
          Dashboard
        </Link>
      </li>
      <li>
        <Link href="/dashboard/profile" className="">
          Profile
        </Link>
      </li>
      <li>
        <Link href="/dashboard/all-notes" className="">
          All Notes
        </Link>
      </li>
      <li>
        <Link href="/dashboard/add-note" className="">
          Add Note
        </Link>
      </li>
      <li>
        <Link href="/dashboard/image" className="">
          Image
        </Link>
      </li>
    </>
  );
  return (
    <div className="shadow-sm w-full sticky top-0 z-50 bg-base-100/70">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
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
        </div>
        <div className="navbar-center">
          <Logo />
        </div>
        <div className="navbar-end flex items-center gap-2">
          {/* <button className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />{" "}
            </svg>
          </button> */}
          {/* <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />{" "}
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button> */}
          <ThemeToggle />
          <button className="btn btn-primary text-neutral">Log Out</button>
        </div>
      </div>
    </div>
  );
}
