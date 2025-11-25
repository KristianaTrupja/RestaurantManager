"use client";

import React, { useRef } from "react";
import { categories } from "@/app/mock-data/mockMenu";

interface SidebarProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategorySidebar({ selected, onSelect }: SidebarProps) {
  const containerRef = useRef<HTMLUListElement>(null);

  const handleClick = (category: string, index: number) => {
    onSelect(category);
  };

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <div className="hidden md:block w-64 frosted-glass h-screen p-4 bg-[rgba(255,255,255,0.2)] rounded-r-2xl fixed top-20 left-0">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => onSelect(category)}
              className={`p-2 rounded cursor-pointer ${
                selected === category
                  ? "bg-white text-black"
                  : "hover:bg-gray-100/20 text-white"
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: horizontal sidebar */}
      <div className="md:hidden w-full overflow-x-auto py-3 bg-[rgba(255,255,255,0.1)] frosted-glass">
        <ul ref={containerRef} className="flex gap-3 px-4 min-w-max">
          {categories.map((category, index) => (
            <li
              key={category}
              onClick={() => handleClick(category, index)}
              className={`px-4 py-2 rounded-full cursor-pointer whitespace-nowrap text-sm font-medium flex-shrink-0 ${
                selected === category
                  ? "bg-white text-black"
                  : "bg-gray-200/30 hover:bg-gray-200/50 text-white"
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
