
"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl">Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={reset} className="mt-4 btn btn-primary">
        Try Again
      </button>
    </div>
  );
}
