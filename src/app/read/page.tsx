import { Suspense } from "react";
import type { Metadata } from "next";

import ReadingHub from "@/components/reading/ReadingHub";
import ReadingHubSkeleton from "@/components/reading/ReadingHubSkeleton";
import type { Book } from "@/lib/books";
import { getBooks } from "@/lib/books-api";

export const metadata: Metadata = {
  title: "Read Books — BookNook",
  description:
    "Your reading room: continue where you left off, track borrowed books, and pick your next read.",
};

async function ReadingHubContent() {
  let books: Book[] = [];
  let error: string | null = null;

  try {
    books = await getBooks();
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Something went wrong while fetching the collection.";
  }

  return <ReadingHub books={books} error={error} />;
}

/**
 * Public reading hub. The catalogue streams in behind the skeleton, then the
 * client joins it with reading progress, loans, and the saved shelf.
 */
export default function ReadBooksPage() {
  return (
    <Suspense fallback={<ReadingHubSkeleton />}>
      <ReadingHubContent />
    </Suspense>
  );
}
