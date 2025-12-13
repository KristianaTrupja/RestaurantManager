"use client";

import { useState } from "react";
import { useGetTablesQuery } from "@/app/lib/api/tableApi";
import { useAppSelector } from "@/app/store/hooks";
import TableCard from "./components/TableCard";
import { Loader2, LayoutGrid, Filter, User, AlertCircle } from "lucide-react";

type FilterType = "all" | "mine" | "available" | "urgent";

export default function WaiterDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: tablesResponse, isLoading, error } = useGetTablesQuery(undefined, {
    // Poll every 10 seconds to keep data fresh
    pollingInterval: 10000,
  });
  const [filter, setFilter] = useState<FilterType>("all");

  const tables = tablesResponse?.data || [];

  // Filter tables based on selection
  const filteredTables = tables.filter((table) => {
    const status = table.status?.toLowerCase() || "free";
    
    switch (filter) {
      case "mine":
        return table.assignedWaiterId === user?.id;
      case "available":
        // Only truly free tables (not waiting, not taken)
        return status === "free";
      case "urgent":
        return status === "finished" || status === "served";
      default:
        return true;
    }
  });

  // Count tables by status
  const counts = {
    all: tables.length,
    mine: tables.filter((t) => t.assignedWaiterId === user?.id).length,
    available: tables.filter((t) => {
      const s = t.status?.toLowerCase();
      // Only truly free tables
      return s === "free";
    }).length,
    urgent: tables.filter((t) => {
      const s = t.status?.toLowerCase();
      return s === "finished" || s === "served";
    }).length,
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
      ? `Error ${error.status}`
      : 'Unknown error';
    return (
      <div className="container flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-400 mb-2">Failed to load tables</p>
          <p className="text-zinc-500 text-sm mb-2">Please try refreshing the page</p>
          <p className="text-xs text-zinc-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="container flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-zinc-400 mb-2">No tables available</p>
          <p className="text-zinc-500 text-sm">Please contact an administrator to add tables</p>
        </div>
      </div>
    );
  }

  const filterButtons: { key: FilterType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "all", label: "All Tables", icon: LayoutGrid },
    { key: "mine", label: "My Tables", icon: User },
    { key: "available", label: "Available", icon: Filter },
    { key: "urgent", label: "Needs Attention", icon: AlertCircle },
  ];

  return (
    <div className="container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tables Overview</h1>
          <p className="text-zinc-400 text-sm">
            {counts.mine > 0 && `${counts.mine} tables assigned to you • `}
            {counts.urgent > 0 && (
              <span className="text-orange-400">{counts.urgent} need attention</span>
            )}
            {counts.urgent === 0 && counts.available > 0 && (
              <span className="text-green-400">{counts.available} available</span>
            )}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterButtons.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${filter === key
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className={`
              px-1.5 py-0.5 rounded-full text-xs
              ${filter === key ? "bg-white/20" : "bg-white/10"}
            `}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      {filteredTables.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="w-8 h-8 text-zinc-500" />
          </div>
          <p className="text-zinc-400 mb-2">No tables match this filter</p>
          <button
            onClick={() => setFilter("all")}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            Show all tables
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTables.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-sm font-semibold text-zinc-400 mb-3">Status Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { color: "bg-green-500", label: "Available", desc: "Ready for guests" },
            { color: "bg-blue-500", label: "Occupied", desc: "Guests seated" },
            { color: "bg-purple-500", label: "Served", desc: "Food delivered" },
            { color: "bg-orange-500", label: "Bill Requested", desc: "Process payment" },
          ].map(({ color, label, desc }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <div>
                <p className="text-xs font-medium text-white">{label}</p>
                <p className="text-xs text-zinc-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
