"use client";

import { useState } from "react";
import MenuGrid from "./components/MenuGrid";
import Sidebar from "@/app/components/globals/Sidebar";
import { categories } from "@/app/mock-data/mockMenu";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("Starters");

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar
        items={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        horizontalClassName="mt-4"
        renderItem={(cat, isSelected) => (
          <span>
            {cat}
          </span>
        )}
      />

      <div className="flex-1">
        <h1 className="text-2xl font-bold p-6 hidden 0md:block">
          {selectedCategory}
        </h1>
        <MenuGrid category={selectedCategory} />
      </div>
    </div>
  );
}
