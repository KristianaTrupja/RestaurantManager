"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { categories } from "@/app/mock-data/mockMenu";
import { UtensilsCrossed } from "lucide-react";
import { useState } from "react";

export default function CategorySidebar() {
  const [activeCategory, setActiveCategory] = useState<string>("Starters");

  return (
    <Sidebar>
      <SidebarContent className="border-r frosted-glass ">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold">
            Menu Categories
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => (
                <SidebarMenuItem key={cat}>
                  <SidebarMenuButton
                    onClick={() => setActiveCategory(cat)}
                    isActive={activeCategory === cat}
                    className="flex items-center gap-2"
                  >
                    <UtensilsCrossed className="h-4 w-4" />
                    <span>{cat}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
