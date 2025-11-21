"use client";

import { useState } from "react";
import MenuGrid from "./components/MenuGrid";
import CategorySidebar from "./components/CategorySidebar";

export default function MenuPage() {
  const [selected, setSelected] = useState("Starters");

  return (
    <div className="flex">
      <CategorySidebar selected={selected} onSelect={setSelected} />

      <div className="flex-1">
        <h1 className="text-2xl font-bold p-6">{selected}</h1>
        <MenuGrid category={selected} />
      </div>
    </div>
  );
}
