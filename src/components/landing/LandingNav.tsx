"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function LandingNav({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "border-b border-white/10 bg-ink-950/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-200 to-amber-500 text-sm">
            🍺
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-50">
            Beer <span className="text-amber-300">&amp;</span> Chill
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 text-sm text-ink-300 md:flex">
          <a href="#how" className="hover:text-white">
            How it works
          </a>
          <a href="#inside" className="hover:text-white">
            Inside
          </a>
          <a href="#library" className="hover:text-white">
            Library
          </a>
        </nav>

        <Link href={ctaHref} className="btn-amber ml-auto md:ml-0">
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
