"use client";

import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import {
  decreaseQty,
  addToCart,
  removeFromCart,
  clearCart,
} from "@/app/store/slices/cartSlice";
import { closeModal } from "@/app/store/slices/modalSlice";
import { addOrderRound } from "@/app/store/slices/orderSlice";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function CartModal() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const orderRound = useAppSelector((state) => state.orders.round);

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleOrder = () => {
    if (items.length === 0) return;

    const orderItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
      round: orderRound,
    }));

    toast.success("Order placed successfully!", {
      description: "Your order will be served soon.",
    });

    dispatch(addOrderRound(orderItems));
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Your Cart</h2>
              <p className="text-sm text-zinc-400">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-5">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-zinc-500" />
              </div>
              <p className="text-zinc-400 mb-2">Your cart is empty</p>
              <p className="text-zinc-500 text-sm">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar-dark">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white/5 hover:bg-white/8 p-3 rounded-xl transition-colors"
                >
                  {/* Top row: Image, Name, Remove button */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="font-medium text-white text-sm sm:text-base leading-tight mb-1">
                        {item.name}
                      </p>
                      <p className="text-sm text-zinc-400">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Remove button - always visible on mobile */}
                    <button
                      onClick={() => {
                        dispatch(removeFromCart(item.id));
                        toast.success("Item removed from cart");
                      }}
                      className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full sm:opacity-0 sm:group-hover:opacity-100 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom row: Quantity controls and Price */}
                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
                      <button
                        onClick={() => dispatch(decreaseQty(item.id))}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-10 text-center font-semibold text-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          dispatch(
                            addToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                              quantity: 1,
                            })
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <p className="font-bold text-white text-lg">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 space-y-4">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Service fee</span>
                <span className="text-white">$0.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-lg font-bold text-green-400">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Button */}
            <Button
              variant="purple"
              size="lg"
              className="w-full"
              onClick={handleOrder}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Place Order • ${total.toFixed(2)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
