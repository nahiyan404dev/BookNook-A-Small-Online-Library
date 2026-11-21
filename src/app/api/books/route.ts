import { getBooks } from "@/lib/books-api";

/**
 * Same-origin proxy for the books service so the client-side search in the
 * navbar does not have to deal with CORS.
 */
export async function GET() {
  try {
    const books = await getBooks();
    return Response.json(books);
  } catch {
    return Response.json(
      { error: "The books service is unavailable." },
      { status: 502 }
    );
  }
}
