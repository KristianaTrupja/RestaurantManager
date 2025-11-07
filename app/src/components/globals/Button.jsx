"use client";
import { useState } from "react";

export default function Button({
  children,
  onClick,
  className = "",
  disabled = false,
  loading: loadingProp,
  type = "button",
}) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = loadingProp ?? internalLoading;

  async function handleClick(e) {
    if (!onClick) return;
    setInternalLoading(true);
    try {
      await onClick(e);
    } finally {
      setInternalLoading(false);
    }
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`relative px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 
        disabled:opacity-70 disabled:cursor-not-allowed transition ${className}`}
    >
      {loading && (
        <span
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></span>
        </span>
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
}
