import { useGetAllMenuItemsQuery } from "@/app/lib/api/menuItemApi";
import ProductCard from "./ProductCart";
import { Plus, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { openModal } from "@/app/store/slices/modalSlice";
import type { MenuItem } from "@/app/types";

interface MenuGridProps {
  categoryId: number;
  categoryName: string;
}

export default function MenuGrid({ categoryId, categoryName }: MenuGridProps) {
  const dispatch = useAppDispatch();
  // For admin: fetch ALL menu items (including unavailable) filtered by categoryId
  const { data: response, isLoading, error } = useGetAllMenuItemsQuery({ 
    categoryId 
  });

  // Handle Spring Page response format: { success: true, data: { content: [...], ... } }
  // or simple array format: { success: true, data: [...] }
  const extractMenuItems = (): MenuItem[] => {
    if (!response?.data) return [];
    
    // Check if it's a Spring Page response (has 'content' property)
    if ('content' in response.data && Array.isArray(response.data.content)) {
      return response.data.content;
    }
    
    // Check if data itself is the paginated response with 'data' containing items
    if ('data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Check if it's directly an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  };

  const menuItems = extractMenuItems();

  const handleAddNewItem = () => {
    dispatch(openModal({ type: "createMenuItem", category: categoryName }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    const errorMessage = 'status' in error 
      ? `Error ${error.status}: ${JSON.stringify(error.data)}`
      : error.message || 'Unknown error';
      
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-red-400 mb-2">Failed to load menu items</p>
        <p className="text-zinc-500 text-sm mb-4">Please try refreshing the page</p>
        <p className="text-xs text-zinc-600 max-w-md break-all">
          {errorMessage}
        </p>
      </div>
    );
  }

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
            Add a new menu item to {categoryName}
          </p>
          <div className="pt-2">
            <div className="w-full py-2 px-3 rounded-md bg-purple-500/20 text-purple-400 text-sm font-medium text-center group-hover:bg-purple-500/30 transition-colors">
              + Create Item
            </div>
          </div>
        </div>
      </div>

      {/* Product cards */}
      {menuItems.map((item, index) => (
        <ProductCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
