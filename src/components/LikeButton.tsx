"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LikeButton({ slug, initialLikes, initialLiked }: { slug: string; initialLikes: number; initialLiked: boolean }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [animating, setAnimating] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  async function toggle() {
    if (!session) return router.push("/login");
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    const res = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setLikes(data.likes);
      setLiked(data.liked);
    }
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
        liked
          ? "bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25"
          : "bg-slate-800 border-slate-700 text-slate-400 hover:border-rose-500/30 hover:text-rose-400"
      }`}
    >
      <svg
        className={`w-4 h-4 transition-transform duration-200 ${animating ? "scale-125" : "scale-100"}`}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="text-sm font-medium">{likes}</span>
    </button>
  );
}
