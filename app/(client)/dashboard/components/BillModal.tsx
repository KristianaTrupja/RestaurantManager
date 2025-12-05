"use client";

import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import { markTableFinished } from "@/app/store/slices/tableSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Receipt, X, Printer } from "lucide-react";

export default function BillModal() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);
  const tableId = modal.tableId;
  const table = useAppSelector((state) =>
    tableId ? state.tables.list.find((t) => t.id === tableId) : undefined
  );

  if (!modal.isOpen || modal.type !== "bill") return null;

  if (!table)
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Receipt className="w-6 h-6 text-zinc-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Bill</h2>
          <p className="text-zinc-400">Loading table information...</p>
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

  const hasOrders = Object.keys(ordersByRound).length > 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Your Bill</h2>
              <p className="text-sm text-zinc-400">Table {table.number}</p>
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
          {!hasOrders ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-zinc-500" />
              </div>
              <p className="text-zinc-400">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar-dark">
              {Object.keys(ordersByRound).map((round) => (
                <div key={round} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Round {round}
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <div className="space-y-2">
                    {ordersByRound[parseInt(round)].map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3"
                      >
                        <div>
                          <span className="text-white">{order.name}</span>
                          <span className="text-zinc-500 ml-2">x{order.quantity}</span>
                        </div>
                        <span className="font-medium text-white">
                          €{order.total.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 space-y-4">
          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Subtotal</span>
              <span className="text-white">€{table.totalPriceWithoutTVSH.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">TVSH</span>
              <span className="text-white">€{table.tvsh.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-lg font-bold text-green-400">
                €{table.totalPriceWithTVSH.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="purple"
            size="lg"
            className="w-full"
            onClick={() => {
              dispatch(markTableFinished(tableId));
              dispatch(closeModal());
              toast.success("Request sent to waiter", {
                description: "The waiter has been notified to bring the bill.",
              });
            }}
          >
            <Printer className="w-4 h-4 mr-2" />
            Request Bill
          </Button>
        </div>
      </div>
    </div>
  );
}
