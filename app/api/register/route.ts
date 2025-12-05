import { NextResponse } from "next/server";
import { mockUsers } from "@/app/mock-data/mockUser";

export async function POST(req: Request) {
  const { fullName, username, password, role } = await req.json();

  // Check if username already exists
  const existingUser = mockUsers.find((u) => u.username === username);
  if (existingUser) {
    return NextResponse.json(
      { message: "Username already taken" },
      { status: 400 }
    );
  }

  // Validate role
  const validRoles = ["GUEST", "WAITER", "ADMIN"];
  if (!validRoles.includes(role)) {
    return NextResponse.json(
      { message: "Invalid role" },
      { status: 400 }
    );
  }

  // Create new user (in real app, this would save to database)
  const newUser = {
    id: mockUsers.length + 1,
    username,
    password,
    role,
    fullName,
  };

  // Add to mock users array (note: this won't persist across server restarts)
  mockUsers.push(newUser);

  return NextResponse.json({
    message: "User created successfully",
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      role: newUser.role,
    },
  });
}

