import WishlistSkeleton from "@/components/wishlist/WishlistSkeleton";

/**
 * Next.js streams this fallback while the wishlist page fetches the catalogue.
 */
export default function Loading() {
  return <WishlistSkeleton />;
}
