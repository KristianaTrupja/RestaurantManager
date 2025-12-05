import { NextResponse } from "next/server";
import { mockUsers } from "@/app/mock-data/mockUser";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    id: user.id,
    fullName: user.fullName,
    role: user.role,
  });

  // Set cookie with user role for middleware authorization
  response.cookies.set("user_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  response.cookies.set("user_id", String(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}
