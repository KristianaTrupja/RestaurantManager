import { useAppDispatch } from "@/app/store/hooks";
import { openModal } from "@/app/store/slices/modalSlice";
import { markTableTaken } from "@/app/store/slices/tableSlice";
import { Table } from "@/app/types/Table";
import { Button } from "@/components/ui/button";

export default function TableCard({ table }: { table: Table }) {
  const dispatch = useAppDispatch();

  const statusColor =
    table.status === "free"
      ? "bg-green-500"
      : table.status === "waiting"
      ? "bg-yellow-400"
      : table.status === "taken"
      ? "bg-blue-500"
      : table.status === "served"
      ? "bg-purple-500"
      : "bg-gray-300";

  return (
    <div
      className="relative p-4 flex flex-col items-center justify-center aspect-square rounded-xl frosted-glass z-50 hover:bg-[rgba(255,255,255,0.06)] hover:scale-103
                 bg-[rgba(255,255,255,0.07)] shadow-md hover:shadow-lg transition cursor-pointer"
      onClick={() =>
        dispatch(
          openModal({
            title: "Mark table as taken?",
            content: "Are you sure you want to mark this table?",
            onConfirm: () => dispatch(markTableTaken(table.id)),
          })
        )
      }
    >
      {/* Status Circle */}
      {(table.assignedWaiter === "Kristiana Trupja") && <div
        className={`absolute top-3 right-3 w-3 h-3 rounded-full border border-white/40 ${statusColor}`}
      ></div>}
  

      {/* Table Number */}
      <h3 className="text-xl font-semibold mb-1">Table {table.number}</h3>

      {/* Status Text */}
      <p className="text-sm opacity-70 capitalize mb-2">{table.status}</p>

      {/* Assigned Waiter */}
      {table.assignedWaiter && (
        <p className="text-xs opacity-70 italic mb-2">
          Waiter: {table.assignedWaiter}
        </p>
      )}

      {/* Progress Bar / Status Line */}
      <div className="absolute bottom-10 w-3/5 h-2 rounded-full overflow-hidden bg-white/20">
        <div className={`h-full rounded-full ${statusColor}`}></div>
      </div>

      {/* Button when waiting */}
      {table.status === "waiting" && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(markTableTaken(table.id));
          }}
          variant="outyellow"
          size="sm"
          className="mt-2"
        >
          Mark as Taken
        </Button>
      )}
    </div>
  );
}
