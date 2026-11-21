import type { Metadata } from "next";

import BorrowsRoute from "@/components/borrows/BorrowsRoute";

export const metadata: Metadata = {
  title: "My Borrows — BookNook",
  description:
    "Manage your borrowed books from the dashboard — return titles and borrow new ones.",
};

export default function DashboardBorrowsPage() {
  return <BorrowsRoute backHref="/dashboard" backLabel="Back to dashboard" />;
}
