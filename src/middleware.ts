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

  // prefer forwarding the full Cookie header (safer across domains/origins)
  const cookieHeader = request.headers.get("cookie") || "";
  // primary attempt using NextRequest cookie helper
  let token =
    request.cookies.get("token")?.value ||
    request.cookies.get("auth_token")?.value;
  console.log("Token:", token);
  // Fallback: parse raw Cookie header if request.cookies is empty on certain Edge runtimes
  if (!token && cookieHeader) {
    const m =
      cookieHeader.match(/(?:^|; )token=([^;]+)/) ||
      cookieHeader.match(/(?:^|; )auth_token=([^;]+)/);
    if (m) token = decodeURIComponent(m[1]);
  }

  // Fallback: Authorization header (Bearer token)
  if (!token) {
    const auth =
      request.headers.get("authorization") ||
      request.headers.get("Authorization");
    if (auth && auth.startsWith("Bearer ")) {
      token = auth.slice(7).trim();
    }
  }

  // If it's a public path and user is NOT logged in → just allow
  if (publicPaths.includes(pathname) && !token) {
    return NextResponse.next();
  }
  // If it's a public path and user is NOT logged in → just allow
  if (!publicPaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // fallback to the current origin when NEXT_PUBLIC_API_URL isn't provided
    const apiBase = process.env.NEXT_PUBLIC_API_URL || request.nextUrl.origin;
    const res = await fetch(`${apiBase}/users/middleware`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // forward whatever cookies were included on the incoming request
        Cookie: cookieHeader,
      },
    });
    console.log("Middleware response status:", await res.json());
    // If the upstream is unavailable (network error or non-2xx), don't hard-fail the app on Vercel.
    if (!res.ok) {
      console.error(
        "Middleware upstream returned non-ok:",
        res.status,
        res.statusText
      );
      // fail-open: allow the request rather than blocking all traffic
      return NextResponse.next();
    }

    const data = await res.json().catch((e) => {
      console.error("Failed to parse middleware response JSON", e);
      return null;
    });

    if (!data) return NextResponse.next();

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

      // Role-based allowance — keep existing behavior
      if (role === "user" || role === "admin" || role === "moderator") {
        // keep admin path open for admins
        if (pathname === "/admin" && role === "admin") {
          return NextResponse.next();
        } else if (pathname.startsWith("/admin") && role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // keep moderator path open for moderators
        if (
          pathname === "/moderator" &&
          (role === "admin" || role === "moderator")
        ) {
          return NextResponse.next();
        } else if (pathname.startsWith("/moderator") && role === "user") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
      }
    }
  } catch (error) {
    // don't bubble errors to the user; log and allow the request so Vercel Edge doesn't block traffic
    console.error("Error in middleware (allowing request):", error);
    return NextResponse.next();
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
    "/group-note/:path*",
    "/note/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/deactivated",
    "/ban",
    "/terms",
    "/privacy",
  ],
};
