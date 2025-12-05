"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserPlus, User, Lock, Mail, ChevronDown } from "lucide-react";

type UserRole = "GUEST" | "WAITER" | "ADMIN";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("GUEST");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-6 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ulliri</h1>
          <p className="text-zinc-300 text-sm">Restaurant Order System</p>
        </div>

        {/* Register Card */}
        <form
          onSubmit={handleRegister}
          className="frosted-glass bg-[rgba(255,255,255,0.1)] p-8 rounded-3xl space-y-6"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Create Account</h2>
            <p className="text-zinc-400 text-sm mt-1">Join us today</p>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">Full Name</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:ring-white/20"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:ring-white/20"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">Role</Label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-9 px-3 pr-10 rounded-md bg-white/5 border border-white/10 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-white/30 focus:ring-[3px] focus:ring-white/20"
                >
                  <option value="GUEST" className="bg-zinc-800">Guest</option>
                  <option value="WAITER" className="bg-zinc-800">Waiter</option>
                  <option value="ADMIN" className="bg-zinc-800">Admin</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:ring-white/20"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
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
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Create Account
              </span>
            )}
          </Button>

          {/* Login link */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-zinc-400 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

