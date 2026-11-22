"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronRight,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

import ReadingProgressBar from "@/components/reading/ReadingProgressBar";
import type { Book } from "@/lib/books";
import { borrowBook, formatDay, isBookBorrowed } from "@/lib/borrows";
import { addMyBook, isBookSaved, removeMyBook } from "@/lib/my-books";
import { createReadingStore, readingPercent } from "@/lib/reading";
import { buildReaderPages } from "@/lib/reading-pages";
import {
  addToWishlist,
  isWishlisted,
  notifyWishlistChange,
  removeFromWishlist,
  subscribeToWishlist,
} from "@/lib/wishlist";
import { cn } from "@/lib/utils";

const LIBRARY_EVENT = "booknook:library-change";

/** Same-tab notifications; the `storage` event covers other tabs. */
function subscribeToLibrary(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LIBRARY_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LIBRARY_EVENT, callback);
  };
}

function notifyLibraryChange() {
  window.dispatchEvent(new Event(LIBRARY_EVENT));
}

type BookDetailsActionsProps = {
  book: Book;
};

export default function BookDetailsActions({ book }: BookDetailsActionsProps) {
  const [inCart, setInCart] = useState(false);

  const borrowed = useSyncExternalStore(
    subscribeToLibrary,
    () => isBookBorrowed(book._id),
    () => false
  );

  const saved = useSyncExternalStore(
    subscribeToLibrary,
    () => isBookSaved(book._id),
    () => false
  );

  const wishlisted = useSyncExternalStore(
    subscribeToWishlist,
    () => isWishlisted(book._id),
    () => false
  );

  const [readingStore] = useState(() => createReadingStore());
  const readingRecords = useSyncExternalStore(
    readingStore.subscribe,
    readingStore.getSnapshot,
    readingStore.getServerSnapshot
  );

  const readingProgress =
    readingRecords?.find((record) => record.bookId === book._id) ?? null;
  const readingValue = readingPercent(readingProgress);
  const readerPageCount = buildReaderPages(book).length;

  const handleCart = () => {
    if (inCart) return;

    setInCart(true);
    toast.success("Added to your cart", {
      description: `${book.name} is waiting for you at checkout.`,
    });
  };

  const handleBorrow = () => {
    // One click = one loan. `borrowBook` also refuses duplicates, so a rapid
    // double click can never add the same book twice.
    const loan = borrowBook(book);

    if (!loan) {
      toast.info("Already on your borrows page", {
        description: `"${book.name}" is already borrowed.`,
      });
      return;
    }

    notifyLibraryChange();

    toast.success("Borrow request placed", {
      description: `Due ${formatDay(loan.dueAt)} — track it under My Borrows.`,
    });
  };

  const handleSave = () => {
    if (isBookSaved(book._id)) {
      removeMyBook(book._id);
      notifyLibraryChange();

      toast.info("Removed from My Books", {
        description: `"${book.name}" is off your personal shelf.`,
      });
      return;
    }

    addMyBook(book._id);
    notifyLibraryChange();

    toast.success("Saved to My Books", {
      description: `Find "${book.name}" under My Books.`,
    });
  };

  const handleWishlist = () => {
    if (isWishlisted(book._id)) {
      removeFromWishlist(book._id);
      notifyWishlistChange();

      toast.info("Removed from wishlist", {
        description: `"${book.name}" is no longer one of your favourites.`,
      });
      return;
    }

    addToWishlist(book._id);
    notifyWishlistChange();

    toast.success("Added to wishlist", {
      description: `Find "${book.name}" under Wishlist.`,
    });
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleBorrow}
          disabled={borrowed}
          className={cn(
            "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold tracking-wide uppercase transition-all active:translate-y-px sm:flex-none",
            borrowed
              ? "cursor-not-allowed bg-[#183d32]/60 text-white/85 shadow-none dark:bg-[#276F4C]/50"
              : "bg-[#183d32] text-white shadow-lg shadow-[#183d32]/20 hover:bg-[#0f2b23] hover:shadow-[#183d32]/30"
          )}
        >
          {borrowed ? <Check size={18} /> : <BookOpen size={18} />}
          {borrowed ? "Borrowed" : "Borrow now"}
        </button>

        <button
          type="button"
          onClick={handleCart}
          aria-label={inCart ? "Go to cart" : `Add ${book.name} to cart`}
          className={cn(
            "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-6 text-sm font-bold tracking-wide uppercase transition-all active:translate-y-px sm:flex-none",
            inCart
              ? "border-[#183d32]/20 bg-[#EDE9FE] text-[#5426B8] hover:bg-[#E3DBFC] dark:border-[#8B5CF6]/30 dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD] dark:hover:bg-[#8B5CF6]/25"
              : "border-[#183d32]/25 bg-white text-[#183d32] hover:bg-[#f2f0ea] dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          )}
        >
          {inCart ? <Check size={18} /> : <ShoppingCart size={18} />}
          {inCart ? "Go to cart" : "Add to cart"}
        </button>

        <button
          type="button"
          onClick={handleSave}
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${book.name} from My Books`
              : `Save ${book.name} to My Books`
          }
          title={saved ? "Saved to My Books" : "Save to My Books"}
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl border transition-colors",
            saved
              ? "border-[#183d32]/20 bg-[#183d32] text-white hover:bg-[#0f2b23] dark:border-[#8B5CF6]/40 dark:bg-[#8B5CF6] dark:hover:bg-[#7C3AED]"
              : "border-[#e9e4dc] bg-white text-[#183d32] hover:border-[#183d32]/40 hover:bg-[#f2f0ea] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          )}
        >
          {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={wishlisted}
          aria-label={
            wishlisted
              ? `Remove ${book.name} from wishlist`
              : `Add ${book.name} to wishlist`
          }
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl border transition-colors",
            wishlisted
              ? "border-[#E11D48]/20 bg-white text-[#E11D48] dark:border-[#E11D48]/30 dark:bg-[#E11D48]/15 dark:text-[#FB7185]"
              : "border-[#e9e4dc] bg-white text-[#183d32] hover:border-[#E11D48]/40 hover:text-[#E11D48] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-[#E11D48]/40 dark:hover:text-[#FB7185]"
          )}
        >
          <Heart
            size={20}
            className={wishlisted ? "fill-current" : undefined}
          />
        </button>
      </div>

      <Link
        href={`/read/${book._id}`}
        className="mt-3 flex items-center gap-3 rounded-xl border border-[#e9e4dc] bg-white p-3 transition-colors hover:border-[#183d32]/40 hover:bg-[#f7f4ec] dark:border-white/10 dark:bg-white/5 dark:hover:border-[#8B5CF6]/40 dark:hover:bg-white/10"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#183d32] text-white dark:bg-[#276F4C]">
          <BookOpen size={18} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#19152B] dark:text-white">
            {readingProgress?.completedAt
              ? "Read again"
              : readingValue > 0
                ? "Continue reading"
                : "Read this book"}
          </p>
          <p className="mt-0.5 text-[11px] text-[#6B7280] dark:text-white/50">
            {readingProgress && readingValue > 0
              ? `Page ${readingProgress.page} of ${readingProgress.totalPages} · ${readingValue}% read`
              : `${readerPageCount} pages · your progress saves automatically`}
          </p>

          <ReadingProgressBar
            value={readingValue}
            tone="green"
            label={`Reading progress for ${book.name}`}
            className="mt-2"
          />
        </div>

        <ChevronRight
          size={18}
          className="shrink-0 text-[#8B87A0] dark:text-white/35"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
