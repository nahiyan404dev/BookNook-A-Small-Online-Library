export const MY_BOOKS_STORAGE_KEY = "booknook.my-books.v1";

/** A book this browser has added to the user's personal library. */
export type OwnedBook = {
  id: string;
  /** ISO timestamp of when the book was added. */
  addedAt: string;
};

function isOwnedBook(value: unknown): value is OwnedBook {
  if (!value || typeof value !== "object") return false;

  const entry = value as Partial<OwnedBook>;

  return typeof entry.id === "string" && typeof entry.addedAt === "string";
}

/** Reads the saved library. `null` means nothing was saved yet. */
export function readMyBooks(): OwnedBook[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(MY_BOOKS_STORAGE_KEY);
    if (!raw) return null;

    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isOwnedBook) : null;
  } catch {
    return null;
  }
}

export function writeMyBooks(entries: OwnedBook[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(MY_BOOKS_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage can be unavailable (private mode, quota) — the page still works.
  }
}

/**
 * Records a newly added book in this browser's library. Used by the Add New
 * Book form so the book shows up under My Books. Returns the updated list.
 */
export function addMyBook(id: string, now: Date = new Date()): OwnedBook[] {
  const current = readMyBooks() ?? [];

  if (current.some((entry) => entry.id === id)) {
    return current;
  }

  const next = [{ id, addedAt: now.toISOString() }, ...current];
  writeMyBooks(next);
  return next;
}

/** True when the book is already in this browser's personal library. */
export function isBookSaved(id: string): boolean {
  return Boolean(readMyBooks()?.some((entry) => entry.id === id));
}

/** Removes a book from the saved library and returns the updated list. */
export function removeMyBook(id: string): OwnedBook[] {
  const current = readMyBooks() ?? [];
  const next = current.filter((entry) => entry.id !== id);

  if (next.length !== current.length) {
    writeMyBooks(next);
  }

  return next;
}

export type MyBooksStore = {
  subscribe: (listener: () => void) => () => void;
  /** `null` until the browser store has hydrated (the skeleton state). */
  getSnapshot: () => OwnedBook[] | null;
  getServerSnapshot: () => OwnedBook[] | null;
  setBooks: (entries: OwnedBook[]) => void;
};

/**
 * Tiny external store for the personal library, consumed through
 * `useSyncExternalStore` so local storage is read after mount.
 */
export function createMyBooksStore(): MyBooksStore {
  let snapshot: OwnedBook[] | null = null;
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

    snapshot = readMyBooks() ?? [];
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    hydrate();

    return () => {
      listeners.delete(listener);
    };
  };

  const setBooks = (entries: OwnedBook[]) => {
    hydrated = true;
    snapshot = entries;
    writeMyBooks(entries);
    emit();
  };

  return {
    subscribe,
    getSnapshot: () => snapshot,
    getServerSnapshot: () => null,
    setBooks,
  };
}
