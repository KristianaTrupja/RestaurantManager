"use client";

import { useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { closeModal } from "@/app/store/slices/modalSlice";
import { useCreateCategoryMutation } from "@/app/lib/api/categoryApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FolderPlus, X, Tag, FileText, Loader2 } from "lucide-react";

export default function AddCategoryModal() {
  const dispatch = useAppDispatch();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const result = await createCategory({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      }).unwrap();

      if (result.success) {
        dispatch(closeModal());
        toast.success(`Category "${form.name}" created successfully!`);
      } else {
        toast.error(result.message || "Failed to create category");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to create category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md frosted-glass bg-[rgba(30,30,30,0.95)] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add Category</h2>
              <p className="text-sm text-zinc-400">Create a new menu category</p>
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
        <div className="p-5 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <Tag className="w-4 h-4" />
              Category Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Appetizers, Main Course, Desserts"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <FileText className="w-4 h-4" />
              Description (optional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of this category..."
              rows={3}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 transition resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10">
          <Button
            variant="purple"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </span>
            ) : (
              <>
                <FolderPlus className="w-4 h-4 mr-2" />
                Create Category
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

