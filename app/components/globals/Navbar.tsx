"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { selectCartCount } from "@/app/store/slices/cartSlice";
import { openModal } from "@/app/store/slices/modalSlice";
import { LogOut, ShoppingBag, Receipt, UtensilsCrossed, User, Shield, ChefHat, UserPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function NavBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const count = useAppSelector(selectCartCount);

  const [user, setUser] = useState<{ role: string; fullName: string } | null>(
    null
  );

  // Load user from localStorage (re-check on route changes)
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  if (!user) return null;

  const getRoleBadge = () => {
    const roleConfig = {
      GUEST: { icon: User, label: "Guest", color: "bg-green-500/20 text-green-400" },
      WAITER: { icon: ChefHat, label: "Waiter", color: "bg-blue-500/20 text-blue-400" },
      ADMIN: { icon: Shield, label: "Admin", color: "bg-purple-500/20 text-purple-400" },
    };
    const config = roleConfig[user.role as keyof typeof roleConfig];
    if (!config) return null;
    const Icon = config.icon;
    return (
      <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="frosted-glass bg-[rgba(30,30,30,0.85)] backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-purple-400" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-white leading-tight">Ulliri</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Order System</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role Badge */}
              {getRoleBadge()}

              {/* Guest Actions */}
              {user.role === "GUEST" && pathname === "/dashboard" && (
                <div className="flex items-center gap-1">
                  {/* Cart */}
                  <button
                    onClick={() => dispatch(openModal({ type: "cart" }))}
                    className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <ShoppingBag className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-lg">
                        {count}
                      </span>
                    )}
                  </button>

                  {/* Bill */}
                  <button
                    onClick={() => dispatch(openModal({ type: "bill", tableId: "4" }))}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <Receipt className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </button>
                </div>
              )}

              {/* Admin Actions */}
              {user.role === "ADMIN" && pathname === "/admin-dashboard" && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => dispatch(openModal({ type: "createUser" }))}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-colors group"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">Create User</span>
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block" />

              {/* User Info */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5">
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-zinc-300 max-w-24 truncate">{user.fullName}</span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
