"use client";
import { useState, useEffect } from "react";
import API from "../api/api";

export default function ListTables({ onCreateOrder }) {
  const [tables, setTables] = useState([]);
  const [hoveredTable, setHoveredTable] = useState(null);

  useEffect(() => {
    API.get("/table").then((res) => setTables(res.data));
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Tables</h3>
      <div className="grid grid-cols-4 gap-4">
        {tables.map((t) => (
          <div
            key={t.id}
            className="relative flex items-center justify-center h-40 w-40 rounded-lg cursor-pointer font-bold text-white text-lg transition transform hover:scale-105"
            style={{ backgroundColor: t.status === "FREE" ? "#22c55e" : "#ef4444" }}
            onMouseEnter={() => setHoveredTable(t.id)}
            onMouseLeave={() => setHoveredTable(null)}
          >
            {t.tableNumber}

            {/* Overlay on hover */}
            {hoveredTable === t.id && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
                <span className="text-white mb-2">{t.status === "FREE" ? "Free" : "Taken"}</span>
                {t.status === "FREE" && (
                  <button
                    className="px-2 py-1 bg-blue-500 rounded text-white text-sm hover:bg-blue-600"
                    onClick={() => onCreateOrder(t)}
                  >
                    Create Order
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
