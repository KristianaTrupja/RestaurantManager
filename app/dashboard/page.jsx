"use client";
import { useState, useEffect } from "react";
import CreateMenu from "../src/components/CreateMenu";
import MenuItems from "../src/components/MenuItems";
import CreateTables from "../src/components/CreateTables";
import ListTables from "../src/components/ListTables";
import CreateWaiter from "../src/components/CreateWaiter";
import ListWaiters from "../src/components/ListWaiters";
import CreateOrder from "../src/components/CreateOrder";
import ListOrders from "../src/components/ListOrders";

export default function Dashboard() {
  const [waiterName, setWaiterName] = useState("");
  const [activePage, setActivePage] = useState("ListTables");
  const [selectedTable, setSelectedTable] = useState(null); // for preselecting table

  useEffect(() => {
    const waiter = localStorage.getItem("waiter");
    if (waiter) setWaiterName(JSON.parse(waiter).name);
  }, []);

  const pages = {
    ListTables: (
      <ListTables
        onCreateOrder={(table) => {
          setSelectedTable(table);
          setActivePage("CreateOrder");
        }}
      />
    ),
    ListOrders: <ListOrders />,
    ListWaiters: <ListWaiters />,
    MenuItems: <MenuItems />,
    CreateMenu: <CreateMenu />,
    CreateTables: <CreateTables />,
    CreateWaiter: <CreateWaiter />,
    CreateOrder: <CreateOrder preSelectedTable={selectedTable} />,
  };

  return (
    <div className="flex h-screen">
      {/* Left navigation */}
      <nav className="w-64 bg-gray-100 p-4 border-r border-gray-300">
        <h2 className="text-lg font-bold mb-4">Welcome, {waiterName}</h2>
        <ul className="flex flex-col gap-2">
          {Object.keys(pages).map((page) => (
            <li key={page}>
              <button
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-200 ${
                  activePage === page ? "bg-gray-300 font-semibold" : ""
                }`}
                onClick={() => setActivePage(page)}
              >
                {page.replace(/([A-Z])/g, " $1").trim()}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right content */}
      <main className="flex-1 p-6 overflow-auto max-w-4xl m-auto">{pages[activePage]}</main>
    </div>
  );
}
