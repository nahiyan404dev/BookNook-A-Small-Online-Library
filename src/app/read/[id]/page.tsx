import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TriangleAlert } from "lucide-react";

import Reader from "@/components/reader/Reader";
import type { Book } from "@/lib/books";
import { getBook } from "@/lib/books-api";

/* ------------------------------------------------------------ metadata */

export async function generateMetadata({
  params,
}: PageProps<"/read/[id]">): Promise<Metadata> {
  const { id } = await params;

  try {
    const book = await getBook(id);

    if (!book) {
      return { title: "Book not found — BookNook" };
    }

    return {
      title: `Read ${book.name} — BookNook`,
      description:
        book.description?.slice(0, 155) ??
        `Read ${book.name} page by page and track your progress on BookNook.`,
    };
  } catch {
    return { title: "Reading — BookNook" };
  }
}

/* --------------------------------------------------------------- pieces */

function ReadingError({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-16 transition-colors dark:bg-[#141126]">
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-[#f3d6d6] bg-[#fdf5f5] px-6 py-14 text-center dark:border-red-400/20 dark:bg-red-400/5">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-[#fbe6e6] text-[#b42318] dark:bg-red-400/10 dark:text-red-300">
          <TriangleAlert size={26} aria-hidden="true" />
        </span>

        <h1 className="mt-4 text-xl font-bold text-[#19152B] dark:text-white">
          Couldn&apos;t open the reader
        </h1>
        <p className="mt-2 text-sm text-[#6B7280] dark:text-white/55">
          {message} Make sure the books service is running on port 5000, then
          try again.
        </p>

        <Link
          href="/allbooks"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#183d32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f2b23]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to all books
        </Link>
      </div>
    </main>
  );
}

/* ----------------------------------------------------------------- page */

export default async function ReadBookPage({
  params,
}: PageProps<"/read/[id]">) {
  const { id } = await params;

  let book: Book | null = null;
  let error: string | null = null;

  try {
    book = await getBook(id);
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Something went wrong while fetching this book.";
  }

  if (error) {
    return <ReadingError message={error} />;
  }

  if (!book) {
    notFound();
  }

  return <Reader book={book} />;
}
