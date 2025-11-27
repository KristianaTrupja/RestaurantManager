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

  return NextResponse.json({
    id: user.id,
    fullName: user.fullName,
    role: user.role,
  });
}
