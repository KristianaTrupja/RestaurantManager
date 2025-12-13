import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out", success: true });

  // Clear all auth cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0, // Expire immediately
  };

  response.cookies.set("auth_token", "", cookieOptions);
  response.cookies.set("user_role", "", cookieOptions);
  response.cookies.set("user_id", "", cookieOptions);

  return response;
}
