"use client";

import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";

export default function CartModal() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white text-black w-80 p-5 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Your Cart</h2>

          <button onClick={() => dispatch(closeModal())} className="text-black">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
