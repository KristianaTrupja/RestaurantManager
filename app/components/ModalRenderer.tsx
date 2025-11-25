"use client";

import { useAppSelector } from "@/app/store/hooks";
import TableModal from "@/app/(waiter)/waiter-dashboard/components/TablePopup";
import CartModal from "@/app/(client)/dashboard/components/CartModal";

export default function ModalRenderer() {
  const { isOpen, type } = useAppSelector((state) => state.modal);

  if (!isOpen) return null;

  if (type === "table") return <TableModal />;
  if (type === "cart") return <CartModal />;

  return null;
}
