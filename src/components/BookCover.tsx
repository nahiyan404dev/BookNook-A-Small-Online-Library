"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";

import { cn } from "@/lib/utils";

type BookCoverProps = {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Load the image immediately instead of lazily (above-the-fold covers). */
  priority?: boolean;
};

export default function BookCover({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
}: BookCoverProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#f4f1ea] dark:bg-white/5",
        className
      )}
    >
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#b9b2a4] dark:text-white/30">
          <BookOpen size={38} strokeWidth={1.6} />
          <span className="text-[11px] font-medium tracking-wide uppercase">
            No cover
          </span>
        </div>
      )}
    </div>
  );
}
