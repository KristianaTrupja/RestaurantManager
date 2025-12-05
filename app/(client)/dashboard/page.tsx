"use client";

import { useState } from "react";
import MenuGrid from "./components/MenuGrid";
import Sidebar from "@/app/components/globals/Sidebar";
import { categories } from "@/app/mock-data/mockMenu";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("Starters");

  return (
    <>
      {/* Mobile: Sticky horizontal tabs */}
      <div className="md:hidden">
        <Sidebar
          items={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          renderItem={(cat) => <span>{cat}</span>}
        />
      </div>

      {/* Main layout with sidebar */}
      <div className="flex px-4 sm:px-6 lg:px-8 py-4 gap-6">
        {/* Desktop sidebar */}
        <div className="hidden md:block flex-shrink-0">
          <Sidebar
            items={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            renderItem={(cat) => <span>{cat}</span>}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {selectedCategory}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Browse our delicious menu items
            </p>
          </div>
          <MenuGrid category={selectedCategory} />
        </div>
      </div>
    </>
  );
}
