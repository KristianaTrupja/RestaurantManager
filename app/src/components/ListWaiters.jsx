"use client";
import { useEffect, useState } from "react";
import API from "../api/api";

export default function ListWaiters() {
  const [waiters, setWaiters] = useState([]);

  useEffect(() => {
    API.get("/waiters").then((res) => setWaiters(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6">Waiters</h3>

      <ul className="flex flex-col gap-4">
        {waiters.map((w) => (
          <li
            key={w.id}
            className="border border-gray-200 shadow-sm rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold text-lg">{w.name}</p>
              <p className="text-gray-600 text-sm">@{w.username}</p>
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
