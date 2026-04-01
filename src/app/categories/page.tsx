import { Flame, Gamepad2, Wrench, Shield, Video, Camera, BookOpen, Headphones } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
  { slug: "action", name: "Action Games", desc: "FPS, Battle Royale, RPGs", icon: Flame },
  { slug: "arcade", name: "Arcade Games", desc: "Classic offline & casual games", icon: Gamepad2 },
  { slug: "tools", name: "Premium Tools", desc: "Utilities, cleaners, file managers", icon: Wrench },
  { slug: "vpn", name: "VPNs & Security", desc: "Unlocked VPN proxies", icon: Shield },
  { slug: "streaming", name: "Streaming", desc: "Movies, Netflix alternatives", icon: Video },
  { slug: "photography", name: "Photo Editing", desc: "Pro unlocked camera apps", icon: Camera },
  { slug: "education", name: "Education", desc: "Language learning & courses", icon: BookOpen },
  { slug: "music", name: "Music & Audio", desc: "Spotify mods, equalizers", icon: Headphones },
];

export default async function CategoriesPage() {
  const fileApps = await getApps();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Categories</h1>
        <p className="text-foreground/70">Find exactly what you're looking for across our collection of premium apps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => {
          const liveCount = fileApps.filter((app: any) => 
            app.category === cat.name || app.category?.toLowerCase().includes(cat.slug)
          ).length;

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
          );
        })}
      </div>

      {/* Category Ad Placement */}
      <AdBanner728 placement="categories" index={1} />
    </div>
  );
}
