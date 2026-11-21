export const WISHLIST_STORAGE_KEY = "booknook.wishlist.v1";

/** Fires in the current tab whenever the wishlist changes. */
export const WISHLIST_EVENT = "booknook:wishlist-change";

/** A favourite book saved in this browser. */
export type WishlistBook = {
  id: string;
  /** ISO timestamp of when the book was added. */
  addedAt: string;
};

function isWishlistBook(value: unknown): value is WishlistBook {
  if (!value || typeof value !== "object") return false;

  const entry = value as Partial<WishlistBook>;

  return typeof entry.id === "string" && typeof entry.addedAt === "string";
}

/** Reads the saved wishlist. `null` means nothing was saved yet. */
export function readWishlist(): WishlistBook[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return null;

    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isWishlistBook) : null;
  } catch {
    return null;
  }
}

export function writeWishlist(entries: WishlistBook[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage can be unavailable (private mode, quota) — the page still works.
  }
}

/** True when the book is already in the wishlist. */
export function isWishlisted(id: string): boolean {
  return Boolean(readWishlist()?.some((entry) => entry.id === id));
}

/** Adds a book to the wishlist. Returns the updated list. */
export function addToWishlist(
  id: string,
  now: Date = new Date()
): WishlistBook[] {
  const current = readWishlist() ?? [];

  if (current.some((entry) => entry.id === id)) {
    return current;
  }

  const next = [{ id, addedAt: now.toISOString() }, ...current];
  writeWishlist(next);
  return next;
}

/** Removes a book from the wishlist. Returns the updated list. */
export function removeFromWishlist(id: string): WishlistBook[] {
  const current = readWishlist() ?? [];
  const next = current.filter((entry) => entry.id !== id);

  if (next.length !== current.length) {
    writeWishlist(next);
  }

  return next;
}

/** Subscribes to wishlist changes in this tab and across tabs. */
export function subscribeToWishlist(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(WISHLIST_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(WISHLIST_EVENT, callback);
  };
}

/** Lets the heart buttons re-render after a wishlist change. */
export function notifyWishlistChange(): void {
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}

export type WishlistStore = {
  subscribe: (listener: () => void) => () => void;
  /** `null` until the browser store has hydrated (the skeleton state). */
  getSnapshot: () => WishlistBook[] | null;
  getServerSnapshot: () => WishlistBook[] | null;
  setBooks: (entries: WishlistBook[]) => void;
};

/**
 * Tiny external store for the wishlist, consumed through
 * `useSyncExternalStore` so local storage is read after mount.
 */
export function createWishlistStore(): WishlistStore {
  let snapshot: WishlistBook[] | null = null;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const hydrate = () => {
    if (hydrated) return;
    hydrated = true;

    snapshot = readWishlist() ?? [];
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    hydrate();

    return () => {
      listeners.delete(listener);
    };
  };

  const setBooks = (entries: WishlistBook[]) => {
    hydrated = true;
    snapshot = entries;
    writeWishlist(entries);
    emit();
  };

  return {
    subscribe,
    getSnapshot: () => snapshot,
    getServerSnapshot: () => null,
    setBooks,
  };
}
