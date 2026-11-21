import AddBookSkeleton from "@/components/AddBookSkeleton";

/**
 * Next.js wraps this route in a Suspense boundary and streams this fallback
 * while the Add Book page loads.
 */
export default function Loading() {
  return <AddBookSkeleton />;
}
