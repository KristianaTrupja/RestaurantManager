"use client";

import { useRouter } from "next/navigation";
import { UtensilsCrossed, Loader2, Users } from "lucide-react";
import { useGetTablesQuery } from "@/app/lib/api/tableApi";
import { useStartSessionMutation } from "@/app/lib/api/sessionApi";
import { useAppSelector } from "@/app/store/hooks";
import { toast } from "sonner";
import type { Table } from "@/app/types";

// Helper to get table number (backend might return 'number' or 'tableNumber')
const getTableNumber = (table: Table): number | string => {
  return table.tableNumber ?? table.number ?? "?";
};

export default function ChooseTablePage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  
  // Use regular tables endpoint and filter for free tables on frontend
  // (workaround for backend /tables/free endpoint error)
  const { data: tablesResponse, isLoading, error } = useGetTablesQuery();
  const [startSession, { isLoading: isStartingSession }] = useStartSessionMutation();

  // Filter for free tables only
  const allTables = tablesResponse?.data || [];
  const tables = allTables.filter(table => {
    const status = table.status?.toLowerCase();
    return status === "free" || status === "available";
  });

  const handleSelectTable = async (table: Table) => {
    const tableNum = getTableNumber(table);
    
    try {
      const result = await startSession({
        tableId: table.id,
        guestId: user?.id,
      }).unwrap();

      if (result.success && result.data) {
        toast.success(`Table ${tableNum} selected! You can now start ordering.`);
        router.push(`/dashboard?tableId=${table.id}&sessionId=${result.data.id}&tableNumber=${tableNum}`);
      } else {
        toast.error(result.message || "Failed to select table");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to select table");
    }
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    const errorMessage = 'status' in error 
      ? `Error ${error.status}: ${JSON.stringify(error.data)}`
      : error.message || 'Unknown error';
    
    console.error("Failed to load tables:", error);
    
    return (
      <div className="container flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-400 mb-2">Failed to load tables</p>
          <p className="text-zinc-500 text-sm mb-4">Please try refreshing the page</p>
          <p className="text-xs text-zinc-600 max-w-md break-all">{errorMessage}</p>
        </div>
      </div>
    );
  }

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

      {tables.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-2">No tables available at the moment</p>
          <p className="text-zinc-500 text-sm">Please wait for a table to become free</p>
        </div>
      ) : (
        <>
          {/* Tables Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map((table) => {
              const tableNum = getTableNumber(table);
              
              return (
                <button
                  key={table.id}
                  onClick={() => handleSelectTable(table)}
                  disabled={isStartingSession}
                  className="group relative p-6 flex flex-col items-center justify-center aspect-square rounded-2xl 
                           frosted-glass bg-[rgba(255,255,255,0.07)] 
                           hover:bg-[rgba(255,255,255,0.15)] hover:scale-105
                           shadow-md hover:shadow-xl 
                           transition-all duration-300 cursor-pointer
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Table Number */}
                  <span className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                    {tableNum}
                  </span>
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    Table
                  </span>

                  {/* Capacity indicator */}
                  {table.capacity && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-zinc-500">
                      <Users className="w-3 h-3" />
                      <span>{table.capacity}</span>
                    </div>
                  )}

                  {/* Location badge */}
                  {table.location && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-zinc-500 capitalize">
                      {table.location}
                    </div>
                  )}

                  {/* Hover indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>

          {/* Info text */}
          <p className="text-center text-zinc-500 text-sm mt-8">
            Tap on a table to view the menu and place your order
          </p>
        </>
      )}
    </div>
  );
}
