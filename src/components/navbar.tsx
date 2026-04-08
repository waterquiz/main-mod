"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [siteName, setSiteName] = useState("Bili Mod");
  const router = useRouter();

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data.siteName) setSiteName(data.siteName);
    });
  }, []);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname === "/login") return null;

  const handleMobileSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q");
    if (query) {
      router.push(`/apps?q=${encodeURIComponent(query.toString())}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 relative flex items-center justify-center rounded-full overflow-hidden">
              <Image src="/bili-logo.png" alt="Bili Mod Logo" fill className="object-cover drop-shadow-[0_0_8px_rgba(61,220,132,0.4)]" />
            </div>
            <span className="hidden sm:inline-block font-bold text-xl tracking-tight">{siteName}</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/apps" className="hover:text-foreground transition-colors">Apps</Link>
            <Link href="/categories/games" className="hover:text-foreground transition-colors">Games</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center flex-1 justify-end gap-2 sm:gap-4 md:flex-none">
          <form action="/apps" className="relative hidden sm:flex items-center w-full max-w-[240px]">
            <Search className="absolute left-2.5 h-4 w-4 text-foreground/50" />
            <input
              name="q"
              type="search"
              placeholder="Search apps & games..."
              className="w-full h-10 pl-9 pr-4 rounded-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#3DDC84] focus:outline-none focus:ring-1 focus:ring-[#3DDC84] transition-all text-sm"
            />
          </form>
          <button 
            className="sm:hidden h-10 w-10 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            onClick={() => {
              setIsMobileSearchOpen(!isMobileSearchOpen);
              if (isMobileMenuOpen) setIsMobileMenuOpen(false);
            }}
          >
            <Search className="h-5 w-5" />
          </button>
          
          <ThemeToggle />
          
          <button 
            className="md:hidden h-10 w-10 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              if (isMobileSearchOpen) setIsMobileSearchOpen(false);
            }}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-black/10 dark:border-white/10 shadow-lg p-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-2 font-medium">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">Home</Link>
            <Link href="/apps" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">Apps</Link>
            <Link href="/categories/games" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">Games</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">Blog</Link>
          </nav>
        </div>
      )}

      {/* Mobile Search Dropdown */}
      {isMobileSearchOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-background border-b border-black/10 dark:border-white/10 shadow-lg p-4">
          <form className="relative flex items-center w-full" onSubmit={handleMobileSearch}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <input
              name="q"
              type="search"
              placeholder="Search apps & games..."
              autoFocus
              className="w-full h-12 pl-10 pr-4 rounded-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#3DDC84] focus:outline-none focus:ring-1 focus:ring-[#3DDC84] transition-all"
            />
          </form>
        </div>
      )}
    </header>
  );
}
