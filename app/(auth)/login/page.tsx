"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogIn, User, Lock } from "lucide-react";

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
          router.push(`/waiter-dashboard?waiterId=${data.id}`);
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
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ulliri</h1>
          <p className="text-zinc-300 text-sm">Restaurant Order System</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="frosted-glass bg-[rgba(255,255,255,0.1)] p-8 rounded-3xl space-y-6"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
            <p className="text-zinc-400 text-sm mt-1">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:ring-white/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:ring-white/20"
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="purple"
            size="lg"
            className="w-full mt-6"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </span>
            )}
          </Button>

          {/* Register link */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-zinc-400 text-sm">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Create one
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
