import { cn } from "@/lib/utils";

type ReadingProgressBarProps = {
  /** Percentage, 0–100. */
  value: number;
  label?: string;
  className?: string;
  tone?: "purple" | "green";
};

/**
 * Slim progress track shared by the reader and the shelf pages. The bar itself
 * is decorative, so the accessible value lives on the wrapper.
 */
export default function ReadingProgressBar({
  value,
  label = "Reading progress",
  className,
  tone = "purple",
}: ReadingProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={label}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full dark:bg-white/10",
        tone === "green" ? "bg-[#ece7dd]" : "bg-[#F1EEF8]",
        className
      )}
    >
      <span
        className={cn(
          "block h-full rounded-full transition-[width] duration-500 ease-out",
          tone === "purple"
            ? "bg-gradient-to-r from-[#8B5CF6] to-[#5426B8] dark:from-[#C4B5FD] dark:to-[#8B5CF6]"
            : "bg-gradient-to-r from-[#8B5CF6] to-[#5426B8] dark:from-[#C4B5FD] dark:to-[#8B5CF6]"
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
