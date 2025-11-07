"use client";
import { useState } from "react";
import API from "../api/api";
import FormWrapper from "./globals/FormWrapper";

export default function AddMenuItem() {
  const [form, setForm] = useState({ name: "", category: "", price: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    API.post("/menu", {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      available: true,
    })
      .then(() => alert("Saved"))
      .catch(console.error);
  }

  return (
    <FormWrapper title="Add Menu Item" onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
      />

      <input
        name="category"
        placeholder="Category"
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
      />

      <input
        name="price"
        placeholder="Price"
        type="number"
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
      />
    </FormWrapper>
  );
}
