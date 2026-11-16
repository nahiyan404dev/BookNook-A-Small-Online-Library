"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";

import AuthAside from "@/components/auth/AuthAside";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.11A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.29a12 12 0 0 0 0 10.78l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.61l4 3.11C6.23 6.88 8.88 4.77 12 4.77Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .3a12 12 0 0 0-3.8 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.92.43.38.82 1.11.82 2.24v3.32c0 .32.21.7.82.58A12 12 0 0 0 12 .3Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F4FA]">
      <AuthAside />

      {/* Login Form */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5426B8] text-white">
              <BookOpen size={23} strokeWidth={2.2} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#19152B]">
              Book<span className="text-[#5426B8]">Nook</span>
            </h1>
          </Link>

          <div className="rounded-2xl border border-[#EAE7F2] bg-white p-6 shadow-xl shadow-purple-100/50 sm:p-8">
            <h2 className="text-2xl font-bold text-[#19152B]">Welcome back</h2>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to continue to your reading space.
            </p>

            {/* Social Sign-in */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 rounded-xl border border-[#dcd6cc] bg-white px-4 py-2.5 text-sm font-semibold text-[#19152B] transition-all hover:border-[#5426B8]/50 hover:bg-[#F1EAFF]/50"
              >
                <GoogleIcon />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 rounded-xl border border-[#dcd6cc] bg-white px-4 py-2.5 text-sm font-semibold text-[#19152B] transition-all hover:border-[#5426B8]/50 hover:bg-[#F1EAFF]/50"
              >
                <GitHubIcon />
                GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#EAE7F2]" />
              <span className="text-xs font-medium text-gray-400">
                or continue with email
              </span>
              <div className="h-px flex-1 bg-[#EAE7F2]" />
            </div>

            {/* Email + Password */}
            <form className="space-y-4" action="/">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-[#19152B]"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-xl border border-[#dcd6cc] bg-white pl-10 pr-4 text-sm text-[#19152B] outline-none transition-all placeholder:text-gray-400 focus:border-[#5426B8] focus:ring-2 focus:ring-[#5426B8]/20"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#19152B]"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#5426B8] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-[#dcd6cc] bg-white pl-10 pr-11 text-sm text-[#19152B] outline-none transition-all placeholder:text-gray-400 focus:border-[#5426B8] focus:ring-2 focus:ring-[#5426B8]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#5426B8]"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#5426B8] text-sm font-semibold text-white shadow-md shadow-purple-200 transition-all hover:bg-[#451D96]"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              New to BookNook?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#5426B8] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
