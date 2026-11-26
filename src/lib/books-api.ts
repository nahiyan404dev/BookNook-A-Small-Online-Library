
import type { Book } from "@/lib/books";

// API configuration
const BOOKS_API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

// MongoDB ObjectId validation
const OBJECT_ID = /^[a-f\d]{24}$/i;

// Validate API URL
function getApiUrl(): string {
  if (!BOOKS_API) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing. Check your .env.local file."
    );
  }

  return BOOKS_API;
}

// Fetch all books
export async function getBooks(): Promise<Book[]> {
  try {
    const apiUrl = getApiUrl();

    console.log("Fetching books from:", `${apiUrl}/books`);

    const res = await fetch(`${apiUrl}/books`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Books API responded with ${res.status}`);
    }

    const data = await res.json();

     

    return Array.isArray(data) ? (data as Book[]) : [];
  } catch (error) {
    
    throw error;
  }
}

// Fetch a single book
export async function getBook(id: string): Promise<Book | null> {
  if (!OBJECT_ID.test(id)) {
    return null;
  }

  try {
    const res = await fetch(`${getApiUrl()}/books/${id}`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Books API responded with ${res.status}`);
    }

    const body = await res.text();

    if (!body) {
      return null;
    }

    const data = JSON.parse(body);

    return data && typeof data === "object" && "_id" in data
      ? (data as Book)
      : null;
  } catch (error) {
    console.error("GET BOOK ERROR:", error);
    throw error;
  }
}
