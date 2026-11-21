"use client";

import { useState, useSyncExternalStore } from "react";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

import type { Book } from "@/lib/books";
import { borrowBook, formatDay, isBookBorrowed } from "@/lib/borrows";
import { addMyBook, isBookSaved, removeMyBook } from "@/lib/my-books";
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

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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
    </div>
  );
}
