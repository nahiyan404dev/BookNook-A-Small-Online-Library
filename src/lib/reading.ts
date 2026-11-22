export const READING_STORAGE_KEY = "booknook.reading.v1";

/**
 * How far this browser has read a book. Pages are 1-based so they can be shown
 * directly ("Page 3 of 9"). `completedAt` is only set when the reader marks the
 * book as finished.
 */
export type ReadingProgress = {
  bookId: string;
  page: number;
  totalPages: number;
  /** ISO timestamps. */
  startedAt: string;
  updatedAt: string;
  completedAt: string | null;
};

function isReadingProgress(value: unknown): value is ReadingProgress {
  if (!value || typeof value !== "object") return false;

  const record = value as Partial<ReadingProgress>;

  return (
    typeof record.bookId === "string" &&
    typeof record.page === "number" &&
    Number.isFinite(record.page) &&
    record.page > 0 &&
    typeof record.totalPages === "number" &&
    Number.isFinite(record.totalPages) &&
    record.totalPages > 0 &&
    typeof record.startedAt === "string" &&
    typeof record.updatedAt === "string" &&
    (record.completedAt === null || typeof record.completedAt === "string")
  );
}

/** Reads saved progress from this browser. `null` means nothing was saved yet. */
export function readReadingProgress(): ReadingProgress[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(READING_STORAGE_KEY);
    if (!raw) return null;

    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isReadingProgress) : null;
  } catch {
    return null;
  }
}

export function writeReadingProgress(records: ReadingProgress[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(READING_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Storage can be unavailable (private mode, quota) — reading still works.
  }
}

/**
 * Shares the same curve as the reader: the title page is the starting point, so
 * the last page is always 100%. A finished book is 100% even if it is reopened
 * on an earlier page.
 */
export function readingPercent(
  progress: ReadingProgress | null | undefined
): number {
  if (!progress) return 0;
  if (progress.completedAt) return 100;

  if (progress.totalPages <= 1) {
    return progress.page >= 1 ? 100 : 0;
  }

  const ratio = (progress.page - 1) / (progress.totalPages - 1);
  return Math.min(100, Math.max(0, Math.round(ratio * 100)));
}

/** Short label used beside progress bars, e.g. "42% read". */
export function readingStatusLabel(
  progress: ReadingProgress | null | undefined
): string {
  if (!progress || progress.page <= 1) return "Not started";
  if (progress.completedAt) return "Finished";

  return `${readingPercent(progress)}% read`;
}

/** Copy for the action that opens the reader. */
export function readingActionLabel(
  progress: ReadingProgress | null | undefined
): string {
  if (progress?.completedAt) return "Read again";
  if (progress && progress.page > 1) return "Continue";

  return "Read";
}

/** Turns an ISO timestamp into "Nov 9", or an em dash when it is missing. */
export function formatReadingDate(iso?: string | null): string {
  if (!iso) return "—";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(Math.round(page), 1), totalPages);
}

function upsert(
  records: ReadingProgress[],
  next: ReadingProgress
): ReadingProgress[] {
  return [next, ...records.filter((record) => record.bookId !== next.bookId)];
}

export type ReadingStore = {
  subscribe: (listener: () => void) => () => void;
  /** `null` until the browser store has hydrated (the loading state). */
  getSnapshot: () => ReadingProgress[] | null;
  getServerSnapshot: () => ReadingProgress[] | null;
  /** Saves the page the reader is on (1-based) and returns the new record. */
  savePage: (
    bookId: string,
    page: number,
    totalPages: number,
    now?: Date
  ) => ReadingProgress;
  /** Marks the book as finished on its last page. */
  finishBook: (
    bookId: string,
    totalPages: number,
    now?: Date
  ) => ReadingProgress;
  /** Forgets the book's progress so "Read again" starts from the title page. */
  resetBook: (bookId: string) => void;
};

/**
 * Tiny external store for reading progress, consumed through
 * `useSyncExternalStore` so local storage is read after mount. The reader and
 * the shelves each create one, and because they share a storage key they always
 * agree the next time they mount.
 */
export function createReadingStore(): ReadingStore {
  let snapshot: ReadingProgress[] | null = null;
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

    snapshot = readReadingProgress() ?? [];
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    hydrate();

    return () => {
      listeners.delete(listener);
    };
  };

  const commit = (next: ReadingProgress[]) => {
    hydrated = true;
    snapshot = next;
    writeReadingProgress(next);
    emit();
  };

  // Read storage directly when the store has not hydrated yet (for example a
  // very fast click after mount) so other books' progress is never overwritten.
  const current = () => snapshot ?? readReadingProgress() ?? [];

  const savePage = (
    bookId: string,
    page: number,
    totalPages: number,
    now: Date = new Date()
  ) => {
    const safeTotal = Math.max(1, Math.round(totalPages));
    const records = current();
    const existing = records.find((record) => record.bookId === bookId);
    const timestamp = now.toISOString();

    const next: ReadingProgress = {
      bookId,
      page: clampPage(page, safeTotal),
      totalPages: safeTotal,
      startedAt: existing?.startedAt ?? timestamp,
      updatedAt: timestamp,
      completedAt: existing?.completedAt ?? null,
    };

    commit(upsert(records, next));
    return next;
  };

  const finishBook = (
    bookId: string,
    totalPages: number,
    now: Date = new Date()
  ) => {
    const safeTotal = Math.max(1, Math.round(totalPages));
    const records = current();
    const existing = records.find((record) => record.bookId === bookId);
    const timestamp = now.toISOString();

    const next: ReadingProgress = {
      bookId,
      page: safeTotal,
      totalPages: safeTotal,
      startedAt: existing?.startedAt ?? timestamp,
      updatedAt: timestamp,
      completedAt: timestamp,
    };

    commit(upsert(records, next));
    return next;
  };

  const resetBook = (bookId: string) => {
    const records = current();

    if (!records.some((record) => record.bookId === bookId)) {
      return;
    }

    commit(records.filter((record) => record.bookId !== bookId));
  };

  return {
    subscribe,
    getSnapshot: () => snapshot,
    getServerSnapshot: () => null,
    savePage,
    finishBook,
    resetBook,
  };
}
