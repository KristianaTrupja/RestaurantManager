"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, FolderOpen } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { openModal } from "@/app/store/slices/modalSlice";

interface AdminSidebarProps {
  items: string[];
  selected: string | null;
  onSelect: (item: string) => void;
}

export default function AdminSidebar({
  items,
  selected,
  onSelect,
}: AdminSidebarProps) {
  const dispatch = useAppDispatch();
  const horizontalRef = useRef<HTMLUListElement>(null);
  const selectedRef = useRef<HTMLLIElement>(null);
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollIndicators = useCallback(() => {
    if (horizontalRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = horizontalRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    const container = horizontalRef.current;
    if (!container) return;

    updateScrollIndicators();
    container.addEventListener("scroll", updateScrollIndicators);
    window.addEventListener("resize", updateScrollIndicators);

    const timer = setTimeout(updateScrollIndicators, 100);

    return () => {
      container.removeEventListener("scroll", updateScrollIndicators);
      window.removeEventListener("resize", updateScrollIndicators);
      clearTimeout(timer);
    };
  }, [updateScrollIndicators, items]);

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

  const scroll = (direction: "left" | "right") => {
    if (horizontalRef.current) {
      const scrollAmount = 150;
      horizontalRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleAddCategory = () => {
    dispatch(openModal({ type: "createCategory" }));
  };

  return (
    <>
      {/* Desktop/Tablet: vertical sidebar */}
      <aside
        className="
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
        "
      >
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="text-xs uppercase tracking-wider text-zinc-400">
            Categories
          </h3>
          <button
            onClick={handleAddCategory}
            className="w-6 h-6 rounded-md bg-purple-500/20 hover:bg-purple-500/30 flex items-center justify-center text-purple-400 transition-colors"
            title="Add Category"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <FolderOpen className="w-6 h-6 text-zinc-500" />
            </div>
            <p className="text-zinc-400 text-sm mb-1">No categories yet</p>
            <p className="text-zinc-500 text-xs mb-4">Create your first category</p>
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        ) : (
          <>
            <ul className="space-y-1 flex-1">
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
                  {item}
                </li>
              ))}
            </ul>
            
            {/* Add Category button at bottom */}
            <div className="pt-3 mt-3 border-t border-white/10">
              <button
                onClick={handleAddCategory}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Mobile: horizontal scrollable tabs with arrow indicators */}
      <div
        className="
          md:hidden 
          sticky top-0 z-40
          w-full 
          frosted-glass 
          bg-[rgba(255,255,255,0.1)]
        "
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
            {/* Add Category button - always first */}
            <li
              onClick={handleAddCategory}
              className="
                flex-shrink-0 
                cursor-pointer 
                whitespace-nowrap 
                px-4 py-2 
                rounded-full 
                text-sm 
                font-medium 
                transition-all duration-200
                bg-purple-500/20 text-purple-400 hover:bg-purple-500/30
                flex items-center gap-1.5
              "
            >
              <Plus className="w-4 h-4" />
              Add
            </li>

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
                {item}
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

