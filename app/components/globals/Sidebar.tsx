"use client";

import React, { useRef, useEffect } from "react";

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
  const horizontalRef = useRef<HTMLUListElement>(null);
  const selectedRef = useRef<HTMLLIElement>(null);

  // Auto-scroll to selected item on mobile
  useEffect(() => {
    if (selectedRef.current && horizontalRef.current) {
      const container = horizontalRef.current;
      const element = selectedRef.current;
      const containerWidth = container.offsetWidth;
      const elementLeft = element.offsetLeft;
      const elementWidth = element.offsetWidth;
      
      container.scrollTo({
        left: elementLeft - containerWidth / 2 + elementWidth / 2,
        behavior: "smooth",
      });
    }
  }, [selected]);

  return (
    <>
      {/* Desktop/Tablet: vertical sidebar */}
      <aside
        className={`
          hidden md:flex flex-col
          frosted-glass 
          bg-[rgba(255,255,255,0.1)] 
          w-48 lg:w-56
          min-h-[calc(100vh-120px)]
          max-h-[calc(100vh-120px)]
          overflow-y-auto
          p-3 lg:p-4
          rounded-2xl
          sticky
          top-24
          custom-scrollbar-dark
          ${verticalClassName}
        `}
      >
        <h3 className="text-xs uppercase tracking-wider text-zinc-400 mb-3 px-2">
          Categories
        </h3>
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => onSelect(item)}
              className={`
                px-3 py-2.5 rounded-xl cursor-pointer 
                transition-all duration-200
                text-sm lg:text-base
                ${
                  selected === item
                    ? "bg-white text-black font-semibold shadow-md"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {renderItem ? renderItem(item, selected === item) : item}
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile: horizontal scrollable tabs */}
      <div
        className={`
          md:hidden 
          sticky top-0 z-40
          w-full 
          frosted-glass 
          bg-[rgba(255,255,255,0.1)]
          ${horizontalClassName}
        `}
      >
        <ul
          ref={horizontalRef}
          className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <li
              key={index}
              ref={selected === item ? selectedRef : null}
              onClick={() => onSelect(item)}
              className={`
                flex-shrink-0 
                cursor-pointer 
                whitespace-nowrap 
                px-4 py-2 
                rounded-full 
                text-sm 
                font-medium 
                transition-all duration-200
                ${
                  selected === item
                    ? "bg-white text-black font-semibold shadow-md"
                    : "text-white/90 bg-white/5 hover:bg-white/15"
                }
              `}
            >
              {renderItem ? renderItem(item, selected === item) : item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
