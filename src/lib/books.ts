export type Book = {
  _id: string;
  name: string;
  author?: string;
  category?: string;
  imageUrl?: string;
  price: number | string;
  duration?: number | string;
  description?: string;
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

/** Turns the borrow duration (in days) into readable copy. */
export function formatDuration(value: number | string | undefined): string {
  const days = Number(value);

  if (!Number.isFinite(days) || days <= 0) {
    return "—";
  }

  return days === 1 ? "1 day" : `${days} days`;
}
