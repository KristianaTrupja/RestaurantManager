"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MenuGrid from "./components/MenuGrid";
import Sidebar from "@/app/components/globals/Sidebar";
import { useGetCategoriesQuery } from "@/app/lib/api/categoryApi";
import { useAppDispatch } from "@/app/store/hooks";
import { setSession } from "@/app/store/slices/cartSlice";
import { Loader2 } from "lucide-react";
import type { Category } from "@/app/types";

export default function MenuPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { data: categoriesResponse, isLoading, error } = useGetCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categories = categoriesResponse?.data || [];

  // Save session info from URL params to Redux
  useEffect(() => {
    const tableId = searchParams.get("tableId");
    const sessionId = searchParams.get("sessionId");
    const tableNumber = searchParams.get("tableNumber");

    if (tableId && sessionId) {
      console.log("[Dashboard] Saving session to Redux:", { tableId, sessionId, tableNumber });
      dispatch(setSession({
        tableId,
        sessionId,
        tableNumber: tableNumber || "",
      }));
    }
  }, [searchParams, dispatch]);

  // Set first category as default when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

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

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-zinc-400 mb-2">No menu categories available</p>
          <p className="text-zinc-500 text-sm">Please check back later</p>
        </div>
      </div>
    );
  }

  const handleCategorySelect = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    if (category) {
      setSelectedCategory(category);
    }
  };

  const categoryNames = categories.map(c => c.name);

  return (
    <>
      {/* Mobile: Sticky horizontal tabs */}
      <div className="md:hidden">
        <Sidebar
          items={categoryNames}
          selected={selectedCategory?.name || null}
          onSelect={handleCategorySelect}
          renderItem={(cat) => <span>{cat}</span>}
        />
      </div>

      {/* Main layout with sidebar */}
      <div className="flex px-4 sm:px-6 lg:px-8 py-4 gap-6">
        {/* Desktop sidebar */}
        <div className="hidden md:block flex-shrink-0">
          <Sidebar
            items={categoryNames}
            selected={selectedCategory?.name || null}
            onSelect={handleCategorySelect}
            renderItem={(cat) => <span>{cat}</span>}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {selectedCategory?.name || "Menu"}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Browse our delicious menu items
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
