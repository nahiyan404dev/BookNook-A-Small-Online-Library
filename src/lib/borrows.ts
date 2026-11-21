import type { Book } from "@/lib/books";

/** Standard loan length for a borrowed book, in days. */
export const LOAN_DAYS = 14;

export const BORROWS_STORAGE_KEY = "booknook.borrows.v1";

/** The slice of a book we keep on a loan, so history survives book changes. */
export type BorrowedBook = Pick<
  Book,
  "_id" | "name" | "author" | "category" | "imageUrl"
>;

export type Loan = {
  id: string;
  book: BorrowedBook;
  /** ISO timestamps. */
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
};

export type LoanStatus = "on-time" | "due-soon" | "overdue";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function snapshotBook(book: Book): BorrowedBook {
  return {
    _id: book._id,
    name: book.name,
    author: book.author,
    category: book.category,
    imageUrl: book.imageUrl,
  };
}

/** Whole days between now and a date. Negative means the date has passed. */
export function daysUntil(date: string, now: Date = new Date()): number {
  const target = new Date(date);

  if (Number.isNaN(target.getTime())) {
    return 0;
  }

  return Math.round(
    (startOfDay(target).getTime() - startOfDay(now).getTime()) / DAY_IN_MS
  );
}

export function loanStatus(loan: Loan, now: Date = new Date()): LoanStatus {
  const days = daysUntil(loan.dueAt, now);

  if (days < 0) return "overdue";
  if (days <= 3) return "due-soon";
  return "on-time";
}

/** Short human copy for the due date, e.g. "Due tomorrow". */
export function dueLabel(loan: Loan, now: Date = new Date()): string {
  const days = daysUntil(loan.dueAt, now);

  if (days < 0) {
    const overdue = Math.abs(days);
    return `Overdue by ${overdue} ${overdue === 1 ? "day" : "days"}`;
  }

  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `${days} days left`;
}

/** Formats an ISO date as "Nov 9" (adds the year when it is not this year). */
export function formatDay(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const sameYear = date.getFullYear() === new Date().getFullYear();

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date);
}

/** Builds a brand new active loan for a book, due `LOAN_DAYS` from now. */
export function createLoan(book: Book, now: Date = new Date()): Loan {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `loan-${now.getTime()}-${book._id}`;

  return {
    id,
    book: snapshotBook(book),
    borrowedAt: now.toISOString(),
    dueAt: addDays(now, LOAN_DAYS).toISOString(),
    returnedAt: null,
  };
}

/**
 * Demo loans used the first time the page is opened. They are derived from the
 * catalogue so the page has something real to show without an accounts API.
 */
export function createSeedLoans(
  books: Book[],
  now: Date = new Date()
): Loan[] {
  const pool = books.slice(0, 5);

  if (pool.length === 0) {
    return [];
  }

  const activeBooks = pool.slice(0, Math.min(3, pool.length));
  const activeDaysAgo = [12, 5, 20];

  const loans: Loan[] = activeBooks.map((book, index) => {
    const borrowedAt = addDays(now, -activeDaysAgo[index]);

    return {
      id: `seed-active-${book._id}`,
      book: snapshotBook(book),
      borrowedAt: borrowedAt.toISOString(),
      dueAt: addDays(borrowedAt, LOAN_DAYS).toISOString(),
      returnedAt: null,
    };
  });

  const history = [
    { borrowed: 34, returned: 24 },
    { borrowed: 45, returned: 38 },
  ];

  pool.slice(activeBooks.length).forEach((book, index) => {
    const span = history[index] ?? { borrowed: 30, returned: 22 };
    const borrowedAt = addDays(now, -span.borrowed);

    loans.push({
      id: `seed-returned-${book._id}`,
      book: snapshotBook(book),
      borrowedAt: borrowedAt.toISOString(),
      dueAt: addDays(borrowedAt, LOAN_DAYS).toISOString(),
      returnedAt: addDays(now, -span.returned).toISOString(),
    });
  });

  return loans;
}

function isLoan(value: unknown): value is Loan {
  if (!value || typeof value !== "object") return false;

  const loan = value as Partial<Loan>;
  const book = loan.book as Partial<BorrowedBook> | undefined;

  return (
    typeof loan.id === "string" &&
    typeof loan.borrowedAt === "string" &&
    typeof loan.dueAt === "string" &&
    (loan.returnedAt === null || typeof loan.returnedAt === "string") &&
    Boolean(book) &&
    typeof book?._id === "string" &&
    typeof book?.name === "string"
  );
}

/** Reads saved loans from this browser. `null` means nothing was saved yet. */
export function readStoredLoans(): Loan[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(BORROWS_STORAGE_KEY);
    if (!raw) return null;

    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isLoan) : null;
  } catch {
    return null;
  }
}

export function writeStoredLoans(loans: Loan[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(BORROWS_STORAGE_KEY, JSON.stringify(loans));
  } catch {
    // Storage can be unavailable (private mode, quota) — the page still works.
  }
}

/** True when the book already has an active loan in this browser. */
export function isBookBorrowed(bookId: string): boolean {
  const loans = readStoredLoans();

  return Boolean(
    loans?.some((loan) => !loan.returnedAt && loan.book._id === bookId)
  );
}

/**
 * Adds a loan for the book to this browser's borrows list. Returns the created
 * loan, or `null` when the book is already on loan — so repeated clicks can
 * never create a duplicate.
 */
export function borrowBook(book: Book, now: Date = new Date()): Loan | null {
  const stored = readStoredLoans() ?? [];

  if (
    stored.some((loan) => !loan.returnedAt && loan.book._id === book._id)
  ) {
    return null;
  }

  const loan = createLoan(book, now);
  writeStoredLoans([loan, ...stored]);
  return loan;
}

export type BorrowStore = {
  subscribe: (listener: () => void) => () => void;
  /** `null` until the browser store has hydrated (the skeleton state). */
  getSnapshot: () => Loan[] | null;
  getServerSnapshot: () => Loan[] | null;
  setLoans: (loans: Loan[]) => void;
};

/**
 * Tiny external store for the loans list. `useSyncExternalStore` consumes it,
 * so local storage is read in `subscribe` (after mount) instead of during
 * render or inside an effect that calls setState.
 */
export function createBorrowStore(books: Book[]): BorrowStore {
  let snapshot: Loan[] | null = null;
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

    const stored = readStoredLoans();
    const initial = stored ?? createSeedLoans(books);

    if (!stored) {
      writeStoredLoans(initial);
    }

    snapshot = initial;
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    hydrate();

    return () => {
      listeners.delete(listener);
    };
  };

  const setLoans = (loans: Loan[]) => {
    hydrated = true;
    snapshot = loans;
    writeStoredLoans(loans);
    emit();
  };

  return {
    subscribe,
    getSnapshot: () => snapshot,
    getServerSnapshot: () => null,
    setLoans,
  };
}
