import MyBooksSkeleton from "@/components/my-books/MyBooksSkeleton";

/**
 * Next.js streams this fallback while the My Books page fetches the catalogue.
 */
export default function Loading() {
  return <MyBooksSkeleton />;
}
