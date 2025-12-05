"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/app/store/hooks";
import { updateMenuItem } from "@/app/store/slices/menuSlice";
import { toast } from "sonner";
import { Pencil, X, Check, Eye, EyeOff } from "lucide-react";

interface ProductCardProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    available: boolean;
  };
  index?: number;
}

export default function ProductCard({ item, index = 0 }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const [editMode, setEditMode] = useState(false);
  const [available, setAvailable] = useState(item.available);

  const [form, setForm] = useState({
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    dispatch(updateMenuItem({ ...item, ...form }));
    setEditMode(false);
    toast.success("Changes saved successfully!");
  };

  const handleCancel = () => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
    });
    setEditMode(false);
  };

  const handleAvailability = () => {
    const newAvailable = !available;
    setAvailable(newAvailable);
    dispatch(updateMenuItem({ ...item, available: newAvailable }));
    toast.success(newAvailable ? "Item is now available" : "Item marked as unavailable");
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
      `}
    >
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
          src={form.image}
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
              ${form.price.toFixed(2)}
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
              <label className="text-xs text-zinc-400 mb-1 block">Price ($)</label>
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
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={handleCancel}
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
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant={available ? "outred" : "outgreen"}
                size="sm"
                className="flex-1"
                onClick={handleAvailability}
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
