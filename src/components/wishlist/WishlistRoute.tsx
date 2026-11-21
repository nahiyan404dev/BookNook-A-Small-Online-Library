import { Suspense } from "react";

import WishlistSkeleton from "@/components/wishlist/WishlistSkeleton";
import WishlistView from "@/components/wishlist/WishlistView";
import type { Book } from "@/lib/books";
import { getBooks } from "@/lib/books-api";

type WishlistRouteProps = {
  backHref: string;
  backLabel: string;
};

async function WishlistContent({ backHref, backLabel }: WishlistRouteProps) {
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
    <WishlistView
      books={books}
      error={error}
      backHref={backHref}
      backLabel={backLabel}
    />
  );
}

/**
 * Server entry for the wishlist page. The catalogue streams in behind the
 * skeleton; the saved favourites hydrate on the client.
 */
export default function WishlistRoute({
  backHref,
  backLabel,
}: WishlistRouteProps) {
  return (
    <Suspense fallback={<WishlistSkeleton />}>
      <WishlistContent backHref={backHref} backLabel={backLabel} />
    </Suspense>
  );
}
