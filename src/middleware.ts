import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Skip API route & public pages
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/about",
    "/contact",
    "/terms",
  ];

  const token = request.cookies.get("token")?.value;

  // If it's a public path and user is NOT logged in → just allow
  if (publicPaths.includes(pathname) && !token) {
    return NextResponse.next();
  }
  // If it's a public path and user is NOT logged in → just allow
  if (!publicPaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/middleware`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token};`,
        },
      }
    );

    const data = await response.json();

    if (data?.error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (data?.user) {
      const { role, isDeleted, deactivated, isbanned } = data.user;

      if (isbanned || deactivated || isDeleted) {
        if (isbanned) {
          return NextResponse.redirect(new URL("/ban", request.url));
        }

        if (deactivated) {
          return NextResponse.redirect(new URL("/deactivated", request.url));
        }
        if (isDeleted) {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }

      // Example: role-based restriction
      if (role === "user" || role === "admin" || role === "moderator") {
        if (pathname === "/admin" && role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.next();
      }
    }
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/about",
    "/contact",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/cover",
    "/group-note",
  ],
};
