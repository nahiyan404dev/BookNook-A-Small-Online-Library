
"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // localStorage unavailable — theme just won't persist
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="shrink-0 rounded-lg border-[#dcd6cc] text-[#5426B8] hover:border-[#5426B8] hover:bg-[#5426B8] hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD] dark:hover:border-[#8B5CF6] dark:hover:bg-[#5426B8] dark:hover:text-white"
    >
      {/* Both icons rendered; CSS decides which is visible — avoids hydration mismatch */}
      <Sun size={19} className="hidden dark:block" />
      <Moon size={19} className="dark:hidden" />
    </Button>
  );
}
