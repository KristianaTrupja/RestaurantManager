"use client";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { closeModal } from "../../store/slices/modalSlice";

export default function Modal() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);

  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-80 text-black">
        <h2 className="text-xl font-bold mb-2">{modal.title}</h2>
        <p className="mb-4">{modal.content}</p>

        <div className="flex justify-end gap-2">
          {modal.onCancel && (
            <button
              onClick={() => {
                modal.onCancel?.();
                dispatch(closeModal());
              }}
              className="px-4 py-1 rounded bg-gray-300"
            >
              Cancel
            </button>
          )}

          {modal.onConfirm && (
            <button
              onClick={() => {
                modal.onConfirm?.();
                dispatch(closeModal());
              }}
              className="px-4 py-1 rounded bg-blue-600 text-white"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
