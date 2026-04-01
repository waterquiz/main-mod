import Image from "next/image";
import { Search, Flame, TrendingUp, Download, LayoutGrid, Star, Gamepad2, Wrench, Shield, Video, Camera, BookOpen, Headphones } from "lucide-react";
import { AppCard } from "@/components/app-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import AdBanner728 from "@/components/AdBanner728";
import fs from 'fs/promises';
import path from 'path';

async function getApps() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'apps.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

const CATEGORIES = [
  { slug: "action", name: "Action Games", desc: "FPS, Battle Royale, RPGs", icon: Flame, count: 0 },
  { slug: "arcade", name: "Arcade Games", desc: "Classic offline & casual games", icon: Gamepad2, count: 0 },
  { slug: "tools", name: "Premium Tools", desc: "Utilities, cleaners, file managers", icon: Wrench, count: 0 },
  { slug: "vpn", name: "VPNs & Security", desc: "Unlocked VPN proxies", icon: Shield, count: 0 },
  { slug: "streaming", name: "Streaming", desc: "Movies, Netflix alternatives", icon: Video, count: 0 },
  { slug: "photography", name: "Photo Editing", desc: "Pro unlocked camera apps", icon: Camera, count: 0 },
  { slug: "education", name: "Education", desc: "Language learning & courses", icon: BookOpen, count: 0 },
  { slug: "music", name: "Music & Audio", desc: "Spotify mods, equalizers", icon: Headphones, count: 0 },
];

export default async function Home() {
  const fileApps = await getApps();
  // Map our saved fields to what the UI expects
  const FEATURED_APPS = fileApps.map((app: any) => ({
    ...app,
    name: app.appName, // AppCard expects 'name'
    iconUrl: app.iconUrl,
    icon: app.appName?.charAt(0) || "A" // fallback icon mapping
  }));

  return (
    <div className="flex flex-col min-h-screen pb-12">


      <div className="container mx-auto px-4 space-y-12 my-8">
        
        {/* 1. Featured Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Flame className="text-[#3DDC84]" /> Featured Mods
            </h2>
            <Button variant="ghost" className="text-sm font-semibold" asChild>
              <Link href="/apps">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_APPS.slice(0, 8).map((app: any, index: number) => (
              <AppCard key={`${app.id}-${index}`} {...app} />
            ))}
          </div>
        </section>

        {/* 2. AdSense Placement - Leaderboard */}
        <AdBanner728 placement="home" index={1} />

        {/* 3. Trending Next */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="text-[#3DDC84]" /> Trending This Week
            </h2>
            <Button variant="ghost" className="text-sm font-semibold" asChild>
              <Link href="/trending">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_APPS.slice(0, 8).map((app: any, i: number) => (
              <AppCard key={`${app.id}-${i}`} {...app} />
            ))}
          </div>
        </section>

        {/* 4. AdSense Placement - Bottom Body */}
        <AdBanner728 placement="home" index={2} />

        {/* 5. Categories Grid */}
        <section className="bg-black/5 dark:bg-white/5 rounded-3xl p-8 border border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <LayoutGrid className="text-[#3DDC84]" /> Browse Categories
            </h2>
            <Button variant="ghost" className="text-sm font-semibold" asChild>
              <Link href="/categories">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => {
              const liveCount = fileApps.filter((app: any) => app.category === cat.name || app.category?.toLowerCase().includes(cat.slug)).length;
              return (
              <Link 
                key={cat.slug} 
                href={`/categories/${cat.slug}`}
                className="group block bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-6 hover:border-[#3DDC84]/50 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Background glowing blob */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#3DDC84]/20 rounded-full blur-3xl group-hover:bg-[#3DDC84]/40 transition-colors" />
                
                <div className="relative z-10 flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-background border border-black/10 dark:border-white/10 flex items-center justify-center text-[#3DDC84] group-hover:scale-110 transition-transform">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="font-mono">{liveCount}</Badge>
                </div>
                
                <div className="relative z-10">
                  <h3 className="font-bold text-lg group-hover:text-[#3DDC84] transition-colors">{cat.name}</h3>
                  <p className="text-sm text-foreground/60 mt-1">{cat.desc}</p>
                </div>
              </Link>
            )})}
          </div>
        </section>

        {/* 6. AdSense Placement - Bottom Body */}
        <AdBanner728 placement="home" index={3} />

      </div>
    </div>
  );
}
