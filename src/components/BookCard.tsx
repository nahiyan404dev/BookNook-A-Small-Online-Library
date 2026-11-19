"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

import BookCover from "@/components/BookCover";
import { formatPrice, getOriginalPrice, type Book } from "@/lib/books";
import { cn } from "@/lib/utils";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  const [inCart, setInCart] = useState(false);

  const rating = Number(book.rating);
  const originalPrice = getOriginalPrice(book);
  const detailsHref = `/allbooks/${book._id}`;

  const handleCart = () => {
    if (inCart) return;

    setInCart(true);
    toast.success("Added to your cart", {
      description: `${book.name} is waiting for you at checkout.`,
    });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#e9e4dc] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#183d32]/30 hover:shadow-lg hover:shadow-[#183d32]/10 dark:border-white/10 dark:bg-[#1F1A33] dark:hover:border-[#8B5CF6]/40">
      {/* Cover — the love/favourite icon is intentionally never rendered */}
      <Link href={detailsHref} aria-label={`View details for ${book.name}`}>
        <BookCover
          src={book.imageUrl}
          alt={`Cover of ${book.name}`}
          className="aspect-3/4 rounded-xl"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <h3 className="line-clamp-2 text-[15px] leading-snug font-bold tracking-tight text-[#19152B] sm:text-base dark:text-white">
          <Link
            href={detailsHref}
            className="transition-colors hover:text-[#183d32] dark:hover:text-[#C4B5FD]"
          >
            {book.name}
          </Link>
        </h3>

        {book.author ? (
          <p className="mt-1 line-clamp-1 text-xs font-medium text-[#6B7280] dark:text-white/55">
            {book.author}
          </p>
        ) : null}

        {/* Price + rating */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-xl font-extrabold tracking-tight text-[#19152B] sm:text-2xl dark:text-white">
              {formatPrice(book.price)}
            </span>
            {originalPrice ? (
              <span className="text-sm font-medium text-[#9CA3AF] line-through dark:text-white/40">
                {formatPrice(originalPrice)}
              </span>
            ) : null}
          </div>

          {Number.isFinite(rating) && rating > 0 ? (
            <span
              aria-label={`Rated ${rating} out of 5`}
              className="shrink-0 rounded-md bg-[#183d32] px-2 py-1 text-xs font-bold text-white tabular-nums"
            >
              {rating.toFixed(1).replace(/\.0$/, "")}
            </span>
          ) : null}
        </div>

        {/* Cart action */}
        <button
          type="button"
          onClick={handleCart}
          aria-label={
            inCart ? `Go to cart for ${book.name}` : `Add ${book.name} to cart`
          }
          className={cn(
            "mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wide uppercase transition-colors duration-200",
            inCart
              ? "bg-[#EDE9FE] text-[#5426B8] hover:bg-[#E3DBFC] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD] dark:hover:bg-[#8B5CF6]/25"
              : "bg-[#183d32] text-white hover:bg-[#0f2b23] dark:bg-[#183d32] dark:hover:bg-[#22594a]"
          )}
        >
          {inCart ? <Check size={15} /> : <ShoppingCart size={15} />}
          {inCart ? "Go to cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
