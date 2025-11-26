"use client";

import { useAppDispatch } from "@/app/store/hooks";
import { addToCart } from "@/app/store/slices/cartSlice";
import { Button } from "@/components/ui/button";

export default function ProductCard({ item }: any) {
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
  };

  const isUnavailable = !item.available;

  return (
    <div
      className={`
        relative rounded-lg overflow-hidden shadow-sm text-white frosted-glass 
        bg-[rgba(255,255,255,0.1)] transition-transform duration-200 
        ${isUnavailable ? "opacity-40 grayscale cursor-not-allowed" : "hover:scale-103"}
      `}
    >
      {/* Unavailable badge */}
      {isUnavailable && (
        <span className="absolute top-3 right-3 z-10 bg-red-600 text-xs font-bold px-2 py-1 rounded-md shadow-md">
          Unavailable
        </span>
      )}

      {/* Image */}
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-32 object-cover mb-4 rounded aspect-square ${
            isUnavailable ? "blur-[1px]" : ""
          }`}
        />
      </div>

      <div className="p-4 pb-12">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm opacity-80">{item.description}</p>
        <p className="mt-2 font-bold">${item.price.toFixed(2)}</p>
        <div className="absolute bottom-3">
        {/* Add to Cart button */}
        {isUnavailable ? (
          <Button
            variant="secondary"
            disabled
            size="sm"
            className="mt-4 opacity-50 cursor-not-allowed"
          >
            Not Available
          </Button>
        ) : (
          <Button
            variant="outyellow"
            size="sm"
            className="mt-4"
            onClick={handleAdd}
          >
            Add to Cart
          </Button>
        )}
        </div>
      </div>
    </div>
  );
}
