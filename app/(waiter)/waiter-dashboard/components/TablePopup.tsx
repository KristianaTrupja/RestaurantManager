"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import {
  clearOrders,
  markTableFree,
  markTableServed,
} from "@/app/store/slices/tableSlice";
import { generateBillPDF } from "@/app/utils/generateBillPDF";
import { Button } from "@/components/ui/button";
import { X, UtensilsCrossed, Check, Printer, Receipt } from "lucide-react";
import { toast } from "sonner";

export default function TablePopup() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);

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

  const statusColor = 
    table.status === "free" ? "bg-green-500/20 text-green-400" :
    table.status === "waiting" ? "bg-yellow-500/20 text-yellow-400" :
    table.status === "taken" ? "bg-blue-500/20 text-blue-400" :
    table.status === "served" ? "bg-purple-500/20 text-purple-400" :
    "bg-red-500/20 text-red-400";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Table {table.number}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor}`}>
                {table.status}
              </span>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Orders List */}
        <div className="p-5">
          {orders.length > 0 ? (
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1 custom-scrollbar-dark">
              {sortedRounds.map((round) => (
                <div key={round} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Round {round}
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <div className="space-y-2">
                    {groupedOrders[round].map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3"
                      >
                        <div>
                          <span className="text-white">{order.name}</span>
                          <span className="text-zinc-500 ml-2">x{order.quantity}</span>
                        </div>
                        <span className="font-medium text-white">
                          {currency}{(order.price * order.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-zinc-500" />
              </div>
              <p className="text-zinc-400">No orders yet</p>
              <p className="text-zinc-500 text-sm">Orders will appear here</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 space-y-4">
          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Subtotal</span>
              <span className="text-white">{currency}{table.totalPriceWithoutTVSH.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">TVSH</span>
              <span className="text-white">{currency}{table.tvsh.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-lg font-bold text-green-400">
                {currency}{table.totalPriceWithTVSH.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {orders.length > 0 && (
            <div className="flex gap-3">
              {table.status !== "served" && table.status !== "finished" ? (
                <Button
                  onClick={() => {
                    dispatch(markTableServed(table.id));
                    dispatch(closeModal());
                    toast.success("Table marked as served", {
                      description: "Stay updated for more orders from this table.",
                    });
                  }}
                  size="lg"
                  variant="purple"
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Served
                </Button>
              ) : (
                <Button disabled size="lg" variant="disabled" className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Served
                </Button>
              )}

              <Button
                onClick={() => {
                  generateBillPDF(table);
                  dispatch(clearOrders(table.id));
                  dispatch(markTableFree(table.id));
                  dispatch(closeModal());
                }}
                size="lg"
                variant="orange"
                className="flex-1"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Bill
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
