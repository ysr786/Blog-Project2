import PostCard from "@/components/PostCard";
import { PostCard as IPostCard } from "@/types";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

async function getPosts(tag?: string, search?: string): Promise<IPostCard[]> {
  await connectDB();
  const query: Record<string, unknown> = { status: "published" };
  if (tag) query.tags = tag;
  if (search) query.$text = { $search: search };
  const posts = await Post.find(query).populate("author", "name avatar").sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(posts));
}

async function getAllTags(): Promise<string[]> {
  await connectDB();
  const posts = await Post.find({ status: "published" }).select("tags").lean();
  return Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 12);
}

export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string; search?: string }> }) {
  const { tag, search } = await searchParams;
  const [posts, allTags] = await Promise.all([getPosts(tag, search), getAllTags()]);

  const featured = !tag && !search ? posts[0] : null;
  const rest = !tag && !search ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-slate-950">

      {/* Hero */}
      {!tag && !search && (
        <div className="relative overflow-hidden bg-slate-900 border-b border-slate-700/50">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-teal-400 mb-5 animate-fade-in">
              <span className="w-8 h-px bg-teal-400" />
              Welcome to BlogPlatform
              <span className="w-8 h-px bg-teal-400" />
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-100 leading-tight mb-5 animate-fade-in-up">
              Ideas worth{" "}
              <span className="shimmer-text">reading</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 animate-fade-in-up delay-100">
              Discover stories, insights, and perspectives from writers on topics that matter to you.
            </p>
            <div className="flex justify-center animate-fade-in-up delay-200">
              <SearchBar />
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in-up delay-300">
              {[
                { label: "Posts", value: posts.length },
                { label: "Topics", value: allTags.length },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-teal-400">{value}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* Tag pills */}
        {allTags.length > 0 && !search && (
          <div className="flex items-center gap-2 flex-wrap animate-fade-in">
            <Link
              href="/"
              className={`text-sm px-4 py-1.5 rounded-full border transition-all duration-200 ${
                !tag
                  ? "bg-teal-500 text-slate-900 border-teal-500 font-semibold shadow-lg shadow-teal-500/25"
                  : "border-slate-600 text-slate-400 hover:border-teal-500/60 hover:text-teal-400 hover:bg-teal-500/10"
              }`}
            >
              All
            </Link>
            {allTags.map((t, i) => (
              <Link
                key={t}
                href={`/?tag=${t}`}
                className={`text-sm px-4 py-1.5 rounded-full border transition-all duration-200 animate-fade-in delay-${Math.min(i * 100, 400)} ${
                  tag === t
                    ? "bg-teal-500 text-slate-900 border-teal-500 font-semibold shadow-lg shadow-teal-500/25"
                    : "border-slate-600 text-slate-400 hover:border-teal-500/60 hover:text-teal-400 hover:bg-teal-500/10"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        {/* Search / tag header */}
        {(tag || search) && (
          <div className="flex items-center justify-between animate-fade-in">
            <div>
              {search && (
                <p className="text-slate-400">
                  Results for{" "}
                  <span className="font-semibold text-teal-300">"{search}"</span>
                  <span className="ml-2 text-sm text-slate-500">({posts.length} post{posts.length !== 1 ? "s" : ""})</span>
                </p>
              )}
              {tag && (
                <p className="text-slate-400">
                  Posts tagged{" "}
                  <span className="font-semibold text-teal-400">#{tag}</span>
                  <span className="ml-2 text-sm text-slate-500">({posts.length} post{posts.length !== 1 ? "s" : ""})</span>
                </p>
              )}
            </div>
            <Link href="/" className="text-sm text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </Link>
          </div>
        )}

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5 animate-float">
              <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-semibold text-slate-300 text-lg">No posts found</p>
            <p className="text-slate-500 text-sm mt-1">Try a different search or browse all posts</p>
            <Link href="/" className="mt-5 text-sm text-teal-400 hover:text-teal-300 transition-colors">
              Browse all posts →
            </Link>
          </div>
        )}

        {/* Featured */}
        {featured && (
          <section className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-teal-400 to-cyan-500" />
              <h2 className="font-semibold text-slate-200 tracking-wide">Featured</h2>
              <span className="flex-1 h-px bg-slate-800" />
            </div>
            <PostCard post={featured} featured />
          </section>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <section>
            {featured && (
              <div className="flex items-center gap-3 mb-5">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-rose-400 to-amber-400" />
                <h2 className="font-semibold text-slate-200 tracking-wide">Latest Posts</h2>
                <span className="flex-1 h-px bg-slate-800" />
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <div key={post._id} className={`delay-${Math.min(i * 100, 400)}`}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
