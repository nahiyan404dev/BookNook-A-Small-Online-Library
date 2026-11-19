import Link from "next/link";
import { ArrowLeft, BookX } from "lucide-react";

export default function BookNotFound() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-16 transition-colors sm:px-6 dark:bg-[#141126]">
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-[#e9e4dc] bg-white px-6 py-14 text-center shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-[#f4f1ea] text-[#183d32] dark:bg-white/5 dark:text-[#C4B5FD]">
          <BookX size={26} />
        </span>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#19152B] dark:text-white">
          Book not found
        </h1>

        <p className="mt-2 max-w-sm text-sm text-[#6B7280] dark:text-white/55">
          This title may have been removed from the shelf, or the link you
          followed is incorrect.
        </p>

        <Link
          href="/allbooks"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#183d32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f2b23]"
        >
          <ArrowLeft size={16} />
          Back to all books
        </Link>
      </div>
    </main>
  );
}
