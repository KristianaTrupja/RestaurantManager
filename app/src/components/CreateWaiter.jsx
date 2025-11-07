"use client";
import { useState } from "react";
import API from "../api/api";
import FormWrapper from "./globals/FormWrapper";

export default function CreateWaiter() {
  const [form, setForm] = useState({ name: "", username: "", password: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    API.post("/waiters", form)
      .then(() => alert("Waiter created"))
      .catch(console.error);
  }

  return (
    <FormWrapper title="Add Waiter" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} className="border rounded px-3 py-2 w-full" />
      <input name="username" placeholder="Username" onChange={handleChange} className="border rounded px-3 py-2 w-full" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border rounded px-3 py-2 w-full" />
    </FormWrapper>
  );
}
