"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("search", value.trim());
    router.push(`/?${params}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <svg className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search posts…"
        className="pl-9 pr-16 py-2.5 text-sm border border-slate-600/60 rounded-xl bg-slate-800/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 w-64"
      />
      {value && (
        <button
          type="submit"
          className="absolute right-2 text-xs px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold rounded-lg transition-all duration-200 cursor-pointer"
        >
          Go
        </button>
      )}
    </form>
  );
}
