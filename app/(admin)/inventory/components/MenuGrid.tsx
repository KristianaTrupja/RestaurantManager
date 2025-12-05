import { menuItems } from "@/app/mock-data/mockMenu";
import ProductCard from "./ProductCart";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { openModal } from "@/app/store/slices/modalSlice";

export default function MenuGrid({ category }: { category: string }) {
  const dispatch = useAppDispatch();

  const filtered = menuItems.filter((item) => item.category === category);

  const handleAddNewItem = () => {
    dispatch(openModal({ type: "createMenuItem", category: category }));
  };

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
      {/* Add new item card - matches ProductCard structure */}
      <div
        onClick={handleAddNewItem}
        className="
          group relative rounded-2xl overflow-hidden text-white cursor-pointer
          frosted-glass bg-[rgba(255,255,255,0.05)]
          border-2 border-dashed border-white/20
          transition-all duration-300
          hover:bg-[rgba(255,255,255,0.1)] hover:border-purple-400/50
          hover:shadow-xl hover:shadow-purple-500/10
        "
      >
        {/* Image placeholder area - same aspect ratio as ProductCard */}
        <div className="relative aspect-4/3 flex items-center justify-center bg-white/5">
          <div className="
            w-16 h-16 rounded-full 
            bg-purple-500/20 group-hover:bg-purple-500/30
            flex items-center justify-center
            transition-all duration-300
            group-hover:scale-110
          ">
            <Plus className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        {/* Content area - matches ProductCard padding */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg text-white">Add New Item</h3>
          <p className="text-sm text-zinc-400 min-h-10">
            Add a new menu item to {category}
          </p>
          <div className="pt-2">
            <div className="w-full py-2 px-3 rounded-md bg-purple-500/20 text-purple-400 text-sm font-medium text-center group-hover:bg-purple-500/30 transition-colors">
              + Create Item
            </div>
          </div>
        </div>
      </div>

      {/* Product cards */}
      {filtered.map((item, index) => (
        <ProductCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
