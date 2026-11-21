import { Suspense } from "react";

import BorrowsSkeleton from "@/components/borrows/BorrowsSkeleton";
import BorrowsView from "@/components/borrows/BorrowsView";
import type { Book } from "@/lib/books";
import { getBooks } from "@/lib/books-api";

type BorrowsRouteProps = {
  backHref: string;
  backLabel: string;
};

async function BorrowsContent({ backHref, backLabel }: BorrowsRouteProps) {
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
    <BorrowsView
      books={books}
      error={error}
      backHref={backHref}
      backLabel={backLabel}
    />
  );
}

/**
 * Shared server entry for the public and dashboard borrow pages. The book
 * catalogue streams in behind the skeleton; saved loans hydrate on the client.
 */
export default function BorrowsRoute({
  backHref,
  backLabel,
}: BorrowsRouteProps) {
  return (
    <Suspense fallback={<BorrowsSkeleton />}>
      <BorrowsContent backHref={backHref} backLabel={backLabel} />
    </Suspense>
  );
}
