"use client";

import { useAppSelector } from "../../store/hooks";
import TableCard from "./components/TableCard";

export default function WaiterDashboard() {
  const tables = useAppSelector((state) => state.tables.list);

  return (
    <div className="container">
      <h2 className="text-2xl font-bold mb-4">Tables</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tables.map((table) => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}
