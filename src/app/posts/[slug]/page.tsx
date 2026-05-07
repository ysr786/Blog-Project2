import { notFound } from "next/navigation";
import Image from "next/image";
import { PostFull } from "@/types";
import LikeButton from "@/components/LikeButton";
import CommentsSection from "@/components/CommentsSection";
import { auth } from "@/auth";
import Link from "next/link";
import DeletePostButton from "@/components/DeletePostButton";

async function getPost(slug: string): Promise<PostFull | null> {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, session] = await Promise.all([getPost(slug), auth()]);
  if (!post) notFound();

  const userId = (session?.user as any)?.id ?? null;
  const isAuthor = userId && post.author._id === userId;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Cover image hero */}
      {post.coverImage ? (
        <div className="relative w-full h-[420px] overflow-hidden">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          {/* Back link */}
          <div className="absolute top-6 left-6">
            <Link href="/" className="flex items-center gap-2 text-sm text-slate-300 hover:text-teal-400 transition-colors bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700/50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-32 bg-gradient-to-r from-teal-900/40 via-slate-900 to-rose-900/40 border-b border-slate-800">
          <div className="absolute top-6 left-6 max-w-6xl mx-auto">
            <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to posts
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-20">
        {/* Post card */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/80 animate-fade-in-up">
          <div className="p-8 sm:p-10">
            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-5">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${tag}`}
                  className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1 rounded-full hover:bg-teal-500/20 hover:border-teal-400/40 transition-all duration-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-6 mb-8 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-900 font-bold text-sm shrink-0">
                  {post.author.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{post.author.name}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <LikeButton slug={slug} initialLikes={post.likes.length} initialLiked={post.likes.includes(userId)} />
                {isAuthor && (
                  <>
                    <Link
                      href={`/posts/${slug}/edit`}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-teal-500/30 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </Link>
                    <DeletePostButton slug={slug} />
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-invert prose-slate max-w-none
                prose-headings:text-slate-100 prose-headings:font-bold
                prose-p:text-slate-300 prose-p:leading-relaxed
                prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-200
                prose-code:text-teal-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
                prose-blockquote:border-teal-500 prose-blockquote:text-slate-400 prose-blockquote:bg-slate-800/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                prose-img:rounded-xl prose-img:border prose-img:border-slate-700
                prose-hr:border-slate-700
                prose-li:text-slate-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* Comments */}
        <div className="mt-8 animate-fade-in-up delay-200">
          <CommentsSection slug={slug} userId={userId} />
        </div>
      </div>
    </div>
  );
}
