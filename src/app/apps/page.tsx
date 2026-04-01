"use client";

import { AppCard } from "@/components/app-card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import AdBanner728 from "@/components/AdBanner728";
import { Suspense, useState } from "react";

import { useEffect } from "react";

function AppsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [displayCount, setDisplayCount] = useState(16);
  const [liveApps, setLiveApps] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/apps').then(r => r.json()).then(data => {
      setLiveApps(data.map((item: any) => ({
        ...item,
        name: item.appName || item.name || "Unknown App",
        iconUrl: item.iconUrl,
        icon: item.appName?.charAt(0) || "A"
      })));
    });
  }, []);
  
  const filteredApps = liveApps.filter(app => 
    (app.name && app.name.toLowerCase().includes(query)) || 
    (app.developer && app.developer.toLowerCase().includes(query))
  );

  const displayedApps = filteredApps.slice(0, displayCount);

  // Group apps into chunks of 8
  const chunkedApps = [];
  for (let i = 0; i < displayedApps.length; i += 8) {
    chunkedApps.push(displayedApps.slice(i, i + 8));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">
          {query ? `Search results for "${query}"` : "Mod Apps"}
        </h1>
        <p className="text-foreground/70 mt-2">Discover the latest premium unlocked and modded versions.</p>
      </div>

      {/* Top AdSense Placement */}
      {displayedApps.length > 0 && (
        <AdBanner728 placement="apps" index={1} />
      )}

      {/* Grid */}
      {displayedApps.length > 0 ? (
        <div className="space-y-12">
          {chunkedApps.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {chunk.map((app: any) => (
                  <AppCard key={app.id} {...app} />
                ))}
              </div>
              
              {/* AdSense Placement after every 8 apps - Repeating with unique indices */}
              <AdBanner728 placement="apps" index={chunkIndex + 1} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-foreground/60 w-full flex flex-col items-center justify-center">
          <Search className="h-12 w-12 text-foreground/20 mb-4" />
          <h3 className="text-xl font-bold">No apps found</h3>
          <p>We couldn't find anything matching "{searchParams.get("q")}".</p>
        </div>
      )}

      {/* Pagination / Load More */}
      {displayCount < filteredApps.length && (
        <div className="mt-12 flex justify-center">
          <Button 
            size="lg" 
            className="rounded-full"
            onClick={() => setDisplayCount(prev => prev + 16)}
          >
            Load More Apps
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AppsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Loading apps...</div>}>
      <AppsContent />
    </Suspense>
  );
}
