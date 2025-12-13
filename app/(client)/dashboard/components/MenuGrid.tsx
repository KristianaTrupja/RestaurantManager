import { useGetMenuItemsQuery } from "@/app/lib/api/menuItemApi";
import ProductCard from "./ProductCard";
import { UtensilsCrossed, Loader2 } from "lucide-react";

interface MenuGridProps {
  categoryId: number;
  categoryName: string;
}

export default function MenuGrid({ categoryId, categoryName }: MenuGridProps) {
  // Fetch all menu items and filter by categoryId on the client
  const { data: menuItemsResponse, isLoading, error } = useGetMenuItemsQuery();
  
  const allMenuItems = menuItemsResponse?.data || [];
  // Filter by categoryId
  const menuItems = allMenuItems.filter(item => item.categoryId === categoryId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    // Show more details about the error for debugging
    const errorMessage = 'status' in error 
      ? `Error ${error.status}: ${JSON.stringify(error.data)}`
      : error.message || 'Unknown error';
    
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <UtensilsCrossed className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Failed to load menu</h3>
        <p className="text-zinc-400 max-w-sm mb-4">
          Please try refreshing the page
        </p>
        <p className="text-xs text-zinc-600 max-w-md break-all">
          {errorMessage}
        </p>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <UtensilsCrossed className="w-10 h-10 text-zinc-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No items yet</h3>
        <p className="text-zinc-400 max-w-sm">
          There are no items in the {categoryName} category at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
      {menuItems.map((item, index) => (
        <ProductCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
