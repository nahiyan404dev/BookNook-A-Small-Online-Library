import type { Metadata } from "next";

import BorrowsRoute from "@/components/borrows/BorrowsRoute";

export const metadata: Metadata = {
  title: "My Borrows — BookNook",
  description:
    "Track the books you have borrowed, return them to the shelf, and borrow your next read.",
};

export default function MyBorrowsPage() {
  return <BorrowsRoute backHref="/" backLabel="Back to home" />;
}
