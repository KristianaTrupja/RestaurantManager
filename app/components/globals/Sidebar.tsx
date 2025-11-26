"use client";

import React, { useRef } from "react";

interface SidebarProps<T extends React.ReactNode> {
  items: T[];
  selected: T | null;
  onSelect: (item: T) => void;
  renderItem?: (item: T, selected: boolean) => React.ReactNode;
  verticalClassName?: string;
  horizontalClassName?: string;
}

export default function Sidebar<T extends React.ReactNode>({
  items,
  selected,
  onSelect,
  renderItem,
  verticalClassName = "",
  horizontalClassName = "",
}: SidebarProps<T>) {
  const containerRef = useRef<HTMLUListElement>(null);

  const handleClick = (item: T, index: number) => {
    onSelect(item);
  };

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <div
        className={`
    hidden md:block 
    frosted-glass 
    bg-[rgba(255,255,255,0.2)] 
    h-[90%] 
    overflow-y-auto         // <-- ADD THIS
    p-4 
    rounded-r-2xl 
    fixed 
    top-20 
    left-0 
    custom-scrollbar-dark
    ${verticalClassName}
  `}
      >
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleClick(item, index)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100/20 ${
                selected === item
                  ? "bg-white text-black font-bold"
                  : "text-white"
              }`}
            >
              {renderItem ? renderItem(item, selected === item) : item}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: horizontal sidebar */}
      <div
        className={`md:hidden w-full overflow-x-auto py-3 frosted-glass bg-[rgba(255,255,255,0.2)] ${horizontalClassName}`}
      >
        <ul ref={containerRef} className="flex gap-3 px-4 min-w-max">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleClick(item, index)}
              className={`flex-shrink-0 cursor-pointer whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200/50 ${
                selected === item
                  ? "font-bold bg-white text-black"
                  : "text-white"
              }`}
            >
              {renderItem ? renderItem(item, selected === item) : item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
