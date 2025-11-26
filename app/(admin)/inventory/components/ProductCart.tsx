"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/app/store/hooks";
import { updateMenuItem } from "@/app/store/slices/menuSlice";
import { cn } from "@/lib/utils";

export default function ProductCard({ item }: any) {
  const dispatch = useAppDispatch();

  const [editMode, setEditMode] = useState(false);
  const [available, setAvailable] = useState(false);

  const [form, setForm] = useState({
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    dispatch(updateMenuItem({ ...item, ...form }));
    setEditMode(false);
  };

  const handleAvailability = () => {
    setAvailable(!available);
    dispatch(updateMenuItem({ ...item, available: !available }));
  };

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg text-white frosted-glass bg-[rgba(255,255,255,0.15)] backdrop-blur-md transition-transform duration-200 hover:scale-[1.02]">
      {/* Image */}
      {editMode ? (
        <div className="relative">
          <img
            src={form.image}
            alt="preview"
            className="w-full h-40 object-cover"
          />

          <div className="p-3 bg-black/40 backdrop-blur-lg">
            <label className="text-xs opacity-80">Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-md bg-white/90 text-black outline-none"
            />
          </div>
        </div>
      ) : (
        <img
          src={form.image}
          alt={form.name}
          className="w-full h-40 object-cover"
        />
      )}

      {/* Content */}
      <div className={cn(editMode ? "pb-24":"p-4 pb-20 md:pb-12 space-t-3 ")}>
        {/* Name */}
        {editMode ? (
          <div>
            <label className="text-xs opacity-80">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-md bg-white/90 text-black outline-none"
            />
          </div>
        ) : (
          <h3 className="font-semibold text-xl">{form.name}</h3>
        )}

        {/* Description */}
        {editMode ? (
          <div>
            <label className="text-xs opacity-80">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-md bg-white/90 text-black outline-none"
              rows={3}
            />
          </div>
        ) : (
          <p className="text-sm opacity-80 leading-snug">{form.description}</p>
        )}

        {/* Price */}
        {editMode ? (
          <div>
            <label className="text-xs opacity-80">Price ($)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-md bg-white/90 text-black outline-none"
            />
          </div>
        ) : (
          <p className="mt-2 font-bold text-lg">${form.price.toFixed(2)}</p>
        )}
        <div className="absolute bottom-3">
          {/* Buttons */}
          {editMode ? (
            <div className="flex gap-2">
              <Button variant="default" size="sm" onClick={handleSave}>
                Save
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outyellow"
              size="sm"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          )}
          <Button
            variant="outred"
            size="sm"
            className="ml-2 mt-2"
            onClick={handleAvailability}
          >
            {available ? "Mark Unavailable" : "Mark Available"}
          </Button>
        </div>
      </div>
    </div>
  );
}
