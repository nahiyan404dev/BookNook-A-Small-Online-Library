"use client";

import { useState } from "react";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

type BookDetailsActionsProps = {
  name: string;
};

export default function BookDetailsActions({ name }: BookDetailsActionsProps) {
  const [inCart, setInCart] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCart = () => {
    if (inCart) return;

    setInCart(true);
    toast.success("Added to your cart", {
      description: `${name} is waiting for you at checkout.`,
    });
  };

  const handleBorrow = () => {
    toast.success("Borrow request placed", {
      description: `We'll hold "${name}" for you at the front desk.`,
    });
  };

  const handleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);

    toast[next ? "success" : "info"](
      next ? "Saved to bookmarks" : "Removed from bookmarks",
      {
        description: next
          ? `Find ${name} later under Bookmarks.`
          : `${name} is no longer in your saved books.`,
      }
    );
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={handleBorrow}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#183d32] px-6 text-sm font-bold tracking-wide text-white uppercase shadow-lg shadow-[#183d32]/20 transition-all hover:bg-[#0f2b23] hover:shadow-[#183d32]/30 active:translate-y-px sm:flex-none"
      >
        <BookOpen size={18} />
        Borrow now
      </button>

      <button
        type="button"
        onClick={handleCart}
        aria-label={inCart ? "Go to cart" : `Add ${name} to cart`}
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
        onClick={handleBookmark}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl border transition-colors",
          bookmarked
            ? "border-[#183d32]/20 bg-[#183d32] text-white hover:bg-[#0f2b23] dark:border-[#8B5CF6]/40 dark:bg-[#8B5CF6] dark:hover:bg-[#7C3AED]"
            : "border-[#e9e4dc] bg-white text-[#183d32] hover:border-[#183d32]/40 hover:bg-[#f2f0ea] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        )}
      >
        {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
      </button>
    </div>
  );
}
