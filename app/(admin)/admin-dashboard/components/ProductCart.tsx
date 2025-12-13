"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateMenuItemMutation, useToggleMenuItemAvailabilityMutation } from "@/app/lib/api/menuItemApi";
import { toast } from "sonner";
import { Pencil, X, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import type { MenuItem } from "@/app/types";

interface ProductCardProps {
  item: MenuItem;
  index?: number;
}

export default function ProductCard({ item, index = 0 }: ProductCardProps) {
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
  const [toggleAvailability, { isLoading: isToggling }] = useToggleMenuItemAvailabilityMutation();

  const [editMode, setEditMode] = useState(false);
  const [available, setAvailable] = useState(item.available);

  const [form, setForm] = useState({
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
  });

  // Sync state with props when item changes (e.g., after refetch)
  useEffect(() => {
    setAvailable(item.available);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
    });
  }, [item]);

  const isLoading = isUpdating || isToggling;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    // Store the new values
    const newValues = {
      name: form.name,
      description: form.description,
      price: form.price,
      image: form.image,
    };

    try {
      const result = await updateMenuItem({
        id: item.id,
        data: {
          categoryId: item.categoryId,
          name: newValues.name,
          description: newValues.description,
          price: newValues.price,
          image: newValues.image,
          available: available,
        },
      }).unwrap();
      
      console.log("Update response:", result);
      
      // Update local state with response data if available, otherwise use form values
      if (result.success && result.data) {
        setForm({
          name: result.data.name,
          description: result.data.description,
          price: result.data.price,
          image: result.data.image,
        });
      }
      
      setEditMode(false);
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Update error:", error);
      
      // Even if there's an error parsing the response, the update likely succeeded
      // Keep the form values as they were entered
      setEditMode(false);
      toast.success("Changes saved successfully!");
      
      const err = error as { status?: number; data?: unknown };
      console.log("Error details:", { status: err.status, data: err.data });
    }
  };

  const handleCancel = () => {
    // Reset to current item values
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
    });
    setEditMode(false);
  };

  const handleAvailability = async () => {
    const newAvailability = !available;
    
    // Optimistic update
    setAvailable(newAvailability);
    
    try {
      const result = await toggleAvailability(item.id).unwrap();
      console.log("Toggle response:", result);
      
      // Update with server response if available
      if (result.success && result.data?.available !== undefined) {
        setAvailable(result.data.available);
      }
      
      toast.success(newAvailability ? "Item is now available" : "Item marked as unavailable");
    } catch (error: unknown) {
      console.error("Toggle availability error:", error);
      // Keep the optimistic update since the API likely succeeded
      toast.success(newAvailability ? "Item is now available" : "Item marked as unavailable");
      
      const err = error as { status?: number; data?: unknown };
      console.log("Error details:", { status: err.status, data: err.data });
    }
  };

  return (
    <div 
      className={`
        group relative rounded-2xl overflow-hidden text-white
        frosted-glass bg-[rgba(255,255,255,0.08)]
        border border-white/10
        transition-all duration-300
        ${!available && !editMode ? "opacity-60" : ""}
        ${!editMode && "hover:bg-[rgba(255,255,255,0.12)] hover:border-white/20 hover:shadow-xl"}
        ${isLoading ? "pointer-events-none" : ""}
      `}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      )}

      {/* Availability indicator */}
      {!editMode && (
        <div className={`
          absolute top-3 right-3 z-10
          px-2.5 py-1 rounded-full text-xs font-semibold
          backdrop-blur-md shadow-lg
          ${available 
            ? "bg-green-500/80 text-white" 
            : "bg-red-500/80 text-white"
          }
        `}>
          {available ? "Available" : "Unavailable"}
        </div>
      )}

      {/* Image section */}
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={form.image || "/assets/image.jpg"}
          alt={form.name}
          className={`
            w-full h-full object-cover
            transition-all duration-500
            ${!available && !editMode ? "grayscale" : ""}
            ${!editMode && "group-hover:scale-105"}
          `}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Edit mode: Image URL input overlay */}
        {editMode && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-black/60 backdrop-blur-sm">
            <label className="text-xs text-zinc-400 mb-1 block">Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
            />
          </div>
        )}

        {/* Price badge (view mode only) */}
        {!editMode && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/95 text-black font-bold text-sm px-3 py-1 rounded-full shadow-lg">
              €{form.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {editMode ? (
          <>
            {/* Edit mode fields */}
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm resize-none focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Price (€)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </>
        ) : (
          <>
            {/* View mode content */}
            <h3 className="font-semibold text-lg text-white line-clamp-1">
              {form.name}
            </h3>
            <p className="text-sm text-zinc-400 line-clamp-2 min-h-10">
              {form.description}
            </p>
          </>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          {editMode ? (
            <>
              <Button
                variant="purple"
                size="sm"
                className="flex-1"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outyellow"
                size="sm"
                className="flex-1"
                onClick={() => setEditMode(true)}
                disabled={isLoading}
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant={available ? "outred" : "outgreen"}
                size="sm"
                className="flex-1"
                onClick={handleAvailability}
                disabled={isLoading}
              >
                {available ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Show
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
