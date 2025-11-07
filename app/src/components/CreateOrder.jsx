"use client";
import { useState, useEffect } from "react";
import API from "../api/api";
import FormWrapper from "./globals/FormWrapper";

export default function CreateOrder({ preSelectedTable }) {
  const [waiters, setWaiters] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [waiterId, setWaiterId] = useState("");
  const [tableId, setTableId] = useState(preSelectedTable?.id || "");
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/waiters").then((r) => setWaiters(r.data));
    API.get("/table").then((r) => setTables(r.data));
    API.get("/menu").then((r) => setMenuItems(r.data));
  }, []);
console.log(items,"items");
  // Add a new item
  const addItem = () => {
    setItems([...items, { menuItemId: "", quantity: 1 }]);
  };

  // Update item
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Remove item
  const removeItem = (index) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    API.post("/order", {
      table: { id: tableId },
      waiter: { id: waiterId },
      items: items.map((it) => ({
        menuItem: { id: it.menuItemId },
        quantity: it.quantity,
      }))
    })
      .then(() => alert("Order created"))
      .catch(console.error);
  };

  return (
    <FormWrapper title="Create Order" onSubmit={handleSubmit}>
      
      {/* Waiter */}
      <select
        value={waiterId}
        onChange={(e) => setWaiterId(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="">-- Select Waiter --</option>
        {waiters.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>

      {/* Table */}
      <select
        value={tableId}
        onChange={(e) => setTableId(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="">-- Select Table --</option>
        {tables.map((t) => (
          <option key={t.id} value={t.id}>
            Table {t.tableNumber}
          </option>
        ))}
      </select>

      {/* Order Items */}
      <div className="flex flex-col gap-4">
        <h4 className="font-semibold">Items</h4>

        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center">

            {/* Menu item selector */}
            <select
              value={item.menuItemId}
              onChange={(e) => updateItem(idx, "menuItemId", e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">-- Select Item --</option>
              {menuItems.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — ${m.price}
                </option>
              ))}
            </select>

            {/* Quantity */}
            <input
              type="number"
              min={1}
              className="w-20 border rounded px-2 py-2"
              value={item.quantity}
              onChange={(e) => updateItem(idx, "quantity", e.target.value)}
            />

            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-red-500 font-bold text-xl"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Item
        </button>
      </div>
    </FormWrapper>
  );
}
