import type { Metadata } from "next";

import WishlistRoute from "@/components/wishlist/WishlistRoute";

export const metadata: Metadata = {
  title: "Wishlist — BookNook",
  description:
    "Your favourite books, saved in one place. Add a heart to any book and find it here.",
};

export default function WishlistPage() {
  return <WishlistRoute backHref="/" backLabel="Back to home" />;
}
