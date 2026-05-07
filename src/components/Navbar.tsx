"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <nav className="border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="font-bold text-xl shimmer-text">
        BlogPlatform
      </Link>
      <div className="flex items-center gap-5 text-sm">
        {user ? (
          <>
            <Link href="/dashboard" className="text-slate-400 hover:text-teal-400 transition-colors duration-200">
              Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold animate-pulse-ring">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-slate-400 hover:text-teal-400 font-medium transition-colors duration-200 cursor-default">
                {user.name}
              </span>
            </div>
            <button
              onClick={() => signOut()}
              className="text-slate-400 hover:text-rose-400 cursor-pointer transition-colors duration-200"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-slate-400 hover:text-teal-400 transition-colors duration-200">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-900 font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
