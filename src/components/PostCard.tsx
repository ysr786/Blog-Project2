import Link from "next/link";
import Image from "next/image";
import { PostCard as IPostCard } from "@/types";

export default function PostCard({ post, featured = false }: { post: IPostCard; featured?: boolean }) {
  if (featured) {
    return (
      <article className="group relative rounded-2xl overflow-hidden h-[440px] flex flex-col justify-end animate-fade-in">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-slate-900 to-rose-900 animate-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="relative p-8">
          <div className="flex gap-2 flex-wrap mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/?tag=${tag}`}
                className="text-xs bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm transition-all duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>
          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-3xl font-bold text-white leading-snug group-hover:text-teal-300 transition-colors duration-300 mb-2">
              {post.title}
            </h2>
          </Link>
          <p className="text-slate-300 text-sm line-clamp-2 mb-5">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-900 font-bold text-xs">
                {post.author.name[0].toUpperCase()}
              </div>
              <span className="text-slate-300 font-medium">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-rose-400">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                {post.likes.length}
              </span>
              <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1.5 transition-all duration-300 animate-fade-in-up">
      <Link href={`/posts/${post.slug}`}>
        <div className="relative h-44 w-full overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-900/60 via-slate-800 to-rose-900/60 flex items-center justify-center">
              <svg className="w-10 h-10 text-teal-600/50 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex gap-1.5 flex-wrap mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${tag}`}
              className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-0.5 rounded-full hover:bg-teal-500/20 hover:border-teal-400/40 transition-all duration-200"
            >
              {tag}
            </Link>
          ))}
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h2 className="font-semibold text-base leading-snug text-slate-100 group-hover:text-teal-300 transition-colors duration-200 mb-2 line-clamp-2">
            {post.title}
          </h2>
        </Link>
        <p className="text-slate-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-900 font-bold text-xs shrink-0">
              {post.author.name[0].toUpperCase()}
            </div>
            <span className="text-xs text-slate-400">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-rose-400/70">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {post.likes.length}
            </span>
            <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
