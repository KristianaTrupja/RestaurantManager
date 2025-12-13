"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { openModal } from "@/app/store/slices/modalSlice";
import { useAssignWaiterMutation } from "@/app/lib/api/tableApi";
import { Table } from "@/app/types/Table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, UserCheck, Clock, CheckCircle, Receipt, Loader2, AlertCircle } from "lucide-react";

interface TableCardProps {
  table: Table;
}

// Helper to get table number (backend might return 'number' or 'tableNumber')
const getTableNumber = (table: Table): number | string => {
  return table.tableNumber ?? table.number ?? "?";
};

export default function TableCard({ table }: TableCardProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [assignWaiter, { isLoading }] = useAssignWaiterMutation();

  // Normalize status to lowercase for comparison
  const status = (table.status?.toLowerCase() || "free") as 
    "free" | "waiting" | "taken" | "served" | "requesting_bill" | "finished";

  const statusConfig = {
    free: {
      color: "from-green-500/20 to-green-600/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-400",
      bgColor: "bg-green-500",
      icon: Users,
      label: "Available",
    },
    waiting: {
      color: "from-yellow-500/20 to-yellow-600/10",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-400",
      bgColor: "bg-yellow-500",
      icon: Clock,
      label: "Waiting",
    },
    taken: {
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      bgColor: "bg-blue-500",
      icon: UserCheck,
      label: "Occupied",
    },
    served: {
      color: "from-purple-500/20 to-purple-600/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      bgColor: "bg-purple-500",
      icon: CheckCircle,
      label: "Served",
    },
    requesting_bill: {
      color: "from-orange-500/20 to-orange-600/10",
      borderColor: "border-orange-500/30",
      textColor: "text-orange-400",
      bgColor: "bg-orange-500",
      icon: Receipt,
      label: "Bill Requested",
    },
    finished: {
      color: "from-gray-500/20 to-gray-600/10",
      borderColor: "border-gray-500/30",
      textColor: "text-gray-400",
      bgColor: "bg-gray-500",
      icon: CheckCircle,
      label: "Finished",
    },
  };

  const config = statusConfig[status] || statusConfig.free;
  const StatusIcon = config.icon;

  // Check if this table is assigned to current waiter
  const isAssignedToMe = table.assignedWaiterId === user?.id;

  const handleAssignToMe = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Just assign waiter, status is already "taken" from guest selecting table
      await assignWaiter({ id: table.id, waiterId: user?.id }).unwrap();
      toast.success("Table assigned to you", {
        description: "You are now serving this table.",
      });
    } catch (error) {
      console.error("Assign error:", error);
      toast.error("Failed to assign table");
    }
  };

  const handleUnassign = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Just unassign waiter, keep status as taken (guests are still there)
      await assignWaiter({ id: table.id, waiterId: undefined }).unwrap();
      toast.success("Table unassigned", {
        description: "Another waiter can now pick up this table.",
      });
    } catch (error) {
      console.error("Unassign error:", error);
      toast.error("Failed to unassign table");
    }
  };

  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-2xl cursor-pointer
        frosted-glass bg-[rgba(30,30,30,0.6)]
        border ${config.borderColor}
        transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20
        ${isLoading ? "opacity-75 pointer-events-none" : ""}
      `}
      onClick={() => dispatch(openModal({ type: "table", tableId: table.id }))}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      )}

      {/* Urgent indicator for finished tables */}
      {status === "finished" && (
        <div className="absolute top-2 right-2 z-10">
          <AlertCircle className="w-5 h-5 text-orange-400 animate-pulse" />
        </div>
      )}

      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-50`} />

      {/* Content */}
      <div className="relative p-4 sm:p-5 flex flex-col items-center text-center">
        {/* Status Icon */}
        <div className={`w-12 h-12 rounded-xl ${config.bgColor}/20 flex items-center justify-center mb-3`}>
          <StatusIcon className={`w-6 h-6 ${config.textColor}`} />
        </div>

        {/* Table Number */}
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          {getTableNumber(table)}
        </h3>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Table</p>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor}/20 ${config.textColor} border ${config.borderColor}`}>
          {config.label}
        </div>

        {/* Capacity */}
        {table.capacity && (
          <div className="mt-2 flex items-center gap-1 text-xs text-zinc-400">
            <Users className="w-3 h-3" />
            <span>{table.capacity} seats</span>
          </div>
        )}

        {/* Assigned Waiter */}
        {table.assignedWaiter && status !== "waiting" && status !== "free" && (
          <p className={`mt-2 text-xs flex items-center gap-1 ${isAssignedToMe ? "text-green-400" : "text-zinc-400"}`}>
            <UserCheck className="w-3 h-3" />
            {isAssignedToMe ? "You" : table.assignedWaiter}
          </p>
        )}

        {/* Location */}
        {table.location && (
          <p className="mt-1 text-xs text-zinc-500 capitalize">
            {table.location}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-4 w-full">
          {/* Free tables - no action needed, waiting for guests */}
          {status === "free" && (
            <div className="text-xs text-zinc-500 text-center py-2">
              Waiting for guests
            </div>
          )}

          {/* Waiting tables (legacy) - can assign to self */}
          {status === "waiting" && (
            <Button
              onClick={handleAssignToMe}
              variant="outyellow"
              size="sm"
              className="w-full"
              disabled={isLoading}
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Assign to Me
            </Button>
          )}

          {/* Taken tables without waiter - can assign to self */}
          {status === "taken" && !table.assignedWaiterId && (
            <Button
              onClick={handleAssignToMe}
              variant="outyellow"
              size="sm"
              className="w-full"
              disabled={isLoading}
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Assign to Me
            </Button>
          )}

          {/* Taken tables assigned to me - can unassign */}
          {status === "taken" && isAssignedToMe && (
            <Button
              onClick={handleUnassign}
              variant="outblue"
              size="sm"
              className="w-full"
              disabled={isLoading}
            >
              <Users className="w-4 h-4 mr-1" />
              Unassign
            </Button>
          )}

          {/* Taken tables assigned to someone else */}
          {status === "taken" && table.assignedWaiterId && !isAssignedToMe && (
            <Button
              variant="disabled"
              size="sm"
              className="w-full"
              disabled
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Assigned
            </Button>
          )}

          {/* Served or finished tables */}
          {(status === "served" || status === "finished") && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(openModal({ type: "table", tableId: table.id }));
              }}
              variant={status === "finished" ? "orange" : "purple"}
              size="sm"
              className="w-full"
            >
              <Receipt className="w-4 h-4 mr-1" />
              {status === "finished" ? "Process Bill" : "View Details"}
            </Button>
          )}
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className={`absolute inset-0 ${config.bgColor}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
    </div>
  );
}
