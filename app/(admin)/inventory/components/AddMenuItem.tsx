"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import { toast } from "sonner";

export default function AddMenuItem() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);

  const preselectedCategory = modal.category ?? "";

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: preselectedCategory,
    available: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    console.log("NEW MENU ITEM:", form);
    dispatch(closeModal());
         toast.success("New menu item is added to the list");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl w-[92%] max-w-lg border border-white/60 relative">

        {/* Close button */}
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-lg"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Add New Menu Item
        </h2>

        <div className="space-y-5">

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white/70 focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              name="name"
              placeholder="Item Name"
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white/70 focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Short description..."
              rows={3}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white/70 focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price (€)
            </label>
            <input
              name="price"
              type="number"
              placeholder="0.00"
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white/70 focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Image URL
            </label>
            <input
              name="image"
              placeholder="https://example.com/image.jpg"
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white/70 focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
            />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
              className="w-5 h-5 accent-black cursor-pointer rounded"
            />
            <label className="text-gray-700 text-sm select-none">
              Available for customers
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-black text-white rounded-xl text-lg font-medium hover:bg-gray-900 transition shadow-md"
          >
            Add Item
          </button>

        </div>
      </div>
    </div>
  );
}
