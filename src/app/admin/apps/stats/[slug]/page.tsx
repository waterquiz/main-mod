import path from "path";
import fs from "fs/promises";
import Link from "next/link";
import { BarChart, Star, Info, ChevronLeft, Calendar, Package, FileText, LayoutList } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function AppStatsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  let apps = [];
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'apps.json');
    const raw = await fs.readFile(dataPath, 'utf-8');
    apps = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read apps.json", err);
  }

  const appData = apps.find((a: any) => a.id === slug);

  if (!appData) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">App Not Found</h1>
        <p className="text-neutral-400 mb-8">The application data could not be located in the database.</p>
        <Link href="/admin/apps">
          <Button className="bg-[#3DDC84] text-black font-bold hover:bg-[#3DDC84]/80 text-sm">
            <ChevronLeft className="w-4 h-4 mr-2" /> Return to Manage Apps
          </Button>
        </Link>
      </div>
    );
  }

  // Parse metrics safely
  const downloadCount = appData.downloads || "0";
  const ratingValue = appData.rating || "0.0";
  const reviewsCount = appData.reviews?.length || 0;

  return (
    <div className="space-y-8 pb-20 relative animate-in fade-in duration-300">
      
      {/* Header Navigation */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <Link href="/admin/apps">
          <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 bg-black/50 hover:bg-white/10 text-neutral-300 rounded-xl transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            <BarChart className="w-6 h-6 text-[#3DDC84]" /> {appData.appName || appData.name} Statistics
          </h1>
          <p className="text-neutral-400 mt-1 capitalize">{appData.developer || "Unknown Developer"} • {appData.category || "Uncategorized"}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Downloads */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="w-16 h-16 relative">
              <Image src="/download-icon.png" alt="Downloads" fill className="object-contain" />
            </div>
          </div>
          <div className="relative z-10 space-y-2">
            <div className="text-neutral-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              Downloads
            </div>
            <div className="text-4xl font-black">{downloadCount}</div>
          </div>
        </div>

        {/* Global Rating */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
            <Star className="w-16 h-16 text-yellow-500" />
          </div>
          <div className="relative z-10 space-y-2">
            <div className="text-neutral-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              Average Rating
            </div>
            <div className="text-4xl font-black flex items-center gap-2">
              {ratingValue} <span className="text-yellow-500 text-2xl">★</span>
            </div>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
            <FileText className="w-16 h-16 text-blue-500" />
          </div>
          <div className="relative z-10 space-y-2">
            <div className="text-neutral-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              Total Reviews
            </div>
            <div className="text-4xl font-black flex items-center gap-2">
              {reviewsCount}
            </div>
          </div>
        </div>

        {/* App Status */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
            <Info className="w-16 h-16 text-purple-500" />
          </div>
          <div className="relative z-10 space-y-2">
            <div className="text-neutral-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              Data Status
            </div>
            <div className={`text-xl font-black flex items-center gap-2 mt-2 px-3 py-1 rounded-full w-fit ${appData.status === 'Active' ? 'bg-[#3DDC84]/20 text-[#3DDC84]' : 'bg-yellow-500/20 text-yellow-500'}`}>
              {appData.status || "Active"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Full Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <Package className="w-5 h-5 text-[#3DDC84]" /> Detailed Configuration
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              <div className="space-y-1">
                <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Package ID (Slug)</span>
                <p className="text-sm font-mono text-neutral-300 break-words">{appData.id}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Storage Size</span>
                <p className="text-sm font-medium text-neutral-300">{appData.size || "Unknown"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Version</span>
                <p className="text-sm font-medium text-neutral-300">{appData.version || "1.0.0"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Download URL / Path</span>
                <p className="text-xs sm:text-sm font-mono text-[#3DDC84] break-all">{appData.downloadUrl || "Not Available"}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
              <h3 className="text-sm text-neutral-500 uppercase font-bold tracking-wider">Features Array</h3>
              <div className="flex flex-wrap gap-2">
                {appData.features && appData.features.length > 0 ? (
                  appData.features.map((feat: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-neutral-300">{feat}</span>
                  ))
                ) : (
                  <span className="text-sm text-neutral-600 italic">No mod features listed.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Snapshot Column */}
        <div className="space-y-6">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 sm:p-8 rounded-3xl h-full">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <LayoutList className="w-5 h-5 text-blue-400" /> Recent User Reviews
            </h2>

            {!appData.reviews || appData.reviews.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                <FileText className="w-12 h-12 mb-4 text-neutral-500" />
                <p className="text-sm font-medium">No reviews submitted yet.</p>
                <p className="text-xs text-neutral-400 mt-1">Users can leave a review on the public post page.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...appData.reviews].reverse().map((rev: any, idx) => (
                  <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl relative">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">
                          {rev.user?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="font-bold text-sm text-white">{rev.user}</span>
                      </div>
                      <span className="text-yellow-500 text-xs font-bold leading-none bg-yellow-500/10 px-2 py-1 rounded flex items-center gap-1">
                        {rev.rating} ★
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed whitespace-pre-wrap">{rev.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
