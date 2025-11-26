"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import { clearOrders, markTableFree, markTableServed } from "@/app/store/slices/tableSlice";
import { generateBillPDF } from "@/app/utils/generateBillPDF";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function TablePopup() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);

  // Pull live table data (source of truth)
  const table = useAppSelector((state) =>
    state.tables.list.find((t) => t.id === modal.tableId)
  );

  if (!modal.isOpen || !table) return null;

  const orders = table.orders;
  const currency = table.currency ?? "€";

  // Group orders by round
  const groupedOrders = orders.reduce(
    (group: Record<string, typeof orders>, order) => {
      const key = order.round.toString();
      if (!group[key]) group[key] = [];
      group[key].push(order);
      return group;
    },
    {}
  );

  const sortedRounds = Object.keys(groupedOrders).sort(
    (a, b) => Number(a) - Number(b)
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative w-[90%] max-w-md p-6 pr-3 rounded-2xl shadow-xl bg-white/70 backdrop-blur-xl border border-white/40 animate-scaleIn">
        {/* Close Icon */}
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-4 right-4 text-gray-700 hover:text-black transition-transform hover:scale-110"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-5">
          Table {table.number}
        </h2>

        {/* Orders List */}
        <div className="mb-6 max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar">
          {orders.length > 0 ? (
            <div className="space-y-5 pr-3">
              {sortedRounds.map((round) => (
                <div key={round}>
                  <h4 className="flex items-center font-semibold uppercase text-[10px] text-gray-700 mb-2">
                    <span>Round {round}</span>
                    <div className="w-4/5 h-[1px] rounded-full overflow-hidden bg-white/10 ml-4">
                      <div className="h-full rounded-full bg-gray-500/40"></div>
                    </div>
                  </h4>

                  <ul className="space-y-2">
                    {groupedOrders[round].map((order) => (
                      <li
                        key={order.id}
                        className="flex justify-between text-sm bg-white/60 px-3 py-2 rounded-lg shadow-sm"
                      >
                        <span className="font-medium">
                          {order.name}{" "}
                          <span className="text-gray-600">
                            x{order.quantity}
                          </span>
                        </span>

                        <span className="font-semibold">
                          {(order.price * order.quantity).toFixed(2)}
                          {currency}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 italic bg-white/60 p-3 rounded-lg shadow-sm">
              No orders yet.
            </p>
          )}
        </div>

        {/* Totals */}
        <div className="px-6 text-right space-y-1">
          <div className="font-semibold text-sm">
            Subtotal: {table.totalPriceWithoutTVSH.toFixed(2)}
            {currency}
          </div>

          <div className="font-semibold text-sm">
            TVSH: {table.tvsh.toFixed(2)}
            {currency}
          </div>

          <div className="font-bold text-lg">
            Total: {table.totalPriceWithTVSH.toFixed(2)}
            {currency}
          </div>
        </div>

        {/* Buttons */}
        {orders.length > 0 && (
          <div className="flex justify-between gap-3 mt-4">
            {table.status !== "served" && table.status != "finished" ? (
              <Button
                onClick={() => {
                  dispatch(markTableServed(table.id));
                  dispatch(closeModal());
                }}
                size="lg"
                variant="purple"
              >
                Mark as Served
              </Button>
            ) : (
              <Button disabled size="lg" variant="disabled">
                Already Served
              </Button>
            )}

            <Button
              onClick={() => {
                generateBillPDF(table); // 1) Print PDF
                dispatch(clearOrders(table.id)); // 2) Clear orders
                dispatch(markTableFree(table.id)); // 3) Free the table
                dispatch(closeModal()); // 4) Close modal
              }}
              size="lg"
              variant="orange"
            >
              Print Bill
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
