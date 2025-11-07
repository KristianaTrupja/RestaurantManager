"use client";
import { useEffect, useState } from "react";
import API from "../api/api";

export default function ListOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6">Orders</h3>

      <ul className="flex flex-col gap-4">
        {orders.map((o) => (
          <li
            key={o.id}
            className="border border-gray-200 shadow-sm rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold">Order #{o.id}</p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={
                    o.status === "DONE"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {o.status}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Table: {o.table?.tableNumber ?? "—"}
              </p>
            </div>

            <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
