import type { Metadata } from "next";

import MyBooksRoute from "@/components/my-books/MyBooksRoute";

export const metadata: Metadata = {
  title: "My Books — BookNook",
  description:
    "Manage the books you have added to BookNook from your dashboard.",
};

export default function DashboardMyBooksPage() {
  return <MyBooksRoute backHref="/dashboard" backLabel="Back to dashboard" />;
}
