
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Menu,
  UserRound,
  Library,
  Bookmark,
  History,
  Sparkles,
  BookPlus,
  Heart,
  BookText,
  LogOut,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/ThemeToggle";
import NavbarSearch from "@/components/NavbarSearch";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

 

const navLinks = [
  { name: "Home", href: "/", icon: BookOpen },
  { name: "All Books", href: "/allbooks", icon: Library },
  { name: "Add New Book", href: "/Add_new_book", icon: BookPlus },
  { name: "My Books", href: "/my-books", icon: Bookmark },
  { name: "My Borrows", href: "/my-borrows", icon: History },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Read Books", href: "/read", icon: BookText },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const {data:session} = authClient.useSession();
  const user =session?.user;
  
   const handleLogOut= ()=>{
      authClient.signOut();
   }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EAE7F2] bg-[#F5F4FA]/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#19152B]/95">
      <div className="container mx-auto flex h-[76px] max-w-7xl items-center gap-3 px-4 md:px-6">

        {/* Logo */}
        
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5426B8] text-white">
            <Link href="/" className="flex shrink-0 items-center gap-2.5"><BookOpen size={23} strokeWidth={2.2} /></Link>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#19152B] dark:text-white">
              Book<span className="text-[#5426B8]">Nook</span>
            </h1>
            <p className="text-[10px] font-medium tracking-[2px] text-[#8B5CF6]">
              READ • BORROW • EXPLORE
            </p>
          </div>
         

        {/* Search (md and up) */}
        <NavbarSearch variant="desktop" />

        {/* Right Actions (all devices) */}
        <div className="flex-1" />

        <ThemeToggle />
        {
          user? <DropdownMenu>
      <DropdownMenuTrigger render={ 
        <Avatar>
              <AvatarImage
              referrerPolicy="no-referrer"
                src={user?.image as string}
                alt="user image"
                className="grayscale "
              />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      }/>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <Avatar>
              <AvatarImage
              referrerPolicy="no-referrer"
                src={user?.image as string}
                alt="user image"
                className="grayscale mr-1 inline"
              />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar><h1 className="flex mt-1 font-bold">My Account</h1>
              <p className="flex">{user?.email}</p> 
            </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href="/profile">
            <UserRound size={16} className=" mr-1 inline"/>  Profile
             </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings size={18} className=" mr-1 inline"/>Settings
             
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut}>
          <LogOut size={18} className=" mr-1 inline"/> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> : <>
      <Link href="/login">
        <Button
          variant="outline"
          className=" gap-2 shrink-0 rounded-full border-[#dcd6cc] px-4 font-semibold text-[#5426B8] transition-all hover:border-[#5426B8] hover:bg-[#EDE9FE] hover:text-[#5426B8] sm:px-4 dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD] dark:hover:border-[#8B5CF6] dark:hover:bg-[#5426B8] dark:hover:text-white"
          
        >
          
            <UserRound size={17} className=" mr-1 inline"/>
            <span className="hidden sm:inline">Log In</span>
          
        </Button>
        </Link>
        <Link href="/register">
        <Button
          className="shrink-0 hidden sm:flex rounded-full bg-[#5426B8] px-4 font-semibold text-white transition-all hover:bg-[#451D96]"
          
        >
          
             Sign up
          
        </Button>
        </Link>
    </>
             
        }
             

        {/* Sidebar Menu (all devices) */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 rounded-lg border-[#dcd6cc] text-[#5426B8] hover:border-[#5426B8] hover:bg-[#5426B8] hover:text-white"
                aria-label="Open menu"
              />
            }
          >
            <Menu size={22} />
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
                    onClick={() => setMenuOpen(false)}
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
               { 
                user? <DropdownMenu>
                    <DropdownMenuTrigger render={ 
                      <Avatar>
                            <AvatarImage
                            referrerPolicy="no-referrer"
                              src={user?.image as string}
                              alt="user image"
                              className="grayscale "
                            />
                            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    }/>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link
                            href="/profile"
                            onClick={() => setMenuOpen(false)}
                            className="flex w-full items-center"
                          >
                            <UserRound size={16} className=" mr-1 inline"/> Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings size={18} className=" mr-1 inline"/>Settings
                          
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogOut}>
                        <LogOut size={18} className=" mr-1 inline"/> Log outz
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> : <>
                    
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full rounded-xl border-[#dcd6cc] font-semibold text-[#19152B] hover:border-[#5426B8] hover:bg-[#EDE9FE] hover:text-[#5426B8] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-[#8B5CF6] dark:hover:bg-white/10 dark:hover:text-white"
                
              >
                
                  <UserRound size={17} className="mr-1 inline" />
                  Login 
                
              </Button>
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>
              <Button
                className="w-full rounded-xl bg-[#5426B8] font-semibold text-white hover:bg-[#451D96]"
                
              >
                Sign up
              </Button>
              </Link>
                  </>
               }
              
            </div>
          </SheetContent>
        </Sheet>

      </div>

      {/* Search (below md — full-width row) */}
      <div className="px-4 pb-3 md:hidden">
        <NavbarSearch variant="mobile" />
      </div>
    </header>
  );
}

