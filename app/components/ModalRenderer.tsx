"use client";

import { useAppSelector } from "@/app/store/hooks";
import TableModal from "@/app/(waiter)/waiter-dashboard/components/TablePopup";
import CartModal from "@/app/(client)/dashboard/components/CartModal";
import AddMenuItem from "../(admin)/admin-dashboard/components/AddMenuItem";
import BillModal from "../(client)/dashboard/components/BillModal";
import CreateUserModal from "../(admin)/admin-dashboard/components/CreateUserModal";

export default function ModalRenderer() {
  const { isOpen, type } = useAppSelector((state) => state.modal);

  if (!isOpen) return null;

  if (type === "table") return <TableModal />;
  if (type === "cart") return <CartModal />;
  if (type === "createMenuItem") return <AddMenuItem />;
  if (type === "bill") return <BillModal />;
  if (type === "createUser") return <CreateUserModal />;

  return null;
}
