"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  
  // Scroll indicators state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position and update indicators
  const updateScrollIndicators = useCallback(() => {
    if (horizontalRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = horizontalRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  // Update indicators on scroll, resize, and mount
  useEffect(() => {
    const container = horizontalRef.current;
    if (!container) return;

    updateScrollIndicators();
    container.addEventListener("scroll", updateScrollIndicators);
    window.addEventListener("resize", updateScrollIndicators);

    // Initial check after render
    const timer = setTimeout(updateScrollIndicators, 100);

    return () => {
      container.removeEventListener("scroll", updateScrollIndicators);
      window.removeEventListener("resize", updateScrollIndicators);
      clearTimeout(timer);
    };
  }, [updateScrollIndicators, items]);

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

  // Scroll by amount on arrow click
  const scroll = (direction: "left" | "right") => {
    if (horizontalRef.current) {
      const scrollAmount = 150;
      horizontalRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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

      {/* Mobile: horizontal scrollable tabs with arrow indicators */}
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
        <div className="relative">
          {/* Left fade gradient + arrow */}
          <div
            className={`
              absolute left-0 top-0 bottom-0 z-10
              flex items-center
              transition-opacity duration-300
              ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          >
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[rgba(30,30,30,0.9)] to-transparent pointer-events-none" />
            <button
              onClick={() => scroll("left")}
              className="
                relative ml-1
                w-8 h-8 
                rounded-full 
                bg-white/20 hover:bg-white/30
                backdrop-blur-md
                flex items-center justify-center
                text-white
                transition-all duration-200
                active:scale-90
                shadow-lg
              "
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable list */}
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

          {/* Right fade gradient + arrow */}
          <div
            className={`
              absolute right-0 top-0 bottom-0 z-10
              flex items-center
              transition-opacity duration-300
              ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          >
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[rgba(30,30,30,0.9)] to-transparent pointer-events-none" />
            <button
              onClick={() => scroll("right")}
              className="
                relative mr-1
                w-8 h-8 
                rounded-full 
                bg-white/20 hover:bg-white/30
                backdrop-blur-md
                flex items-center justify-center
                text-white
                transition-all duration-200
                active:scale-90
                shadow-lg
              "
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
