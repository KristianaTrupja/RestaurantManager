"use client";

import React, { useState } from "react";
import { categories } from "@/app/mock-data/mockMenu";

interface SidebarProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategorySidebar({ selected, onSelect }: SidebarProps) {
  return (
    <div className="w-64 frosted-glass h-screen p-4 bg-[rgba(255,255,255,0.2)] rounded-r-2xl fixed top-20 left-0">
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
  );
}
