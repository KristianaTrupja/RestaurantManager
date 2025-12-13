"use client";

import { useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import { useCreateUserMutation } from "@/app/lib/api/userApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus, X, User, Lock, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import type { UserRole } from "@/app/types";

export default function CreateUserModal() {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [createUser, { isLoading }] = useCreateUserMutation();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    role: "GUEST" as UserRole,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.fullName || !form.username || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await createUser({
        fullName: form.fullName,
        username: form.username,
        email: form.email || undefined,
        password: form.password,
        role: form.role,
      }).unwrap();

      if (result.success) {
        toast.success(`User "${form.fullName}" created successfully!`);
        dispatch(closeModal());
      } else {
        toast.error(result.message || "Failed to create user");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to create user");
    }
  };

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: "GUEST", label: "Guest", description: "Can browse menu and place orders" },
    { value: "WAITER", label: "Waiter", description: "Can manage tables and orders" },
    { value: "ADMIN", label: "Admin", description: "Full access to all features" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Create New User</h2>
              <p className="text-sm text-zinc-400">Add a new user account</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar-dark">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <User className="w-4 h-4" />
              Full Name *
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <User className="w-4 h-4" />
              Username *
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. johndoe"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <User className="w-4 h-4" />
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <Shield className="w-4 h-4" />
              Role *
            </label>
            <div className="grid gap-2">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                    ${form.role === role.value 
                      ? "bg-purple-500/20 border-purple-400/50" 
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                    border
                  `}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={form.role === role.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${form.role === role.value ? "border-purple-400" : "border-zinc-500"}
                  `}>
                    {form.role === role.value && (
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">{role.label}</span>
                    <p className="text-xs text-zinc-500">{role.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <Lock className="w-4 h-4" />
              Password *
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 4 characters"
                className="w-full p-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <Lock className="w-4 h-4" />
              Confirm Password *
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full p-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10">
          <Button
            variant="purple"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create User
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
