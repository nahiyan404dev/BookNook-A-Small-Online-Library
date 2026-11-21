import { Suspense } from "react";

import MyBooksSkeleton from "@/components/my-books/MyBooksSkeleton";
import MyBooksView from "@/components/my-books/MyBooksView";
import type { Book } from "@/lib/books";
import { getBooks } from "@/lib/books-api";

type MyBooksRouteProps = {
  backHref: string;
  backLabel: string;
};

async function MyBooksContent({ backHref, backLabel }: MyBooksRouteProps) {
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

  return (
    <MyBooksView
      books={books}
      error={error}
      backHref={backHref}
      backLabel={backLabel}
    />
  );
}

/**
 * Shared server entry for the public and dashboard My Books pages. The
 * catalogue streams in behind the skeleton; the saved library hydrates on the
 * client.
 */
export default function MyBooksRoute({
  backHref,
  backLabel,
}: MyBooksRouteProps) {
  return (
    <Suspense fallback={<MyBooksSkeleton />}>
      <MyBooksContent backHref={backHref} backLabel={backLabel} />
    </Suspense>
  );
}
