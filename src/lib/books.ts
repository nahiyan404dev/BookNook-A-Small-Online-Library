export type Book = {
  _id: string;
  name: string;
  author?: string;
  category?: string;
  imageUrl?: string;
  price: number | string;
  duration?: number | string;
  description?: string;
  /** Full or partial text, when the catalogue provides it. */
  content?: string;
  rating: number | string;
  /** Optional compare-at price. Falls back to a display-only 20% off value. */
  originalPrice?: number;
};

/** Formats a numeric/string price as `$25`. */
export function formatPrice(value: number | string): string {
  const price = Number(value);
  return Number.isFinite(price) ? `$${price}` : "—";
}

/** Returns the struck-through "was" price for a book, if one can be shown. */
export function getOriginalPrice(book: Book): number | null {
  const price = Number(book.price);

  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }

  if (book.originalPrice && Number(book.originalPrice) > price) {
    return Number(book.originalPrice);
  }

  return Math.ceil(price / 0.8);
}

/**
 * True when a book matches a free-text query. Titles, authors, categories and
 * descriptions are all searched so "fantasy" or "herbert" both work.
 */
export function matchesSearch(book: Book, query: string): boolean {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return true;
  }

  return [book.name, book.author, book.category, book.description].some(
    (field) =>
      typeof field === "string" && field.toLowerCase().includes(needle)
  );
}

/** Filters a book list with {@link matchesSearch}. */
export function searchBooks(books: Book[], query: string): Book[] {
  if (!query.trim()) {
    return books;
  }

  return books.filter((book) => matchesSearch(book, query));
}

/** Turns the borrow duration (in days) into readable copy. */
export function formatDuration(value: number | string | undefined): string {
  const days = Number(value);

  if (!Number.isFinite(days) || days <= 0) {
    return "—";
  }

  return days === 1 ? "1 day" : `${days} days`;
}

const CATEGORY_ALIASES: Record<string, string> = {
  fantacy: "Fantasy",
  fantasy: "Fantasy",
  "science ficton": "Science Fiction",
  "sci-fi": "Science Fiction",
  "sci fi": "Science Fiction",
  "business & entrepreneurship": "Business",
  "business and entrepreneurship": "Business",
};

/**
 * Cleans up the category strings coming from the API (there are a couple of
 * legacy misspellings in the collection) so filters group books correctly.
 */
export function normalizeCategory(value?: string): string {
  const raw = value?.trim();

  if (!raw) {
    return "Uncategorised";
  }

  const alias = CATEGORY_ALIASES[raw.toLowerCase().replace(/\s+/g, " ")];
  if (alias) {
    return alias;
  }

  return raw
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
