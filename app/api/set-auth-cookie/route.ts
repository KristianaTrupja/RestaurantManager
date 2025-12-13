import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, user } = await req.json();

    if (!token || !user) {
      return NextResponse.json(
        { success: false, message: "Missing token or user data" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    };

    // Set auth cookies
    response.cookies.set("auth_token", token, cookieOptions);
    response.cookies.set("user_role", user.role, cookieOptions);
    response.cookies.set("user_id", String(user.id), cookieOptions);

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to set auth cookie" },
      { status: 500 }
    );
  }
}

