"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { Avatar } from "./Avatar";

// Order matters: people and opportunities are what the cohort comes here for.
const LINKS = [
  { href: "/home", label: "Home", short: "Home", icon: "◆" },
  { href: "/people", label: "People", short: "People", icon: "◉" },
  { href: "/opportunities", label: "Opportunities", short: "Roles", icon: "▲" },
  { href: "/resources", label: "Resources", short: "Library", icon: "▤" },
  { href: "/ask", label: "Ask the Cohort", short: "Ask", icon: "✳" },
  { href: "/profile", label: "My Profile", short: "Me", icon: "●" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar({
  userName,
  userPhoto,
  isAdmin,
}: {
  userName: string | null;
  userPhoto: string | null;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const visible = userName ? LINKS : LINKS.filter((l) => l.href !== "/profile");
  const links = isAdmin ? [...visible, { href: "/admin", label: "Admin", short: "Admin", icon: "⚙" }] : visible;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-30 border-b transition-all duration-300 ${
          scrolled
            ? "border-ink-200/80 bg-white/85 shadow-soft backdrop-blur-xl"
            : "border-transparent bg-ink-50/60 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link href="/home" className="group flex shrink-0 items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-200 to-amber-400 text-sm shadow-soft transition-transform duration-300 group-hover:-rotate-6">
              📚
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-ink-950">
              Beer <span className="text-amber-500">&amp;</span> Books
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  isActive(pathname, link.href)
                    ? "font-semibold text-ink-950"
                    : "text-ink-500 hover:bg-white hover:text-ink-900"
                }`}
              >
                {link.label}
                {isActive(pathname, link.href) && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-amber-400 to-accent-500" />
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden w-64 md:block">
            <SearchBar size="sm" placeholder="Search the cohort..." />
          </div>

          {userName ? (
            <Link
              href="/profile"
              title={userName}
              className="ml-auto shrink-0 rounded-full ring-2 ring-transparent transition hover:ring-amber-300 md:ml-0"
            >
              <Avatar name={userName} photo={userPhoto} size="sm" />
            </Link>
          ) : (
            <Link href="/login" className="btn-primary ml-auto shrink-0 py-1.5 text-xs md:ml-0">
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="btn-ghost -mr-2 px-2 lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? (
                <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="animate-fade-up border-t border-ink-200 bg-white px-4 py-2 lg:hidden">
            <div className="pb-2 md:hidden">
              <SearchBar size="sm" placeholder="Search the cohort..." />
            </div>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-2 py-2 text-sm ${
                  isActive(pathname, link.href)
                    ? "bg-ink-100 font-semibold text-ink-950"
                    : "text-ink-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-ink-200 bg-white/95 backdrop-blur-xl sm:hidden">
        {visible.slice(0, 5).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] leading-tight transition-colors ${
              isActive(pathname, link.href) ? "font-semibold text-amber-600" : "text-ink-500"
            }`}
          >
            <span aria-hidden className="text-[13px]">
              {link.icon}
            </span>
            {link.short}
          </Link>
        ))}
      </nav>
    </>
  );
}
