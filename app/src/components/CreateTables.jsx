"use client";
import { useState } from "react";
import API from "../api/api";
import FormWrapper from "./globals/FormWrapper";

export default function CreateTable() {
  const [tableNumber, setTableNumber] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    API.post("/table", { tableNumber, status: "FREE" })
      .then(() => alert("Table created"))
      .catch(console.error);
  }

  return (
    <FormWrapper title="Add Table" onSubmit={handleSubmit}>
      <input
        placeholder="Table Number"
        type="number"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
    </FormWrapper>
  );
}
