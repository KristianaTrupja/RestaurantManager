"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import { markTableServed } from "@/app/store/slices/tableSlice";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function GlobalModal() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);

  const table = useAppSelector((state) =>
    state.tables.list.find((t) => t.id === modal.tableId)
  );

  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div
        className="relative w-[90%] max-w-md p-6 rounded-2xl shadow-xl bg-white/70 backdrop-blur-xl 
                   border border-white/40 animate-scaleIn"
      >
        {/* Close Icon */}
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-4 right-4 text-gray-700 hover:text-black transition-transform hover:scale-110"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-5">
          {modal.title}
        </h2>

        {/* Orders */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Orders</h3>

          {modal.orders?.length ? (
            <ul className="space-y-2">
              {modal.orders.map((order, index) => (
                <li
                  key={index}
                  className="flex justify-between text-sm bg-white/60 px-3 py-2 rounded-lg shadow-sm"
                >
                  <span className="font-medium">
                    {order.name}{" "}
                    <span className="text-gray-600">x{order.quantity}</span>
                  </span>
                  <span className="font-semibold">
                    {(order.price * order.quantity).toFixed(2)}€
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600 italic bg-white/60 p-3 rounded-lg shadow-sm">
              No orders yet.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-3 mt-4">
          {/* Mark as Served */}
          {table?.status !== "served" ? (
            <Button
              onClick={() => {
                dispatch(markTableServed(modal.tableId!));
                dispatch(closeModal());
              }}
              size="lg"
              variant="purple"
            >
              Mark as Served
            </Button>
          ) : (
            <Button
              disabled
              size="lg"
              variant="disabled"
            >
              Already Served
            </Button>
          )}

          {/* Print Bill */}
          <Button
            onClick={() => alert("Printing bill…")}
            size="lg"
            variant="orange"
          >
            Print Bill
          </Button>
        </div>
      </div>
    </div>
  );
}
