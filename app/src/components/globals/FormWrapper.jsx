"use client";

import Button from "./Button";

export default function FormWrapper({ title, children, onSubmit, buttonText }) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-6 w-full bg-white shadow-md rounded-lg flex flex-col gap-4"
    >
      {title && <h2 className="text-3xl font-bold mb-8 text-gray-800">{title}</h2>}
      {children}
      <Button
        type="submit"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}
