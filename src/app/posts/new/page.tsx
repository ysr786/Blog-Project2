import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PostForm from "@/components/PostForm";
import Link from "next/link";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "author") redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header bar */}
      <div className="bg-slate-900 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-teal-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-sm text-slate-300 font-medium">New Post</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Autosave off
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Page title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-100 mb-1">Create New Post</h1>
          <p className="text-slate-500 text-sm">Fill in the details below to publish your story</p>
        </div>

        {/* Form card */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-slate-950/50 animate-fade-in-up">
          <PostForm />
        </div>
      </div>
    </div>
  );
}
