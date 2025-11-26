"use client";

import { useAppSelector } from "@/app/store/hooks";
import TableModal from "@/app/(waiter)/waiter-dashboard/components/TablePopup";
import CartModal from "@/app/(client)/dashboard/components/CartModal";
import AddMenuItem from "../(admin)/inventory/components/AddMenuItem";
import BillModal from "../(client)/dashboard/components/BillModal";

export default function ModalRenderer() {
  const { isOpen, type } = useAppSelector((state) => state.modal);

  if (!isOpen) return null;

  if (type === "table") return <TableModal />;
  if (type === "cart") return <CartModal />;
  if( type === "createMenuItem") return <AddMenuItem />;
  if( type === "bill") return <BillModal />;

  return null;
}
