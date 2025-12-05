import { menuItems } from "@/app/mock-data/mockMenu";
import ProductCard from "./ProductCard";
import { UtensilsCrossed } from "lucide-react";

export default function MenuGrid({ category }: { category: string }) {
  const filtered = menuItems.filter((item) => item.category === category);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <UtensilsCrossed className="w-10 h-10 text-zinc-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No items yet</h3>
        <p className="text-zinc-400 max-w-sm">
          There are no items in the {category} category at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
      {filtered.map((item, index) => (
        <ProductCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
