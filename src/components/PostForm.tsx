"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RichEditor from "./RichEditor";
import Image from "next/image";

interface PostFormData {
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  status: "draft" | "published";
  coverImage: string;
}

interface Props {
  initial?: Partial<PostFormData>;
  slug?: string;
}

const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200";
const labelClass = "block text-sm font-medium mb-2 text-slate-400";

export default function PostForm({ initial, slug }: Props) {
  const [form, setForm] = useState<PostFormData>({
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    tags: initial?.tags ?? "",
    status: initial?.status ?? "draft",
    coverImage: initial?.coverImage ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function set(field: keyof PostFormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64: reader.result }),
        });
        setUploading(false);
        if (res.ok) {
          const { url } = await res.json();
          set("coverImage", url);
        } else {
          const data = await res.json();
          setError(data.error ?? "Upload failed");
        }
      } catch {
        setUploading(false);
        setError("Upload failed");
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const res = await fetch(slug ? `/api/posts/${slug}` : "/api/posts", {
      method: slug ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
    } else {
      const post = await res.json();
      router.push(`/posts/${post.slug}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-sm animate-fade-in">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className={labelClass}>Post Title</label>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
          placeholder="Give your post a compelling title…"
          className={`${inputClass} text-lg font-semibold`}
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelClass}>
          Excerpt
          <span className="ml-2 text-xs text-slate-600 font-normal">({form.excerpt.length}/300)</span>
        </label>
        <textarea
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          required
          rows={2}
          maxLength={300}
          placeholder="A short summary that appears in post listings…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className={labelClass}>Cover Image</label>
        {form.coverImage ? (
          <div className="relative rounded-xl overflow-hidden border border-slate-700 group">
            <div className="relative w-full h-52">
              <Image src={form.coverImage} alt="Cover preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold text-sm rounded-lg cursor-pointer transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Replace
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => set("coverImage", "")}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-500/80 hover:bg-rose-500 text-white font-semibold text-sm rounded-lg cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
            <div className="px-4 py-2 bg-slate-800/80 border-t border-slate-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-teal-400 font-medium">Cover image uploaded</span>
            </div>
          </div>
        ) : (
          <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            uploading
              ? "border-teal-500/50 bg-teal-500/5"
              : "border-slate-700 bg-slate-800/30 hover:border-teal-500/50 hover:bg-teal-500/5"
          }`}>
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-teal-500/30 border-t-teal-400 animate-spin" />
                <span className="text-sm text-teal-400">Uploading…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Click to upload cover image</span>
                <span className="text-xs text-slate-600">PNG, JPG, WEBP up to 10MB</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass}>Tags</label>
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <input
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="nextjs, react, webdev"
            className={`${inputClass} pl-10`}
          />
        </div>
        {form.tags && (
          <div className="flex gap-1.5 flex-wrap mt-2">
            {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
              <span key={tag} className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <label className={labelClass}>Content</label>
        <RichEditor content={form.content} onChange={(html) => set("content", html)} />
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Publish as:</span>
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            {(["draft", "published"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("status", s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-200 cursor-pointer ${
                  form.status === s
                    ? s === "published"
                      ? "bg-teal-500 text-slate-900 shadow-sm"
                      : "bg-amber-500/80 text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {s === "published" ? "✓ Published" : "✎ Draft"}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-900 font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={slug ? "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" : "M12 4v16m8-8H4"} />
              </svg>
              {slug ? "Update Post" : "Create Post"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
