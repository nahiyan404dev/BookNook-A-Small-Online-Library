"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, Mail } from "lucide-react";

import AuthAside from "@/components/auth/AuthAside";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F4FA]">
      <AuthAside />

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
            {submitted ? (
              // Success state
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1EAFF] text-[#5426B8]">
                  <CheckCircle2 size={30} />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#19152B]">
                  Check your inbox
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  If an account exists for{" "}
                  <span className="font-semibold text-[#19152B]">{email}</span>,
                  we&apos;ve sent a link to reset your password.
                </p>

                <Link
                  href="/login"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#5426B8] text-sm font-semibold text-white shadow-md shadow-purple-200 transition-all hover:bg-[#451D96]"
                >
                  Back to Sign In
                </Link>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-semibold text-gray-500 hover:text-[#5426B8]"
                >
                  Didn&apos;t get it? Try a different email
                </button>
              </div>
            ) : (
              // Request state
              <>
                <h2 className="text-2xl font-bold text-[#19152B]">
                  Forgot your password?
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  No worries — enter your email and we&apos;ll send you a link
                  to reset it.
                </p>

                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-11 w-full rounded-xl border border-[#dcd6cc] bg-white pl-10 pr-4 text-sm text-[#19152B] outline-none transition-all placeholder:text-gray-400 focus:border-[#5426B8] focus:ring-2 focus:ring-[#5426B8]/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-[#5426B8] text-sm font-semibold text-white shadow-md shadow-purple-200 transition-all hover:bg-[#451D96]"
                  >
                    Send Reset Link
                  </button>
                </form>

                <Link
                  href="/login"
                  className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-[#5426B8]"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
