"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { selectCartCount } from "@/app/store/slices/cartSlice";
import { openModal } from "@/app/store/slices/modalSlice";
import { Dock, LogOut, ShoppingBag, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function NavBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const count = useAppSelector(selectCartCount);

  const [user, setUser] = useState<{ role: string; fullName: string } | null>(
    null
  );

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null; // Don’t render Navbar if user is not logged in

  return (
    <div className="z-10 py-5 px-10 frosted-glass bg-[rgba(255,255,255,0.2)] md:w-1/2 rounded-b-3xl m-auto flex items-center justify-between">
      <h3>Ulliri Order System</h3>

      <div className="actions flex items-center gap-4">
        {/* USER NAME */}
        <div className="flex gap-1 text-zinc-200">
          <UserRound width={20} />
          <h3>{user.fullName}</h3>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="p-2 w-fit h-fit rounded-md bg-zinc-600/80 hover:bg-zinc-600/95 active:bg-zinc-700/80 shadow-[0_0_1px_rgba(255,255,255,.5)] transition-colors"
        >
          <LogOut width={20} />
        </button>

        {/* ONLY SHOW THESE ON GUEST DASHBOARD */}
        {user.role === "GUEST" && pathname === "/dashboard" && (
          <>
            {/* CART ICON */}
            <div
              className="relative cursor-pointer"
              onClick={() => dispatch(openModal({ type: "cart" }))}
            >
              <ShoppingBag />

              {count > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow"
                >
                  {count}
                </span>
              )}
            </div>

            {/* BILL ICON */}
            <div
              className="cursor-pointer"
              onClick={() =>
                dispatch(openModal({ type: "bill", tableId: "4" }))
              }
            >
              <Dock />
            </div>
          </>
        )}

        {/* WAITER SPECIFIC */}
        {user.role === "WAITER" && pathname === "/waiter-dashboard" && (
          <span className="text-zinc-200">Waiter Mode</span>
        )}

        {/* ADMIN SPECIFIC */}
        {user.role === "ADMIN" && pathname === "/inventory" && (
          <span className="text-zinc-200">Admin Panel</span>
        )}
      </div>
    </div>
  );
}
