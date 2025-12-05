"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, X, Tag, FileText, DollarSign, Image, Eye } from "lucide-react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.price) {
      toast.error("Please fill in required fields");
      return;
    }
    console.log("NEW MENU ITEM:", form);
    dispatch(closeModal());
    toast.success("Menu item added successfully!");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add New Item</h2>
              <p className="text-sm text-zinc-400">to {preselectedCategory || "menu"}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar-dark">
          {/* Category */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <FileText className="w-4 h-4" />
              Name *
            </label>
            <input
              name="name"
              placeholder="e.g. Margherita Pizza"
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              name="description"
              placeholder="Short description of the item..."
              rows={3}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition resize-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <DollarSign className="w-4 h-4" />
              Price (€) *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <Image className="w-4 h-4" />
              Image URL
            </label>
            <input
              name="image"
              placeholder="https://example.com/image.jpg"
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition"
            />
            {form.image && (
              <div className="mt-2 rounded-xl overflow-hidden border border-white/10">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-zinc-400" />
              <span className="text-white text-sm">Available for customers</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10">
          <Button
            variant="purple"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      </div>
    </div>
  );
}
