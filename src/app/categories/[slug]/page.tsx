"use client";

import { AppCard } from "@/components/app-card";
import { Button } from "@/components/ui/button";
import AdBanner728 from "@/components/AdBanner728";
import { useState, use } from "react";

import { Search } from "lucide-react";
import { useEffect } from "react";

const CATEGORY_MAP: Record<string, string> = {
  action: "Action Games",
  arcade: "Arcade Games",
  tools: "Premium Tools",
  vpn: "VPNs & Security",
  streaming: "Streaming",
  photography: "Photo Editing",
  education: "Education",
  music: "Music & Audio",
};

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const categoryName = CATEGORY_MAP[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  const [displayCount, setDisplayCount] = useState(16);
  const [categoryApps, setCategoryApps] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/apps').then(r => r.json()).then(data => {
      const mapped = data.map((item: any) => ({
        ...item,
        name: item.appName || item.name || "Unknown App",
        icon: item.appName?.charAt(0) || "A"
      }));
      const filtered = mapped.filter((app: any) => {
        if (!app.category) return false;
        const appCat = app.category.toLowerCase();
        return appCat === categoryName.toLowerCase() || appCat.includes(slug.toLowerCase());
      });
      setCategoryApps(filtered);
    });
  }, [slug, categoryName]);
  
  const displayedApps = categoryApps.slice(0, displayCount);
  
  // Group apps into chunks of 8
  const chunkedApps = [];
  for (let i = 0; i < displayedApps.length; i += 8) {
    chunkedApps.push(displayedApps.slice(i, i + 8));
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight capitalize">Mod {categoryName}</h1>
        <p className="text-foreground/70 mt-2">Discover the latest premium unlocked and modded versions.</p>
      </div>

      {/* Top AdSense Placement */}
      {displayedApps.length > 0 && (
        <AdBanner728 placement="categories" index={1} />
      )}

      {/* Grid */}
      {displayedApps.length > 0 ? (
        <div className="space-y-12">
          {chunkedApps.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {chunk.map((app: any) => (
                  <AppCard key={app.id} {...app} category={categoryName} />
                ))}
              </div>
              
              {/* AdSense Placement after every 8 apps - Repeating */}
              <AdBanner728 placement="categories" index={chunkIndex + 1} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-foreground/60 w-full flex flex-col items-center justify-center">
          <Search className="h-12 w-12 text-foreground/20 mb-4" />
          <h3 className="text-xl font-bold">No apps found</h3>
          <p>We couldn't find any uploaded apps in the {categoryName} category yet.</p>
        </div>
      )}

      {/* Pagination / Load More */}
      {displayCount < categoryApps.length && (
        <div className="mt-12 flex justify-center">
          <Button 
            size="lg" 
            className="rounded-full"
            onClick={() => setDisplayCount(prev => prev + 16)}
          >
            Load More Games
          </Button>
        </div>
      )}
    </div>
  );
}
