"use client";
import { useEffect, useState } from "react";
import API from "../api/api";

export default function MenuItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/menu")
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Menu Items</h2>

      <ul className="flex flex-col gap-4">
        {items.map((m) => (
          <li
            key={m.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-medium">{m.name}</p>
              <p className="text-gray-600 text-sm">
                {m.available ? "✅ Available" : "❌ Not Available"}
              </p>
            </div>

            <p className="text-right font-semibold text-blue-600">
              ${Number(m.price).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
