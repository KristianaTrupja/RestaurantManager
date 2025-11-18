import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { markTableTaken } from "@/app/store/slices/tableSlice";
import { Table } from "@/app/types/Table";

export default function TableCard({ table }: { table: Table }) {
  const dispatch = useAppDispatch();

  return (
    <div
      key={table.id}
      className={`p-4 overflow-hidden rounded backdrop-blur-xs bg-[rgba(255,255,255,0.05)] text-white shadow-[0_0_2px_rgba(255,255,255,0.4)] ${
        table.status === "free"
          ? "b-green-200/30"
          : table.status === "taken"
          ? "b-yellow-200/30"
          : "b-gray-200/30"
      }`}
    >
      <h3 className="font-semibold">Table {table.number}</h3>
      <p>Status: {table.status}</p>
      {table.status === "free" && (
        <button
          onClick={() => dispatch(markTableTaken(table.id))}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
        >
          Mark as Taken
        </button>
      )}
    </div>
  );
}
