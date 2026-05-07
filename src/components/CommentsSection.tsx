"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CommentWithAuthor } from "@/types";
import Link from "next/link";

export default function CommentsSection({ slug, userId }: { slug: string; userId: string | null }) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    fetch(`/api/posts/${slug}/comments`).then((r) => r.json()).then(setComments);
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/posts/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    setLoading(false);
    if (res.ok) {
      const comment = await res.json();
      setComments((c) => [...c, comment]);
      setText("");
    }
  }

  return (
    <section className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 sm:px-8 py-5 border-b border-slate-700/50">
        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h2 className="font-semibold text-slate-200">
          Comments
          <span className="ml-2 text-sm font-normal text-slate-500">({comments.length})</span>
        </h2>
      </div>

      <div className="px-6 sm:px-8 py-6 space-y-6">
        {/* Comment form */}
        {session ? (
          <form onSubmit={submit} className="space-y-3">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-900 font-bold text-sm shrink-0 mt-0.5">
                {(session.user?.name ?? "U")[0].toUpperCase()}
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts…"
                rows={3}
                className="flex-1 border border-slate-700 bg-slate-800/80 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 resize-none transition-all duration-200"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-900 font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Posting…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post Comment
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-xl px-5 py-4">
            <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-sm text-slate-400">
              <Link href="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">Sign in</Link>
              {" "}to join the conversation
            </p>
          </div>
        )}

        {/* Comments list */}
        {comments.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3 animate-float">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((c, i) => (
              <div
                key={c._id}
                className={`flex gap-3 animate-fade-in-up`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm shrink-0 mt-0.5 border border-slate-600">
                  {c.author.name[0].toUpperCase()}
                </div>
                <div className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 hover:border-slate-600/50 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-slate-200">{c.author.name}</span>
                    <span className="text-xs text-slate-600">
                      {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
