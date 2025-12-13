"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import { 
  useGetTableByIdQuery, 
  useUpdateTableStatusMutation,
  useAssignWaiterMutation 
} from "@/app/lib/api/tableApi";
import { 
  useEndSessionMutation, 
  useGetBillQuery, 
  useMarkSessionPaidMutation 
} from "@/app/lib/api/sessionApi";
import { useGetOrdersBySessionQuery } from "@/app/lib/api/orderApi";
import { Button } from "@/components/ui/button";
import { X, UtensilsCrossed, Check, Printer, Receipt, Loader2, CreditCard, Banknote } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const getTableNumber = (table: { number?: number; tableNumber?: number }): number | string => {
  return table.tableNumber ?? table.number ?? "?";
};

export default function TablePopup() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  const { data: tableResponse, isLoading: isLoadingTable } = useGetTableByIdQuery(
    modal.tableId || "",
    { skip: !modal.tableId || !modal.isOpen || modal.type !== "table" }
  );

  const table = tableResponse?.data;
  const sessionId = table?.currentSessionId;

  const { data: billResponse, isLoading: isLoadingBill } = useGetBillQuery(
    sessionId || "",
    { skip: !sessionId }
  );

  const { data: ordersResponse, isLoading: isLoadingOrders } = useGetOrdersBySessionQuery(
    sessionId || "",
    { skip: !sessionId }
  );

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateTableStatusMutation();
  const [assignWaiter, { isLoading: isAssigning }] = useAssignWaiterMutation();
  const [endSession, { isLoading: isEndingSession }] = useEndSessionMutation();
  const [markPaid, { isLoading: isMarkingPaid }] = useMarkSessionPaidMutation();

  if (!modal.isOpen || modal.type !== "table") return null;

  const bill = billResponse?.data;
  const orders = ordersResponse?.data || [];
  const currency = bill?.currency || "€";
  const isLoading = isLoadingTable || isLoadingBill || isLoadingOrders;
  const isProcessing = isUpdatingStatus || isAssigning || isEndingSession || isMarkingPaid;

  const tableStatus = table?.status?.toLowerCase() || "free";

  const statusColor = 
    tableStatus === "free" ? "bg-green-500/20 text-green-400" :
    tableStatus === "waiting" ? "bg-yellow-500/20 text-yellow-400" :
    tableStatus === "taken" ? "bg-blue-500/20 text-blue-400" :
    tableStatus === "served" ? "bg-purple-500/20 text-purple-400" :
    tableStatus === "requesting_bill" ? "bg-orange-500/20 text-orange-400" :
    tableStatus === "finished" ? "bg-gray-500/20 text-gray-400" :
    "bg-red-500/20 text-red-400";

  const handleMarkServed = async () => {
    if (!table) return;
    try {
      await updateStatus({ id: table.id, status: "SERVED" }).unwrap();
      toast.success("Table marked as served");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update table status");
    }
  };

  const handlePrintBill = async () => {
    if (!table) return;
    
    try {
      if (sessionId) {
        await markPaid({ id: sessionId, paymentMethod }).unwrap();
        await endSession(sessionId).unwrap();
      }
      
      try {
        await assignWaiter({ id: table.id, waiterId: undefined }).unwrap();
      } catch {
        // Continue even if unassign fails
      }
      
      await updateStatus({ id: table.id, status: "FREE" }).unwrap();
      
      dispatch(closeModal());
      toast.success("Bill processed and table cleared", {
        description: "Table is now available for new guests.",
      });
    } catch (error) {
      console.error("Failed to process bill:", error);
      toast.error("Failed to process bill");
    }
  };

  const handleClearTable = async () => {
    if (!table) return;
    
    try {
      if (sessionId) {
        await endSession(sessionId).unwrap();
      }
      
      try {
        await assignWaiter({ id: table.id, waiterId: undefined }).unwrap();
      } catch {
        // Continue even if unassign fails
      }
      
      await updateStatus({ id: table.id, status: "FREE" }).unwrap();
      
      dispatch(closeModal());
      toast.success("Table cleared", {
        description: "Table is now available for new guests.",
      });
    } catch (error) {
      console.error("Failed to clear table:", error);
      toast.error("Failed to clear table");
    }
  };

  if (isLoadingTable) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl p-8 text-center">
          <p className="text-zinc-400">Table not found</p>
          <Button
            variant="outline"
            onClick={() => dispatch(closeModal())}
            className="mt-4 border-white/20 text-white hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  const billHasItems = bill?.items && bill.items.length > 0;
  const hasDirectOrders = orders && orders.length > 0;
  const hasOrders = billHasItems || hasDirectOrders;

  const displayItems = billHasItems 
    ? bill!.items 
    : orders.flatMap(order => 
        order.items?.map((item: { menuItemName?: string; name?: string; quantity: number; unitPrice: number; totalPrice: number }) => ({
          name: item.menuItemName || item.name || "Unknown Item",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          round: order.round || 1,
        })) || []
      );

  const displaySubtotal = billHasItems 
    ? bill!.subtotal 
    : orders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
  const displayTaxRate = bill?.taxRate || 0.2;
  const displayTaxAmount = billHasItems ? bill!.taxAmount : displaySubtotal * displayTaxRate;
  const displayTotal = billHasItems ? bill!.total : displaySubtotal + displayTaxAmount;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Table {getTableNumber(table)}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor}`}>
                {tableStatus.replace("_", " ")}
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

        <div className="p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : hasOrders ? (
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1 custom-scrollbar-dark">
              {Object.entries(
                displayItems.reduce((groups: Record<number, typeof displayItems>, item) => {
                  const round = item.round || 1;
                  if (!groups[round]) groups[round] = [];
                  groups[round].push(item);
                  return groups;
                }, {})
              )
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([round, items]) => (
                  <div key={round} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Round {round}
                      </span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3"
                        >
                          <div>
                            <span className="text-white">{item.name}</span>
                            <span className="text-zinc-500 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-medium text-white">
                            {currency}{item.totalPrice.toFixed(2)}
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
              <p className="text-zinc-500 text-sm">Orders will appear here when guests order</p>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-white/10 space-y-4">
          {hasOrders && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">{currency}{displaySubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Tax ({(displayTaxRate * 100).toFixed(0)}%)</span>
                <span className="text-white">{currency}{displayTaxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-lg font-bold text-green-400">
                  {currency}{displayTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {hasOrders && (tableStatus === "served" || tableStatus === "requesting_bill" || tableStatus === "finished") && (
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors ${
                  paymentMethod === "cash"
                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                }`}
              >
                <Banknote className="w-4 h-4" />
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors ${
                  paymentMethod === "card"
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Card
              </button>
            </div>
          )}

          <div className="flex gap-3">
            {hasOrders ? (
              <>
                {tableStatus !== "served" && tableStatus !== "requesting_bill" && tableStatus !== "finished" ? (
                  <Button
                    onClick={handleMarkServed}
                    size="lg"
                    variant="purple"
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Mark Served
                  </Button>
                ) : (
                  <Button
                    onClick={handlePrintBill}
                    size="lg"
                    variant="orange"
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    {isEndingSession || isMarkingPaid ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Printer className="w-4 h-4 mr-2" />
                    )}
                    Complete & Print Bill
                  </Button>
                )}
              </>
            ) : (
              tableStatus !== "free" && (
                <Button
                  onClick={handleClearTable}
                  size="lg"
                  variant="outred"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 mr-2" />
                  )}
                  Clear Table
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
