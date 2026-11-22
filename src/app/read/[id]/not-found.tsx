import Link from "next/link";
import { BookOpen, Home, Library } from "lucide-react";

export default function ReadingNotFound() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-16 transition-colors dark:bg-[#141126]">
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-[#e9e4dc] bg-white px-6 py-14 text-center shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-[#eef5f0] text-[#183d32] dark:bg-emerald-400/10 dark:text-emerald-200">
          <BookOpen size={26} aria-hidden="true" />
        </span>

        <h1 className="mt-4 text-xl font-bold text-[#19152B] dark:text-white">
          This book isn&apos;t on the shelf
        </h1>
        <p className="mt-2 max-w-sm text-sm text-[#6B7280] dark:text-white/55">
          The reading page could not find that title. It may have been removed,
          or the link might be out of date.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/allbooks"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#183d32] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0f2b23] dark:bg-[#276F4C] dark:hover:bg-[#22594a]"
          >
            <Library size={14} aria-hidden="true" />
            Browse all books
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e4dc] bg-white px-4 py-2 text-xs font-semibold text-[#183d32] transition-colors hover:border-[#183d32]/40 hover:bg-[#f7f4ec] dark:border-white/10 dark:bg-white/5 dark:text-[#9BE7B8] dark:hover:bg-white/10"
          >
            <Home size={14} aria-hidden="true" />
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
