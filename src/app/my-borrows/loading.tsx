import BorrowsSkeleton from "@/components/borrows/BorrowsSkeleton";

/**
 * Next.js streams this fallback while the borrow page fetches the catalogue.
 */
export default function Loading() {
  return <BorrowsSkeleton />;
}
