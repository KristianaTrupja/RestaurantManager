"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ChooseTablePage() {
  const router = useRouter();
  const params = useSearchParams();
  const guestId = params.get("guestId");

  const handleSelectTable = (tableId: number) => {
    router.push(`/dashboard?tableId=${tableId}&guestId=${guestId}`);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Select a Table</h1>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((t) => (
          <Button key={t} onClick={() => handleSelectTable(t)}>
            Table {t}
          </Button>
        ))}
      </div>
    </div>
  );
}
