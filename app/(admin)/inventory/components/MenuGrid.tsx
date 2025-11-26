import { menuItems } from "@/app/mock-data/mockMenu";
import ProductCard from "./ProductCart";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { openModal } from "@/app/store/slices/modalSlice";

export default function MenuGrid({ category }: { category: string }) {
  const dispatch = useAppDispatch();

  const filtered = menuItems.filter((item) => item.category === category);

  const handleAddNewItem = () => {
    dispatch(openModal({type:"createMenuItem", category: category}));
  };
  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-4 md:ml-60 mt-5 md:mt-10">
      {filtered.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
      <div className="frosted-glass bg-[rgba(255,255,255,0.15)] rounded-lg flex flex-col justify-center items-center backdrop-blur-md transition-transform duration-200 hover:scale-[1.02] cursor-pointer" onClick={handleAddNewItem}>
        <Plus width={50} height={50} /> <span>Add new menu item</span>
      </div>
      {filtered.length === 0 && (
        <p className="text-gray-500">No items in this category.</p>
      )}
    </div>
  );
}
