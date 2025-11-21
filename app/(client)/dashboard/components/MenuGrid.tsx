import { menuItems } from "@/app/mock-data/mockMenu";
import ProductCard from "./ProductCard";

export default function MenuGrid({ category }: { category: string }) {
  const filtered = menuItems.filter((item) => item.category === category);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4 ml-70">
      {filtered.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}

      {filtered.length === 0 && (
        <p className="text-gray-500">No items in this category.</p>
      )}
    </div>
  );
}
