import { useAppDispatch } from "@/app/store/hooks";
import { openModal } from "@/app/store/slices/modalSlice";
import {
  markTableTaken,
  markTableWaiting,
} from "@/app/store/slices/tableSlice";
import { Table } from "@/app/types/Table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, UserCheck, Clock, CheckCircle, Receipt } from "lucide-react";

export default function TableCard({ table }: { table: Table }) {
  const dispatch = useAppDispatch();

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
      label: "Taken",
    },
    served: {
      color: "from-purple-500/20 to-purple-600/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      bgColor: "bg-purple-500",
      icon: CheckCircle,
      label: "Served",
    },
    finished: {
      color: "from-red-500/20 to-red-600/10",
      borderColor: "border-red-500/30",
      textColor: "text-red-400",
      bgColor: "bg-red-500",
      icon: Receipt,
      label: "Bill Requested",
    },
  };

  const config = statusConfig[table.status as keyof typeof statusConfig] || statusConfig.free;
  const StatusIcon = config.icon;

  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-2xl cursor-pointer
        frosted-glass bg-[rgba(30,30,30,0.6)]
        border ${config.borderColor}
        transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20
      `}
      onClick={() => dispatch(openModal({ type: "table", tableId: table.id }))}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-linear-to-br ${config.color} opacity-50`} />

      {/* Content */}
      <div className="relative p-4 sm:p-5 flex flex-col items-center text-center">
        {/* Status Icon */}
        <div className={`w-12 h-12 rounded-xl ${config.bgColor}/20 flex items-center justify-center mb-3`}>
          <StatusIcon className={`w-6 h-6 ${config.textColor}`} />
        </div>

        {/* Table Number */}
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          {table.number}
        </h3>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Table</p>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor}/20 ${config.textColor} border ${config.borderColor}`}>
          {config.label}
        </div>

        {/* Assigned Waiter */}
        {table.assignedWaiter && table.status !== "waiting" && table.status !== "free" && (
          <p className="mt-3 text-xs text-zinc-400 flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            {table.assignedWaiter}
          </p>
        )}

        {/* Order Count */}
        {table.orders && table.orders.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
            <span className="px-2 py-0.5 rounded-full bg-white/10">
              {table.orders.length} {table.orders.length === 1 ? "order" : "orders"}
            </span>
            <span className="font-medium text-green-400">
              €{table.totalPriceWithTVSH?.toFixed(2) || "0.00"}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 w-full">
          {table.status === "free" && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(markTableWaiting(table.id));
                toast.success("Table marked as waiting", {
                  description: "You can now assign this table to yourself.",
                });
              }}
              variant="outgreen"
              size="sm"
              className="w-full"
            >
              <Clock className="w-4 h-4 mr-1" />
              Mark Waiting
            </Button>
          )}

          {table.status === "waiting" && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(markTableTaken(table.id));
                toast.success("Table assigned to you", {
                  description: "Other waiters will see this table is taken.",
                });
              }}
              variant="outyellow"
              size="sm"
              className="w-full"
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Assign to Me
            </Button>
          )}

          {table.status === "taken" && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(markTableWaiting(table.id));
                toast.success("Table unassigned", {
                  description: "Any waiter can now pick up this table.",
                });
              }}
              variant="outblue"
              size="sm"
              className="w-full"
            >
              <Users className="w-4 h-4 mr-1" />
              Unassign
            </Button>
          )}

          {(table.status === "served" || table.status === "finished") && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
              }}
              variant="purple"
              size="sm"
              className="w-full opacity-80"
            >
              <Receipt className="w-4 h-4 mr-1" />
              View Details
            </Button>
          )}
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className={`absolute inset-0 ${config.bgColor}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
    </div>
  );
}
