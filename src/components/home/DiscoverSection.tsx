import { Suspense } from "react";

import DiscoverFeed from "@/components/home/DiscoverFeed";
import DiscoverSkeleton from "@/components/home/DiscoverSkeleton";
import { getBooks } from "@/lib/books-api";

async function DiscoverContent() {
  let books: Awaited<ReturnType<typeof getBooks>> = [];

  try {
    books = await getBooks();
  } catch {
    // The books service is down — hide the editorial panel instead of
    // breaking the rest of the home page.
    return null;
  }

  if (books.length === 0) {
    return null;
  }

  return <DiscoverFeed books={books} />;
}

export default function DiscoverSection() {
  return (
    <Suspense fallback={<DiscoverSkeleton />}>
      <DiscoverContent />
    </Suspense>
  );
}
