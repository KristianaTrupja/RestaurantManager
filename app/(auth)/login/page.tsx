"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("/api/mock-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      toast.error("Invalid username or password");
      setLoading(false);
      return;
    }

    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));

    switch (data.role) {
      case "GUEST":
        router.push(`/choose-table?guestId=${data.id}`);
        break;

      case "WAITER":
        router.push(
          `/waiter-dashboard?waiterId=${data.id}`
        );
        break;

      case "ADMIN":
        router.push("/inventory");
        break;

      default:
        toast.error("Unknown role");
    }
  } catch (error) {
    toast.error("Mock server error");
  }

  setLoading(false);
};



  return (
    <div className="flex justify-center items-center min-h-screen px-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <div>
          <Label>Username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
