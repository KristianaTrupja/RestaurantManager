"use client";

import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import { clearOrders } from "@/app/store/slices/orderSlice";
import { clearSession } from "@/app/store/slices/cartSlice";
import { useGetBillQuery, useRequestBillMutation } from "@/app/lib/api/sessionApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Receipt, X, Printer, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function BillModal() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const modal = useAppSelector((state) => state.modal);
  const localOrders = useAppSelector((state) => state.orders.localOrders);
  const cart = useAppSelector((state) => state.cart);
  const searchParams = useSearchParams();
  
  const sessionId = searchParams.get("sessionId") || cart.sessionId || "";
  const tableNumberParam = searchParams.get("tableNumber") || String(cart.tableNumber || "");
  
  const { data: billResponse, isLoading } = useGetBillQuery(sessionId, {
    skip: !sessionId || !modal.isOpen || modal.type !== "bill",
  });
  
  const [requestBill, { isLoading: isRequesting }] = useRequestBillMutation();

  if (!modal.isOpen || modal.type !== "bill") return null;

  const apiBill = billResponse?.data;
  const currency = apiBill?.currency || "€";
  const hasApiBillItems = apiBill?.items && apiBill.items.length > 0;
  const hasLocalOrders = localOrders.length > 0;

  const localBillItems = localOrders.flatMap(order => 
    order.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      round: order.round,
    }))
  );

  const displayItems = hasApiBillItems ? apiBill!.items : localBillItems;
  const hasItems = displayItems.length > 0;

  const localSubtotal = localOrders.reduce((sum, order) => sum + order.subtotal, 0);
  const localTaxRate = 0.20;
  const localTaxAmount = localSubtotal * localTaxRate;
  const localTotal = localSubtotal + localTaxAmount;

  const subtotal = hasApiBillItems ? apiBill!.subtotal : localSubtotal;
  const taxRate = hasApiBillItems ? apiBill!.taxRate : localTaxRate;
  const taxAmount = hasApiBillItems ? apiBill!.taxAmount : localTaxAmount;
  const total = hasApiBillItems ? apiBill!.total : localTotal;
  const tableNumber = apiBill?.tableNumber || tableNumberParam || "?";

  const itemsByRound = displayItems.reduce(
    (acc: Record<number, typeof displayItems>, item) => {
      const round = item.round || 1;
      if (!acc[round]) acc[round] = [];
      acc[round].push(item);
      return acc;
    },
    {}
  );

  const handleRequestBill = async () => {
    if (!sessionId) {
      toast.error("Session not found");
      return;
    }

    try {
      await requestBill(sessionId).unwrap();
      dispatch(closeModal());
      dispatch(clearOrders());
      dispatch(clearSession());
      toast.success("Bill requested!", {
        description: "The waiter has been notified and will bring your bill shortly.",
      });
      router.push("/login");
    } catch (err) {
      console.error("Failed to request bill:", err);
      toast.error("Failed to request bill");
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl p-8 text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading Bill</h2>
          <p className="text-zinc-400">Fetching your order details...</p>
        </div>
      </div>
    );
  }

  if (!hasItems && !hasLocalOrders) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-6 h-6 text-zinc-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Bill Available</h2>
          <p className="text-zinc-400 mb-4">Start ordering to see your bill here.</p>
          <Button
            variant="outline"
            onClick={() => dispatch(closeModal())}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Your Bill</h2>
              <p className="text-sm text-zinc-400">Table {tableNumber}</p>
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
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar-dark">
            {Object.keys(itemsByRound)
              .sort((a, b) => Number(a) - Number(b))
              .map((round) => (
                <div key={round} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Round {round}
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <div className="space-y-2">
                    {itemsByRound[parseInt(round)].map((item, idx) => (
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
        </div>

        <div className="p-5 border-t border-white/10 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Subtotal</span>
              <span className="text-white">{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Tax ({(taxRate * 100).toFixed(0)}%)</span>
              <span className="text-white">{currency}{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-lg font-bold text-green-400">
                {currency}{total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            variant="purple"
            size="lg"
            className="w-full"
            onClick={handleRequestBill}
            disabled={!hasItems || isRequesting}
          >
            {isRequesting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Printer className="w-4 h-4 mr-2" />
            )}
            Request Bill
          </Button>
        </div>
      </div>
    </div>
  );
}
