import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  
  // Clear all auth cookies
  response.cookies.delete("auth_token");
  response.cookies.delete("user_role");
  
  return response;
}

