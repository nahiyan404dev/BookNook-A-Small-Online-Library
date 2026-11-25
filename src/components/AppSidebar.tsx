"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  BookText,
  ChevronsUpDown,
  Heart,
  History,
  Library,
  LogIn,
  LogOut,
  Plus,
  Quote,
  Sparkles,
  UserPlus,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Library",
    items: [
      { title: "Home", href: "/", icon: BookOpen },
      { title: "All Books", href: "/allbooks", icon: Library },
      { title: "My Books", href: "/my-books", icon: Bookmark },
      { title: "Wishlist", href: "/wishlist", icon: Heart },
    ],
  },
  {
    label: "Reading",
    items: [
      { title: "My Borrows", href: "/my-borrows", icon: History },
      { title: "Read Books", href: "/read", icon: BookText },
    ],
  },
  {
    label: "Account",
    items: [{ title: "Profile", href: "/profile", icon: UserRound }],
  },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * BookNook's primary navigation sidebar.
 *
 * Usage:
 * <SidebarProvider>
 *   <AppSidebar />
 *   <SidebarInset>{children}</SidebarInset>
 * </SidebarProvider>
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        // BookNook palette, scoped to the sidebar only.
        "[--sidebar:#F7F5FC] [--sidebar-foreground:#3F3D56] [--sidebar-border:#EAE7F2] [--sidebar-accent:#F0EDF8] [--sidebar-accent-foreground:#5426B8] [--sidebar-ring:#8B5CF6]",
        "dark:[--sidebar:#19152B] dark:[--sidebar-foreground:#E8E4F6] dark:[--sidebar-border:rgba(255,255,255,0.08)] dark:[--sidebar-accent:#241E3B] dark:[--sidebar-accent-foreground:#D8CCFF] dark:[--sidebar-ring:#8B5CF6]",
        // Active item tokens.
        "[--bn-active:#EDE9FE] [--bn-active-foreground:#5426B8] dark:[--bn-active:#2E2551] dark:[--bn-active-foreground:#DDD3FF]"
      )}
    >
      <SidebarHeader className="border-b border-[#EAE7F2] p-3 dark:border-white/10">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl p-1 transition-colors hover:bg-[#EDE9FE]/60 dark:hover:bg-white/5"
          >
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5426B8] to-[#8B5CF6] text-white shadow-lg shadow-[#5426B8]/30">
              <BookOpen size={22} strokeWidth={2.2} />
              <Sparkles
                size={12}
                className="absolute -top-1 -right-1 text-[#C4B5FD]"
              />
            </span>

            <span className="min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="block truncate text-lg font-bold tracking-tight text-[#19152B] dark:text-white">
                Book<span className="text-[#5426B8] dark:text-[#C4B5FD]">Nook</span>
              </span>
              <span className="block truncate text-[9px] font-semibold tracking-[0.2em] text-[#8B5CF6]">
                READ • BORROW • EXPLORE
              </span>
            </span>
          </Link>

          <SidebarTrigger className="shrink-0 text-[#8B5CF6] transition-colors hover:bg-[#EDE9FE] hover:text-[#5426B8] group-data-[collapsible=icon]:hidden dark:hover:bg-white/10 dark:hover:text-[#C4B5FD]" />
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/Add_new_book" />}
              tooltip="Add a new book"
              className="h-10 rounded-xl font-semibold text-white shadow-md shadow-[#5426B8]/25 [&_svg]:size-4"
              style={{
                background: "linear-gradient(135deg, #5426B8 0%, #7C3AED 100%)",
                color: "#FFFFFF",
              }}
            >
              <Plus />
              <span>Add a new book</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] font-semibold tracking-[0.16em] text-[#8B5CF6] uppercase dark:text-[#A78BFA]">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(pathname, item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        tooltip={item.title}
                        isActive={active}
                        className={cn(
                          "relative h-10 rounded-xl px-3 font-medium transition-all duration-200",
                          "hover:translate-x-0.5",
                          active &&
                            "font-semibold shadow-sm shadow-[#5426B8]/10 hover:translate-x-0"
                        )}
                        style={
                          active
                            ? {
                                backgroundColor: "var(--bn-active)",
                                color: "var(--bn-active-foreground)",
                              }
                            : undefined
                        }
                      >
                        {active && (
                          <span
                            aria-hidden
                            className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#8B5CF6] to-[#5426B8] group-data-[collapsible=icon]:hidden"
                          />
                        )}
                        <Icon
                          strokeWidth={active ? 2.4 : 2}
                          className="transition-transform duration-200 group-hover/menu-button:scale-110"
                        />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <div className="mt-auto px-3 pb-2 group-data-[collapsible=icon]:hidden">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5426B8] to-[#7C3AED] p-4 text-white shadow-lg shadow-[#5426B8]/20">
            <div className="absolute -top-6 -right-6 size-20 rounded-full bg-white/10 blur-xl" />
            <Quote size={18} className="text-white/70" />
            <p className="mt-2 text-xs leading-relaxed text-white/90">
              A room without books is like a body without a soul.
            </p>
            <p className="mt-2 text-[9px] font-semibold tracking-[0.18em] text-white/60 uppercase">
              Cicero
            </p>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#EAE7F2] p-2 dark:border-white/10">
        <SidebarUserMenu />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function SidebarUserMenu() {
  const { isMobile } = useSidebar();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (!user) {
    return (
      <SidebarMenu className="gap-1">
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<Link href="/login" />}
            tooltip="Log in"
            className="h-10 rounded-xl font-medium"
          >
            <LogIn />
            <span>Log in</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<Link href="/register" />}
            tooltip="Create account"
            className="h-10 rounded-xl font-semibold text-white shadow-md shadow-[#5426B8]/25"
            style={{
              background: "linear-gradient(135deg, #5426B8 0%, #7C3AED 100%)",
              color: "#FFFFFF",
            }}
          >
            <UserPlus />
            <span>Create account</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="rounded-xl data-popup-open:bg-[#EDE9FE] dark:data-popup-open:bg-white/10"
              />
            }
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarImage
                referrerPolicy="no-referrer"
                src={user.image ?? undefined}
                alt={user.name}
                className="rounded-lg grayscale"
              />
              <AvatarFallback className="rounded-lg bg-[#EDE9FE] font-semibold text-[#5426B8] dark:bg-[#2E2551] dark:text-[#C4B5FD]">
                {user.name?.charAt(0) ?? "B"}
              </AvatarFallback>
            </Avatar>

            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold text-[#19152B] dark:text-white">
                {user.name}
              </span>
              <span className="truncate text-xs text-[#7A7690] dark:text-white/60">
                {user.email}
              </span>
            </div>

            <ChevronsUpDown className="ml-auto size-4 text-[#8B5CF6] group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
            className="min-w-60 rounded-2xl border border-[#EAE7F2] bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-[#1F1A33]"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2.5">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={user.image ?? undefined}
                    alt={user.name}
                    className="rounded-lg grayscale"
                  />
                  <AvatarFallback className="rounded-lg bg-[#EDE9FE] font-semibold text-[#5426B8] dark:bg-[#2E2551] dark:text-[#C4B5FD]">
                    {user.name?.charAt(0) ?? "B"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 leading-tight">
                  <span className="truncate text-sm font-semibold text-[#19152B] dark:text-white">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                render={<Link href="/profile" />}
                className="rounded-xl text-[#3F3D56] focus:bg-[#EDE9FE] focus:text-[#5426B8] dark:text-white/80 dark:focus:bg-white/10 dark:focus:text-white"
              >
                <UserRound />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => authClient.signOut()}
              className="rounded-xl text-[#3F3D56] focus:bg-[#EDE9FE] focus:text-[#5426B8] dark:text-white/80 dark:focus:bg-white/10 dark:focus:text-white"
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default AppSidebar;
