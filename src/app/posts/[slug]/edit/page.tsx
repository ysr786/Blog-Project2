import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import PostForm from "@/components/PostForm";
import { PostFull } from "@/types";
import Link from "next/link";

async function getPost(slug: string): Promise<PostFull | null> {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [session, post] = await Promise.all([auth(), getPost(slug)]);

  if (!session?.user) redirect("/login");
  if (!post) notFound();
  if (post.author._id !== (session.user as any).id) redirect("/");

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header bar */}
      <div className="bg-slate-900 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/posts/${slug}`} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-teal-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to post
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-sm text-slate-300 font-medium">Edit Post</span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
            post.status === "published"
              ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}>
            {post.status === "published" ? "● Published" : "✎ Draft"}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Page title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-100 mb-1">Edit Post</h1>
          <p className="text-slate-500 text-sm line-clamp-1">"{post.title}"</p>
        </div>

        {/* Form card */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-slate-950/50 animate-fade-in-up">
          <PostForm
            slug={slug}
            initial={{
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              tags: post.tags.join(", "),
              status: post.status,
              coverImage: post.coverImage,
            }}
          />
        </div>
      </div>
    </div>
  );
}
