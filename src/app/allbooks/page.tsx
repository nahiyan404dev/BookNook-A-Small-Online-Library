import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Library, BookX, Search, TriangleAlert } from "lucide-react";

import BookCard from "@/components/BookCard";
import { searchBooks, type Book } from "@/lib/books";
import { getBooks } from "@/lib/books-api";

export const metadata: Metadata = {
  title: "All Books — BookNook",
  description:
    "Browse every title in the BookNook collection — read, borrow, and explore.",
};



function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-[#e9e4dc] bg-white p-3 dark:border-white/10 dark:bg-[#1F1A33]"
        >
          <div className="aspect-3/4 bg-[#f1ede5] dark:bg-white/5" />
          <div className="mt-4 h-4 w-4/5 bg-[#f1ede5] dark:bg-white/5" />
          <div className="mt-2 h-3 w-2/5  bg-[#f1ede5] dark:bg-white/5" />
          <div className="mt-5 flex items-center justify-between">
            <div className="h-6 w-16  bg-[#f1ede5] dark:bg-white/5" />
            <div className="h-6 w-10  bg-[#f1ede5] dark:bg-white/5" />
          </div>
          <div className="mt-4 h-9 w-full  bg-[#f1ede5] dark:bg-white/5" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center  border border-dashed border-[#e9e4dc] bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#1F1A33]">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#f4f1ea] text-[#183d32] dark:bg-white/5 dark:text-[#C4B5FD]">
        <BookX size={26} />
      </span>
      <h2 className="mt-4 text-lg font-bold text-[#19152B] dark:text-white">
        No books yet
      </h2>
      <p className="mt-1 max-w-sm text-sm text-[#6B7280] dark:text-white/55">
        The shelves are empty right now. Add the first book and it will show up
        here.
      </p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-[#e9e4dc] bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#1F1A33]">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#f4f1ea] text-[#183d32] dark:bg-white/5 dark:text-[#C4B5FD]">
        <Search size={26} />
      </span>
      <h2 className="mt-4 text-lg font-bold text-[#19152B] dark:text-white">
        No books found
      </h2>
      <p className="mt-1 max-w-md text-sm text-[#6B7280] dark:text-white/55">
        Nothing on the shelves matches “{query}”. Try a different title, author,
        or category.
      </p>
      <Link
        href="/allbooks"
        className="mt-5 rounded-full bg-[#183d32] px-5 py-2 text-xs font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#0f2b23] dark:bg-[#276F4C] dark:hover:bg-[#22594a]"
      >
        Clear search
      </Link>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-[#f3d6d6] bg-[#fdf5f5] px-6 py-16 text-center dark:border-red-400/20 dark:bg-red-400/5">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#fbe6e6] text-[#b42318] dark:bg-red-400/10 dark:text-red-300">
        <TriangleAlert size={26} />
      </span>
      <h2 className="mt-4 text-lg font-bold text-[#19152B] dark:text-white">
        Couldn&apos;t load the books
      </h2>
      <p className="mt-1 max-w-md text-sm text-[#6B7280] dark:text-white/55">
        {message} Make sure the books service is running on port 5000, then
        refresh the page.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- book list */

type BooksSearchParams = {
  q?: string | string[];
};

function readQuery(params?: BooksSearchParams): string {
  const value = Array.isArray(params?.q) ? params?.q[0] : params?.q;
  return (value ?? "").trim();
}

async function BookGrid({
  searchParams,
}: {
  searchParams?: Promise<BooksSearchParams>;
}) {
  const query = readQuery(await searchParams);
  let books: Book[] = [];
  let error: string | null = null;

  try {
    const allBooks = await getBooks();
    books = searchBooks(allBooks, query);
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Something went wrong while fetching the collection.";
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (books.length === 0) {
    return query ? <NoResults query={query} /> : <EmptyState />;
  }

  return (
    <section aria-label={query ? `Search results for ${query}` : "All books"}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-[#6B7280] dark:text-white/55">
          {query
            ? `${books.length} ${books.length === 1 ? "result" : "results"} for “${query}”`
            : `${books.length} ${books.length === 1 ? "book" : "books"} on the shelf`}
        </p>

        {query ? (
          <Link
            href="/allbooks"
            className="text-xs font-bold tracking-wide text-[#183d32] uppercase transition-colors hover:text-[#276F4C] dark:text-[#9BE7B8] dark:hover:text-white"
          >
            Clear search
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ page */

type AllBooksPageProps = {
  searchParams?: Promise<BooksSearchParams>;
};

export default function AllBooksPage({ searchParams }: AllBooksPageProps) {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 transition-colors sm:px-6 sm:py-10 lg:px-8 dark:bg-[#141126]">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8 flex flex-col gap-3 sm:mb-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e9e4dc] bg-white px-3 py-1 text-[11px] font-semibold tracking-[1.5px] text-[#183d32] uppercase dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD]">
            <Library size={13} />
            The collection
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#19152B] sm:text-4xl dark:text-white">
            All Books
          </h1>

          <p className="max-w-xl text-sm text-[#6B7280] sm:text-base dark:text-white/60">
            Every title in the BookNook library, from timeless classics to your
            next modern favourite. Pick one up and start reading.
          </p>
        </header>

        <Suspense fallback={<BookGridSkeleton />}>
          <BookGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
