
import { SidebarProvider } from "@/components/ui/sidebar";
import CategorySidebar from "./components/CategorySidebar";

export default function ClientDashboard() {
  return (
    
    <SidebarProvider>
    <div className="flex h-screen">
      <CategorySidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
        <p>Select a category from the sidebar.</p>
      </div>
    </div>
    </SidebarProvider>
  );
}
