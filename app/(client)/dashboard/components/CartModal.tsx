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
import { Delete } from "lucide-react";

export default function CartModal() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
const orderRound = useAppSelector((state) => state.orders.round);

const handleOrder = () => {
  if (items.length === 0) return;

  // Convert cart items → order items
  const orderItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    total: item.quantity * item.price,
    round: orderRound,
  }));

  dispatch(addOrderRound(orderItems));
  dispatch(clearCart());
  dispatch(closeModal());
};

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/70 text-gray-900 p-6 rounded-2xl shadow-2xl relative animate-scale-in">
        
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-3 right-3 text-black hover:text-gray-800 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Your cart is empty</p>
        ) : (
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl shadow-sm"
              >
                {/* Image */}
                <img
                  src={item.image}         
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg"
                />

                {/* Info */}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ${(item.price).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(decreaseQty(item.id))}
                    className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="font-semibold">{item.quantity}</span>

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
                    className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>


                {/* Price */}
                <p className="font-semibold text-gray-800 min-w-[60px] text-right">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
                {/* Remove Button */}
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="ml-2 text-red-500 hover:text-red-600 text-sm"
                >
                  <Delete/>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="mt-5 border-t pt-4 flex justify-between items-center">
            <p className="text-lg font-semibold">Total:</p>
            <p className="text-xl font-bold text-green-600">
              $
              {items
                .reduce((sum, i) => sum + i.quantity * i.price, 0)
                .toFixed(2)}
            </p>
          </div>
        )}

        <Button variant="orange" className="mt-2" onClick={handleOrder}>Order</Button>
      </div>
    </div>
  );
}
