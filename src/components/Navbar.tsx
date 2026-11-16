
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Menu,
  Search,
  UserRound,
  Library,
  Bookmark,
  History,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", href: "/", icon: BookOpen },
  { name: "All Books", href: "/books", icon: Library },
  { name: "My Books", href: "/my-books", icon: Bookmark },
  { name: "My Borrows", href: "/my-borrows", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e9e4dc] bg-[#faf9f6]/95 backdrop-blur-xl">
      <div className="container mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#183d32] text-white">
            <BookOpen size={23} strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#183d32]">
              BookNook
            </h1>
            <p className="text-[10px] font-medium tracking-[2px] text-gray-500">
              YOUR READING SPACE
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href + "/"));

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "text-[#183d32]"
                    : "hover:text-[#052217]"
                }`}
              >
                <Icon size={17} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-600 transition-colors hover:bg-[#5426B8] hover:text-white"
            
          >
            <Link href="/books">
               
            </Link>
          </Button>

          <Button
            variant="outline"
            className="gap-2 rounded-lg border-[#dcd6cc] font-semibold text-[#183d32] transition-all hover:border-[#5426B8] hover:bg-[#5426B8] hover:text-white"
            
          >
            <Link href="/login">
              
              <UserRound size={17} />Sign In
            </Link>
          </Button>

          <Button
            className="gap-2 rounded-lg bg-[#183d32] font-semibold text-white transition-all hover:bg-[#5426B8]"
            
          >
            <Link href="/register">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger >
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg lg:hidden"
            >
              <Menu size={22} />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[300px] border-l border-[#e9e4dc] bg-[#faf9f6] p-5"
          >
            <div className="mb-8 mt-8 flex items-center gap-2.5">
              <BookOpen className="text-[#183d32]" size={27} />
              <span className="text-xl font-bold text-[#183d32]">
                BookNook
              </span>
            </div>

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
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-[#e9eee9] text-[#183d32]"
                        : "text-gray-600 hover:bg-[#5426B8] hover:text-white"
                    }`}
                  >
                    <Icon size={19} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full hover:bg-[#5426B8] hover:text-white"
                
              >
                <Link href="/login">Sign In</Link>
              </Button>

              <Button
                className="w-full bg-[#183d32] text-white hover:bg-[#5426B8]"
                
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}
