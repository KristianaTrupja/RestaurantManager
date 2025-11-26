"use client";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { selectCartCount } from "@/app/store/slices/cartSlice";
import { openModal } from "@/app/store/slices/modalSlice";
import { Dock, LogOut, ShoppingBag, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

export function NavBar() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCartCount);
  const pathname = usePathname();
  return (
    <div className="z-10 py-5 px-10 frosted-glass bg-[rgba(255,255,255,0.2)] md:w-1/2 rounded-b-3xl m-auto flex items-center justify-between">
      <h3>Ulliri Order System</h3>
      <div className="actions flex items-center gap-4">
        <div className="flex gap-1 text-zinc-200">
          <UserRound width={20} />
          <h3>Kristiana Trupja</h3>
        </div>
        <button className="p-2 w-fit h-fit rounded-md bg-zinc-600/80 hover:bg-zinc-600/95 active:bg-zinc-700/80 shadow-[0_0_1px_rgba(255,255,255,.5)] transition-colors">
          <LogOut width={20} />
        </button>
        {pathname === "/dashboard" && (
          <>
            <div
              className="relative cursor-pointer"
              onClick={() => dispatch(openModal({ type: "cart" }))}
            >
              {/* Cart Icon */}
              <ShoppingBag />

              {/* Badge */}
              {count > 0 && (
                <span
                  className="
          absolute -top-2 -right-2 
          bg-red-500 
          text-white 
          text-xs 
          font-bold 
          rounded-full 
          w-5 h-5 
          flex items-center justify-center 
          shadow
        "
                >
                  {count}
                </span>
              )}
            </div>
            <div
              className="cursor-pointer relative"
              onClick={() => dispatch(openModal({ type: "bill" , tableId: "4"}))}
            >
              <Dock />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
