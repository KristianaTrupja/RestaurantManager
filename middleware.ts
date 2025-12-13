import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which roles can access which routes
const roleRoutes: Record<string, string[]> = {
  GUEST: ["/dashboard", "/choose-table"],
  WAITER: ["/waiter-dashboard"],
  ADMIN: ["/admin-dashboard"],
};

// Public routes that don't require authentication
const publicRoutes = ["/login", "/", "/api"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check for auth token in cookie
  const authToken = req.cookies.get("auth_token")?.value;
  const userRole = req.cookies.get("user_role")?.value;

  // Allow access to public pages and API routes
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith("/api")
  );
  
  if (isPublicRoute) {
    // If user is logged in and tries to access login page, redirect to their dashboard
    if (pathname === "/login" && authToken && userRole) {
      const defaultRoute = roleRoutes[userRole]?.[0] || "/login";
      return NextResponse.redirect(new URL(defaultRoute, req.url));
    }
    return NextResponse.next();
  }

  // If no token or role, redirect to login
  if (!authToken || !userRole) {
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
  matcher: [
    "/login",
    "/dashboard/:path*", 
    "/waiter-dashboard/:path*", 
    "/admin-dashboard/:path*", 
    "/choose-table/:path*"
  ],
};
