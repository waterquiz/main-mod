"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [siteName, setSiteName] = useState("Bili Mod");
  const [metaDesc, setMetaDesc] = useState("Your trusted platform for safe, fast, and secure Android app and game mod downloads. Discover thousands of premium apps for free.");

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data.siteName) setSiteName(data.siteName);
      if (data.metaDescription) setMetaDesc(data.metaDescription);
    });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (pathname?.startsWith("/admin") || pathname === "/login") return null;

  return (
    <footer className="border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 relative flex items-center justify-center">
                <Image src="/bili-logo.png" alt="Bili Mod Logo" fill className="object-contain drop-shadow-[0_0_8px_rgba(61,220,132,0.4)]" />
              </div>
              <span className="font-bold text-xl tracking-tight">{siteName}</span>
            </Link>
            <p className="text-sm text-foreground/70 max-w-xs leading-relaxed">
              {metaDesc}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold tracking-tight">Quick Links</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link href="/apps" className="hover:text-[#3DDC84] transition-colors">Apps</Link></li>
              <li><Link href="/categories/games" className="hover:text-[#3DDC84] transition-colors">Games</Link></li>
              <li><Link href="/blog" className="hover:text-[#3DDC84] transition-colors">Blog</Link></li>
              <li><Link href="/categories" className="hover:text-[#3DDC84] transition-colors">Categories</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold tracking-tight">Legal</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link href="/about" className="hover:text-[#3DDC84] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#3DDC84] transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-[#3DDC84] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#3DDC84] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold tracking-tight">Newsletter</h3>
            <p className="text-sm text-foreground/70">Get the latest mod updates directly in your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                required
                disabled={status === "loading" || status === "success"}
                className="w-full h-10 px-3 rounded-md bg-background border border-black/10 dark:border-white/10 focus:border-[#3DDC84] focus:outline-none focus:ring-1 focus:ring-[#3DDC84] transition-all text-sm disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={status === "loading" || status === "success"}
                className="h-10 px-4 rounded-md bg-[#3DDC84] hover:bg-[#2BB667] text-white font-medium transition-colors text-sm shrink-0 disabled:opacity-50"
              >
                {status === "loading" ? "..." : status === "success" ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
            {status === "error" && <p className="text-red-500 text-xs mt-2">Error subscribing. Try again.</p>}
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground/50">
          <p>© {new Date().getFullYear()} Bili Mod. All rights reserved.</p>
          <p>Made with ❤️ for Android lovers.</p>
        </div>
      </div>
    </footer>
  );
}
