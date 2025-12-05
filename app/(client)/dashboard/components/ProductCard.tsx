"use client";

import { useAppDispatch } from "@/app/store/hooks";
import { addToCart } from "@/app/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    available: boolean;
  };
  index?: number;
}

export default function ProductCard({ item, index = 0 }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    if (!item.available) return;
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
    );
    toast.success("Added to cart!", {
      description: `${item.name} has been added to your cart.`,
    });
  };

  const isUnavailable = !item.available;

  return (
    <div
      className={`
        group relative rounded-2xl overflow-hidden text-white
        frosted-glass bg-[rgba(255,255,255,0.08)]
        border border-white/10
        transition-all duration-300 ease-out
        ${isUnavailable 
          ? "opacity-50 grayscale" 
          : "hover:bg-[rgba(255,255,255,0.12)] hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
        }
      `}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Unavailable overlay */}
      {isUnavailable && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            Currently Unavailable
          </span>
        </div>
      )}

      {/* Image container */}
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`
            w-full h-full object-cover
            transition-transform duration-500
            ${!isUnavailable && "group-hover:scale-110"}
          `}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/95 text-black font-bold text-sm px-3 py-1 rounded-full shadow-lg">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* Quick add button (appears on hover) */}
        {!isUnavailable && (
          <button
            onClick={handleAdd}
            className="
              absolute bottom-3 right-3
              w-10 h-10 rounded-full
              bg-purple-500 hover:bg-purple-400
              flex items-center justify-center
              shadow-lg shadow-purple-500/30
              transition-all duration-300
              opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
            "
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base sm:text-lg text-white mb-1 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 min-h-10">
          {item.description}
        </p>

        {/* Add to Cart button */}
        <Button
          variant={isUnavailable ? "disabled" : "purple"}
          size="sm"
          className="w-full"
          onClick={handleAdd}
          disabled={isUnavailable}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {isUnavailable ? "Unavailable" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
