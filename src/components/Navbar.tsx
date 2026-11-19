
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Menu,
  Search,
  UserRound,
  Library,
  Bookmark,
  History,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { name: "Home", href: "/", icon: BookOpen },
  { name: "All Books", href: "/books", icon: Library },
  { name: "My Books", href: "/my-books", icon: Bookmark },
  { name: "My Borrows", href: "/my-borrows", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EAE7F2] bg-[#F5F4FA]/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#19152B]/95">
      <div className="container mx-auto flex h-[76px] max-w-7xl items-center gap-3 px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5426B8] text-white">
            <BookOpen size={23} strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#19152B] dark:text-white">
              Book<span className="text-[#5426B8]">Nook</span>
            </h1>
            <p className="text-[10px] font-medium tracking-[2px] text-[#8B5CF6]">
              READ • BORROW • EXPLORE
            </p>
          </div>
        </Link>

        {/* Search (md and up) */}
        <div className="relative ml-2 hidden md:block">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books..."
            aria-label="Search books"
            className="h-10 w-48 rounded-full border border-[#dcd6cc] bg-white pl-10 pr-4 text-sm font-medium text-[#19152B] outline-none transition-all placeholder:text-gray-400 focus:w-64 xl:w-64 xl:focus:w-72 focus:border-[#5426B8] focus:ring-2 focus:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
          />
        </div>

        {/* Right Actions (all devices) */}
        <div className="flex-1" />

        <ThemeToggle />

        <Button
          variant="outline"
          className=" gap-2 shrink-0 rounded-full border-[#dcd6cc] px-4 font-semibold text-[#5426B8] transition-all hover:border-[#5426B8] hover:bg-[#EDE9FE] hover:text-[#5426B8] sm:px-4 dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD] dark:hover:border-[#8B5CF6] dark:hover:bg-[#5426B8] dark:hover:text-white"
          
        >
          <Link href="/login">
            <UserRound size={17} className=" mr-1 inline"/>
            <span className="hidden sm:inline">Log In</span>
          </Link>
        </Button>

        <Button
          className="shrink-0 hidden sm:flex rounded-full bg-[#5426B8] px-4 font-semibold text-white transition-all hover:bg-[#451D96]"
          
        >
          <Link href="/register">
             Sign up
          </Link>
        </Button>

        {/* Sidebar Menu (all devices) */}
        <Sheet>
          <SheetTrigger >
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 rounded-lg border-[#dcd6cc] text-[#5426B8] hover:border-[#5426B8] hover:bg-[#5426B8] hover:text-white"
            >
              <Menu size={22} />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[300px] border-l border-[#EAE7F2] bg-[#F5F4FA] p-5 dark:border-white/10 dark:bg-[#1F1A33]"
          >
            {/* Logo Header */}
            <div className="mb-6 flex flex-col items-center gap-1 pt-2">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1EAFF] text-[#5426B8]">
                <BookOpen size={30} strokeWidth={2.2} />
                <Sparkles
                  size={14}
                  className="absolute -right-1.5 -top-1.5 text-[#8B5CF6]"
                />
              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#19152B] dark:text-white">
                Book<span className="text-[#5426B8]">Nook</span>
              </h2>
              <p className="text-[10px] font-semibold tracking-[2.5px] text-[#8B5CF6]">
                READ • BORROW • EXPLORE
              </p>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" &&
                    pathname.startsWith(link.href + "/"));

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 dark:text-white/80 dark:hover:text-white ${
                      isActive
                        ? "text-[#3F3D56] hover:bg-[#EDE9FE] hover:text-[#5426B8]"
                        : "text-[#3F3D56] hover:bg-[#EDE9FE] hover:text-[#5426B8]"
                    }`}
                  >
                    <Icon size={19} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="my-5 border-t border-[#EAE7F2] dark:border-white/10" />

            {/* Auth Actions */}
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full rounded-xl border-[#dcd6cc] font-semibold text-[#19152B] hover:border-[#5426B8] hover:bg-[#EDE9FE] hover:text-[#5426B8] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-[#8B5CF6] dark:hover:bg-white/10 dark:hover:text-white"
                
              >
                <Link href="/login">
                  <UserRound size={17} className="mr-1 inline" />
                  Sign In
                </Link>
              </Button>

              <Button
                className="w-full rounded-xl bg-[#5426B8] font-semibold text-white hover:bg-[#451D96]"
                
              >
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

      </div>

      {/* Search (below md — full-width row) */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books..."
            aria-label="Search books"
            className="h-10 w-full rounded-full border border-[#dcd6cc] bg-white pl-10 pr-4 text-sm font-medium text-[#19152B] outline-none transition-all placeholder:text-gray-400 focus:border-[#5426B8] focus:ring-2 focus:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
          />
        </div>
      </div>
    </header>
  );
}
