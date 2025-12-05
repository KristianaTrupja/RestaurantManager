import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which roles can access which routes
const roleRoutes: Record<string, string[]> = {
  GUEST: ["/dashboard", "/choose-table"],
  WAITER: ["/waiter-dashboard"],
  ADMIN: ["/inventory"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userRole = req.cookies.get("user_role")?.value;

  // Allow access to public pages and API routes
  if (pathname === "/login" || pathname === "/register" || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // If no role cookie, redirect to login
  if (!userRole) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Get allowed routes for this role
  const allowedRoutes = roleRoutes[userRole] || [];

  // Check if current path starts with any allowed route
  const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!isAllowed) {
    // Redirect to the user's default route based on role
    const defaultRoute = allowedRoutes[0] || "/login";
    return NextResponse.redirect(new URL(defaultRoute, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/waiter-dashboard/:path*", "/inventory/:path*", "/choose-table/:path*"],
};

