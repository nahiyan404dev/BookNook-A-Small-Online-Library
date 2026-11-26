import type { Book } from "@/lib/books";

const BOOKS_API = process.env.NEXT_PUBLIC_API_URL;


/** Mongo ObjectId shape — the backend throws a 500 on anything else. */
const OBJECT_ID = /^[a-f\d]{24}$/i;

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${BOOKS_API}/books`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`The books service responded with ${res.status}.`);
  }

  const data = await res.json();
  return Array.isArray(data) ? (data as Book[]) : [];
}

/**
 * Fetches a single book. Returns `null` when the id is malformed or the book
 * does not exist, and throws only when the service itself is unreachable.
 */
export async function getBook(id: string): Promise<Book | null> {
  if (!OBJECT_ID.test(id)) {
    return null;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`The books service responded with ${res.status}.`);
  }

  // The backend answers 200 with an empty body for unknown ids.
  const body = await res.text();
  if (!body) {
    return null;
  }

  try {
    const data = JSON.parse(body);
    return data && typeof data === "object" && "_id" in data
      ? (data as Book)
      : null;
  } catch {
    return null;
  }
}
