
import Link from "next/link";
import {
  BookOpen,

  Mail,
  MapPin,
  Heart,
} from "lucide-react";

const exploreLinks = [
  { name: "All Books", href: "/books" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
  { name: "Log In", href: "/login" },
  { name: "Register", href: "/register" },
];

const dashboardLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Discover", href: "/dashboard/discover" },
  { name: "Book Clubs", href: "/dashboard/book-clubs" },
  { name: "Bookmarks", href: "/dashboard/bookmarks" },
  { name: "Settings", href: "/dashboard/settings" },
];


export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-[#EAE7F2] bg-[#19152B] text-white">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5426B8] text-white">
                <BookOpen size={23} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Book<span className="text-[#8B5CF6]">Nook</span>
                </h2>
                <p className="text-[10px] font-medium tracking-[2px] text-[#8B5CF6]">
                  READ • BORROW • EXPLORE
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Your cozy corner for tracking books, borrowing from the library,
              and discovering your next great read.
            </p>

          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-[#8B5CF6]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Dashboard
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {dashboardLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-[#8B5CF6]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Get in Touch
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex items-center gap-2.5 text-sm text-white/60">
                <Mail size={16} className="shrink-0 text-[#8B5CF6]" />
                <a
                  href="mailto:hello@booknook.app"
                  className="transition-colors hover:text-[#8B5CF6]"
                >
                  booknook404@booknook.app
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/60">
                <MapPin size={16} className="shrink-0 text-[#8B5CF6]" />
                42 Library Lane, Booktown
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="flex items-center gap-1 text-xs text-white/50">
            &copy;2026 ,BookNook Official website.
          </p>
          <p className="flex items-center gap-1 text-xs text-white/50">
            Made with <Heart size={12} className="text-[#8B5CF6]" /> for book
            lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
