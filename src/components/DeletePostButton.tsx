"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard");
    else setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-rose-500/30 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
