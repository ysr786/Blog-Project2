"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PostCard as IPostCard } from "@/types";

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4 hover:border-${color}-500/40 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up`}>
      <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-${color}-400 shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<IPostCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const user = session?.user as any;
  const isAuthor = user?.role === "author";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const url = isAuthor ? "/api/posts?mine=1" : "/api/posts";
    fetch(url).then((r) => r.json()).then((data) => { setPosts(data); setLoading(false); });
  }, [status, isAuthor]);

  async function deletePost(slug: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeletingSlug(slug);
    const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
    if (res.ok) setPosts((p) => p.filter((post) => post.slug !== slug));
    setDeletingSlug(null);
  }

  const filtered = isAuthor ? (filter === "all" ? posts : posts.filter((p) => p.status === filter)) : posts;
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const totalLikes = posts.reduce((sum, p) => sum + p.likes.length, 0);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-teal-500/30 border-t-teal-400 animate-spin" />
          <p className="text-slate-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-rose-500/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-13 h-13 rounded-full bg-gradient-to-br from-teal-400 via-cyan-400 to-rose-500 p-0.5 animate-pulse-ring">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-teal-300 font-bold text-xl">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">
                  Welcome back, <span className="text-teal-400">{user?.name}</span>
                </h1>
                <p className="text-sm text-slate-500 capitalize">{user?.role} account</p>
              </div>
            </div>
            {isAuthor && (
              <Link
                href="/posts/new"
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                New Post
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        {isAuthor && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Posts" value={posts.length} color="teal" icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            } />
            <StatCard label="Published" value={published} color="cyan" icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } />
            <StatCard label="Drafts" value={drafts} color="amber" icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            } />
            <StatCard label="Total Likes" value={totalLikes} color="rose" icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            } />
          </div>
        )}

        {/* Posts panel */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
            <h2 className="font-semibold text-slate-200">{isAuthor ? "My Posts" : "All Posts"}</h2>
            {isAuthor && (
              <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
                {(["all", "published", "draft"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all duration-200 cursor-pointer ${
                      filter === f
                        ? "bg-teal-500 text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 animate-float">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-medium text-slate-400">No posts found</p>
              <p className="text-sm text-slate-600 mt-1">{isAuthor ? "Start writing your first post" : "Check back later"}</p>
              {isAuthor && (
                <Link href="/posts/new" className="mt-4 text-sm text-teal-400 hover:text-teal-300 transition-colors">
                  Create a post →
                </Link>
              )}
            </div>
          ) : isAuthor ? (
            <div className="divide-y divide-slate-800/80">
              {filtered.map((post) => (
                <div key={post._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/40 transition-colors duration-200 group">
                  {post.coverImage ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-1 ring-slate-700">
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-900/60 to-cyan-900/60 border border-slate-700 shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={`/posts/${post.slug}`} className="font-medium text-slate-200 hover:text-teal-400 transition-colors line-clamp-1">
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        post.status === "published"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${post.status === "published" ? "bg-teal-400" : "bg-amber-400"}`} />
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="text-xs text-rose-400/70 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        {post.likes.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0">
                    <Link
                      href={`/posts/${post.slug}/edit`}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-teal-500/30 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePost(post.slug)}
                      disabled={deletingSlug === post.slug}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-rose-500/30 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {deletingSlug === post.slug ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
              {filtered.map((post) => (
                <article key={post._id} className="group bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300">
                  {post.coverImage ? (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-teal-900/40 to-rose-900/40 flex items-center justify-center">
                      <svg className="w-10 h-10 text-teal-700/50 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex gap-1.5 flex-wrap mb-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <Link href={`/posts/${post.slug}`} className="font-semibold text-slate-200 hover:text-teal-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </Link>
                    <p className="text-slate-500 text-sm line-clamp-2 mt-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                      <span>{post.author.name}</span>
                      <span className="flex items-center gap-1 text-rose-400/70">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        {post.likes.length}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
