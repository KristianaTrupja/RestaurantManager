import { useAppDispatch } from "@/app/store/hooks";
import { addToCart } from "@/app/store/slices/cartSlice";
import { Button } from "@/components/ui/button";

export default function ProductCard({ item }: any) {
  const dispatch = useAppDispatch();

  const handleAdd = () => {
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
  return (
    <div className="rounded-lg overflow-hidden shadow-sm text-white frosted-glass bg-[rgba(255,255,255,0.1)] hover:scale-103 transition-transform duration-200">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-32 object-cover mb-4 rounded aspect-square"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm opacity-80">{item.description}</p>
        <p className="mt-2 font-bold">${item.price.toFixed(2)}</p>

        {/* Add to Cart button */}
        <Button
          variant="outyellow"
          size="sm"
          className="mt-4"
          onClick={handleAdd}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
