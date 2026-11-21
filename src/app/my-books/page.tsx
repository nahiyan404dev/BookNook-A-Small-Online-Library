import type { Metadata } from "next";

import MyBooksRoute from "@/components/my-books/MyBooksRoute";

export const metadata: Metadata = {
  title: "My Books — BookNook",
  description:
    "Every book you have added to BookNook, collected on one shelf you can search and manage.",
};

export default function MyBooksPage() {
  return <MyBooksRoute backHref="/" backLabel="Back to home" />;
}
