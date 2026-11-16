
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Compass,
  Bookmark,
  Users,
  Settings,
  LogOut,
  Plus,
  Repeat,
  X,
  Menu,
  Sparkles,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Books", href: "/dashboard/books", icon: Library },
  { name: "Discover", href: "/dashboard/discover", icon: Compass },
  { name: "Add New Book", href: "/dashboard/add-book", icon: Plus },
  { name: "My Books", href: "/dashboard/my-books", icon: BookOpen },
  { name: "My Borrows", href: "/dashboard/my-borrows", icon: Repeat },
  { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { name: "Book Clubs", href: "/dashboard/book-clubs", icon: Users },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        className="fixed left-4 top-4 z-[60] rounded-lg border bg-white p-2 shadow-sm lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          group fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-[#EAE7F2]
          bg-white
          transition-all duration-300 ease-in-out

          md:w-20 md:hover:w-64
          lg:w-64

          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-[#EAE7F2] px-5">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EAFF] text-[#5426B8]">
              <BookOpen size={27} />
              <Sparkles
                size={12}
                className="absolute -right-1 -top-1 text-[#8B5CF6]"
              />
            </div>

            <div className="hidden group-hover:block lg:block md:group-hover:block">
              <h1 className="whitespace-nowrap text-xl font-bold text-[#19152B]">
                Book<span className="text-[#5426B8]">Nook</span>
              </h1>
              <p className="whitespace-nowrap text-[10px] tracking-wider text-gray-500">
                READ • DISCOVER • GROW
              </p>
            </div>
          </Link>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-1 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
          <p className="mb-4 hidden px-3 text-xs font-semibold uppercase tracking-widest text-gray-400 group-hover:block lg:block">
            Main Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                title={item.name}
                className="
                  flex items-center gap-3
                  rounded-xl px-3 py-3
                  text-sm font-medium
                  text-[#6B6877]
                  transition-all duration-200

                  hover:bg-[#5426B8]
                  hover:text-white
                  hover:shadow-md
                  hover:shadow-purple-200

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#8B5CF6]

                  md:justify-center
                  md:group-hover:justify-start
                  lg:justify-start
                "
              >
                <Icon size={20} className="shrink-0" />

                <span className="hidden whitespace-nowrap group-hover:inline lg:inline">
                  {item.name}
                </span>
              </Link>
            );
          })}

          <div className="my-5 border-t border-[#EAE7F2]" />

          {/* Settings */}
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="
              flex items-center gap-3 rounded-xl px-3 py-3
              text-sm font-medium text-[#6B6877]
              transition-all duration-200
              hover:bg-[#5426B8] hover:text-white
              md:justify-center md:group-hover:justify-start
              lg:justify-start
            "
            title="Settings"
          >
            <Settings size={20} className="shrink-0" />

            <span className="hidden group-hover:inline lg:inline">
              Settings
            </span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="border-t border-[#EAE7F2] p-3">
          <button
            onClick={() => {
              // Add your logout function here
            }}
            className="
              flex w-full items-center gap-3
              rounded-xl px-3 py-3
              text-sm font-medium text-red-500
              transition-all duration-200
              hover:bg-red-500 hover:text-white
              md:justify-center md:group-hover:justify-start
              lg:justify-start
            "
          >
            <LogOut size={20} className="shrink-0" />

            <span className="hidden group-hover:inline lg:inline">
              Logout
            </span>
          </button>

          <p className="mt-3 hidden text-center text-xs text-gray-400 group-hover:block lg:block">
            © 2026 BookNook
          </p>
        </div>
      </aside>
    </>
  );
}
