"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = [
  {
    value: "reader",
    label: "Reader",
    description: "Browse and comment on posts",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    value: "author",
    label: "Author",
    description: "Write and publish your own posts",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "reader" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl pointer-events-none animate-float delay-300" />

      <div className="w-full max-w-md relative animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold shimmer-text">BlogPlatform</h1>
          </Link>
          <p className="mt-2 text-slate-500">Join thousands of readers and writers</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl shadow-slate-950/50">
          <h2 className="text-2xl font-semibold mb-6 text-slate-100">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-sm animate-fade-in">
                {error}
              </div>
            )}

            {[
              { label: "Full Name", field: "name", type: "text", placeholder: "John Doe" },
              { label: "Email Address", field: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", field: "password", type: "password", placeholder: "••••••••" },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-2 text-slate-400">{label}</label>
                <input
                  type={type}
                  value={(form as any)[field]}
                  onChange={(e) => set(field, e.target.value)}
                  required
                  placeholder={placeholder}
                  minLength={field === "password" ? 6 : undefined}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-3 text-slate-400">I want to join as</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => set("role", r.value)}
                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      form.role === r.value
                        ? "border-teal-500 bg-teal-500/10 text-teal-300 shadow-lg shadow-teal-500/10"
                        : "border-slate-700 hover:border-slate-600 text-slate-400 hover:bg-slate-800/50"
                    }`}
                  >
                    <span className={form.role === r.value ? "text-teal-400" : "text-slate-500"}>
                      {r.icon}
                    </span>
                    <span className="font-semibold text-sm">{r.label}</span>
                    <span className="text-xs text-slate-500 leading-tight">{r.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-900 font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account…
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-teal-400 hover:text-teal-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
