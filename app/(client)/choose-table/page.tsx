"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";

export default function ChooseTablePage() {
  const router = useRouter();
  const params = useSearchParams();
  const guestId = params.get("guestId");

  const handleSelectTable = (tableId: number) => {
    router.push(`/dashboard?tableId=${tableId}&guestId=${guestId}`);
  };

  const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="container">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
          <UtensilsCrossed className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Choose Your Table</h1>
        <p className="text-zinc-400">Select a table to start ordering</p>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map((tableNum) => (
          <button
            key={tableNum}
            onClick={() => handleSelectTable(tableNum)}
            className="group relative p-6 flex flex-col items-center justify-center aspect-square rounded-2xl 
                       frosted-glass bg-[rgba(255,255,255,0.07)] 
                       hover:bg-[rgba(255,255,255,0.15)] hover:scale-105
                       shadow-md hover:shadow-xl 
                       transition-all duration-300 cursor-pointer"
          >
            {/* Table Number */}
            <span className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
              {tableNum}
            </span>
            <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
              Table
            </span>

            {/* Hover indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Info text */}
      <p className="text-center text-zinc-500 text-sm mt-8">
        Tap on a table to view the menu and place your order
      </p>
    </div>
  );
}
