"use client";

import { useState, useEffect } from "react";
import MenuGrid from "./components/MenuGrid";
import AdminSidebar from "./components/AdminSidebar";
import { useGetCategoriesQuery } from "@/app/lib/api/categoryApi";
import { Loader2, FolderPlus } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { openModal } from "@/app/store/slices/modalSlice";
import type { Category } from "@/app/types";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { data: categoriesResponse, isLoading, error } = useGetCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categories = categoriesResponse?.data || [];

  // Set first category as default when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Reset selected category if it was deleted
  useEffect(() => {
    if (selectedCategory && !categories.find(c => c.id === selectedCategory.id)) {
      setSelectedCategory(categories[0] || null);
    }
  }, [categories, selectedCategory]);

  const handleCategorySelect = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    if (category) {
      setSelectedCategory(category);
    }
  };

  const categoryNames = categories.map(c => c.name);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-400 mb-2">Failed to load categories</p>
          <p className="text-zinc-500 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Show empty state with add category prompt when no categories
  if (categories.length === 0) {
    return (
      <div className="flex px-4 sm:px-6 lg:px-8 py-4 gap-6">
        {/* Sidebar - still shows even when empty */}
        <div className="hidden md:block flex-shrink-0">
          <AdminSidebar
            items={categoryNames}
            selected={null}
            onSelect={handleCategorySelect}
          />
        </div>

        {/* Mobile sidebar */}
        <div className="md:hidden fixed top-[72px] left-0 right-0 z-40">
          <AdminSidebar
            items={categoryNames}
            selected={null}
            onSelect={handleCategorySelect}
          />
        </div>

        {/* Empty state content */}
        <div className="flex-1 min-w-0 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <FolderPlus className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Categories Yet</h2>
            <p className="text-zinc-400 mb-6 max-w-sm">
              Create your first category to start adding menu items to your restaurant.
            </p>
            <button
              onClick={() => dispatch(openModal({ type: "createCategory" }))}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-medium transition-colors"
            >
              <FolderPlus className="w-5 h-5" />
              Create First Category
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Sticky horizontal tabs */}
      <div className="md:hidden">
        <AdminSidebar
          items={categoryNames}
          selected={selectedCategory?.name || null}
          onSelect={handleCategorySelect}
        />
      </div>

      {/* Main layout with sidebar */}
      <div className="flex px-4 sm:px-6 lg:px-8 py-4 gap-6">
        {/* Desktop sidebar */}
        <div className="hidden md:block flex-shrink-0">
          <AdminSidebar
            items={categoryNames}
            selected={selectedCategory?.name || null}
            onSelect={handleCategorySelect}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {selectedCategory?.name || "Menu"}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Manage your inventory items
            </p>
          </div>
          {selectedCategory && (
            <MenuGrid categoryId={selectedCategory.id} categoryName={selectedCategory.name} />
          )}
        </div>
      </div>
    </>
  );
}
