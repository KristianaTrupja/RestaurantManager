"use client";

import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import { markTableFinished } from "@/app/store/slices/tableSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BillModal() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);

  if (!modal.isOpen || modal.type !== "bill") return null;

  const tableId = modal.tableId;
  const table = useAppSelector((state) =>
    tableId ? state.tables.list.find((t) => t.id === tableId) : undefined
  );

  if (!table)
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white/70 p-8 rounded-2xl w-11/12 max-w-md shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Current Bill</h2>
          <p className="text-gray-500">Loading table information...</p>
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            onClick={() => dispatch(closeModal())}
          >
            ✕
          </button>
        </div>
      </div>
    );

  // Group orders by round
  const ordersByRound = table.orders.reduce(
    (acc: Record<number, typeof table.orders>, order) => {
      if (!acc[order.round]) acc[order.round] = [];
      acc[order.round].push(order);
      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 sm:p-8 rounded-3xl w-11/12 max-w-lg shadow-2xl relative">
        <h2 className="text-2xl font-bold mb-6">
          Bill for Table {table.number}
        </h2>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
          onClick={() => dispatch(closeModal())}
        >
          ✕
        </button>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {Object.keys(ordersByRound).length === 0 && (
            <p className="text-gray-500 text-center">No orders yet.</p>
          )}

          {Object.keys(ordersByRound).map((round) => (
            <div key={round} className="border-b pb-3">
              <h3 className="font-semibold text-lg mb-2 text-gray-700">
                Round {round}
              </h3>
              <div className="space-y-1">
                {ordersByRound[parseInt(round)].map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                  >
                    <span className="text-gray-800">
                      {order.name}{" "}
                      <span className="text-gray-500">x{order.quantity}</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      {order.total.toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between items-center font-bold text-gray-800 text-lg">
          <span>Total (with TVSH):</span>
          <span>{table.totalPriceWithTVSH.toFixed(2)}€</span>
        </div>
        <Button
          variant="orange"
          className="mt-2"
          onClick={() => {
            dispatch(markTableFinished(tableId));
            dispatch(closeModal());
            toast.success("Request sent to waiter", {
              description: "The waiter has been notified to bring the bill.",
            });
          }}
        >
          Print the bill
        </Button>
      </div>
    </div>
  );
}
