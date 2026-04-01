import Image from "next/image";
import { Star, Download, ShieldCheck, Smartphone, Info, History, Flame, Gamepad2, Wrench, Shield, Video, Camera, BookOpen, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReviewsList } from "@/components/reviews-list";
import Link from "next/link";
import AdBanner728 from "@/components/AdBanner728";
import AdSidebar300 from "@/components/AdSidebar300";
import fs from 'fs/promises';
import path from 'path';

async function getAppsData() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'apps.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}



const CATEGORIES = [
  { slug: "action", name: "Action Games", icon: Flame, count: 0 },
  { slug: "arcade", name: "Arcade Games", icon: Gamepad2, count: 0 },
  { slug: "tools", name: "Premium Tools", icon: Wrench, count: 0 },
  { slug: "vpn", name: "VPNs & Security", icon: Shield, count: 0 },
  { slug: "streaming", name: "Streaming", icon: Video, count: 0 },
  { slug: "photography", name: "Photo Editing", icon: Camera, count: 0 },
  { slug: "education", name: "Education", icon: BookOpen, count: 0 },
  { slug: "music", name: "Music & Audio", icon: Headphones, count: 0 },
];

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Use await for Next.js 15 route params
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const isGame = slug.includes("gta") || slug.includes("minecraft");

  const allApps = await getAppsData();
  const appData = allApps.find((a: any) => a.id === slug) || {};
  const name = appData.appName || appData.name || slug.replace(/-/g, " ");
  const developer = appData.developer || "Top Developer Studio";
  const version = appData.version || "V2.10.4";
  const rating = appData.rating || "4.8";
  const size = appData.size || "125 MB";
  const downloads = appData.downloads || "5,000,000+";
  const fullDesc = appData.fullDesc || `Experience the ultimate unlocked journey with our verified Mod APK for ${name}.`;

  let modFeatures = appData.features || ["Premium Unlocked", "No Ads", "No Watermark"];

  if (slug === "spotify-premium-mod") {
    modFeatures = ["Premium Unlocked", "Unlimited Watch", "No Ads"];
  } else if (slug === "capcut-pro-unlocked") {
    modFeatures = ["Premium Unlocked", "No Watermark", "No Ads"];
  } else if (slug === "subway-surfers-mod") {
    modFeatures = ["Premium Unlocked", "Unlimited Money", "No Ads"];
  } else if (slug.includes("mod-menu") || slug.includes("gta") || slug.includes("roblox")) {
    modFeatures = ["God Mode", "Mod Menu"];
  }

  // Find real related apps
  // Strategy: prioritize same category, otherwise just fallback to other uploaded apps
  let relatedApps = allApps.filter((a: any) => a.id !== slug && a.category === appData.category);
  if (relatedApps.length < 6) {
    const mixed = allApps.filter((a: any) => a.id !== slug && !relatedApps.find((r: any) => r.id === a.id));
    relatedApps = [...relatedApps, ...mixed];
  }
  relatedApps = relatedApps.slice(0, 6);


  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumbs */}
      <nav className="text-sm text-foreground/50 mb-6 flex items-center gap-2">
        <span>Home</span>
        <span>/</span>
        <span>Apps</span>
        <span>/</span>
        <span className="text-foreground capitalize">{slug.replace(/-/g, " ")}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">

          {/* Header Info */}
          <div className="flex flex-row gap-4 sm:gap-6 items-center sm:items-start">
            <div className={`w-20 h-20 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center shadow-lg shrink-0 overflow-hidden ${!appData.iconUrl ? 'bg-gradient-to-br from-[#3DDC84] to-emerald-600' : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 relative'}`}>
              {appData.iconUrl ? (
                <Image src={appData.iconUrl} alt={name} fill className="object-cover" unoptimized />
              ) : (
                <span className="text-white font-bold text-4xl sm:text-5xl capitalize">{name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight capitalize truncate sm:whitespace-normal">
                {name.toLowerCase().includes('mod apk') 
                  ? name 
                  : name.toLowerCase().includes('mod') 
                    ? `${name} APK` 
                    : name.toLowerCase().includes('apk') 
                      ? name 
                      : `${name} Mod APK`}
              </h1>
              <p className="text-xs sm:text-sm text-foreground/70 font-medium truncate">{developer}</p>

              <div className="flex flex-wrap items-center gap-3">
                <Badge>v{version}</Badge>
                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {rating}
                </div>
                <div className="flex items-center gap-1 text-[#3DDC84] bg-[#3DDC84]/10 px-2 py-0.5 rounded-full text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" /> Trusted
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <div className="text-center">
              <div className="text-xs text-foreground/50 mb-1 flex items-center justify-center gap-1"><Smartphone className="w-3 h-3" /> Android</div>
              <div className="font-semibold text-sm">5.0+</div>
            </div>
            <div className="text-center border-l border-black/5 dark:border-white/5">
              <div className="text-xs text-foreground/50 mb-1 flex items-center justify-center gap-1"><Info className="w-3 h-3" /> Size</div>
              <div className="font-semibold text-sm">{size}</div>
            </div>
            <div className="text-center sm:border-l border-black/5 dark:border-white/5">
              <div className="text-xs text-foreground/50 mb-1 flex items-center justify-center gap-1"><Download className="w-3 h-3" /> Downloads</div>
              <div className="font-semibold text-sm">{downloads}</div>
            </div>
            <div className="text-center border-l border-black/5 dark:border-white/5">
              <div className="text-xs text-foreground/50 mb-1 flex items-center justify-center gap-1"><History className="w-3 h-3" /> Updated</div>
              <div className="font-semibold text-sm">Oct 24, 2024</div>
            </div>
          </div>

          {/* Mod Features Grid */}
          <div className={`grid grid-cols-2 ${modFeatures.length === 2 ? 'sm:grid-cols-2' : modFeatures.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4'} gap-4 p-4 rounded-2xl bg-[#3DDC84]/10 border border-[#3DDC84]/30`}>
            {modFeatures.map((feature: string, idx: number) => (
              <div key={idx} className={`text-center ${modFeatures.length === 3 && idx === 2 ? 'col-span-2 sm:col-span-1' : ''} ${idx % 2 !== 0 ? 'border-l' : ''} ${idx > 0 ? 'sm:border-l' : 'border-l-0'} border-[#3DDC84]/20`}>
                <div className="text-xs text-[#3DDC84] mb-1 flex items-center justify-center gap-1"><Flame className="w-3 h-3" /> Feature</div>
                <div className="font-semibold text-sm">{feature}</div>
              </div>
            ))}
          </div>

          {/* Screenshots Carousel */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Screenshots</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {appData.screenshotUrls && appData.screenshotUrls.length > 0 ? (
                appData.screenshotUrls.map((url: string, i: number) => (
                  <div key={i} className="shrink-0 w-40 sm:w-60 aspect-[9/16] bg-black/10 dark:bg-white/10 rounded-xl snap-center flex items-center justify-center overflow-hidden border border-black/10 dark:border-white/10 relative">
                    <Image src={url} alt={`Screenshot ${i + 1}`} fill className="object-cover" unoptimized />
                  </div>
                ))
              ) : (
                [1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="shrink-0 w-40 sm:w-60 aspect-[9/16] bg-black/10 dark:bg-white/10 rounded-xl snap-center flex items-center justify-center">
                    <span className="text-foreground/30">Screenshot {i}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Inline Ad Placement */}
          <AdBanner728 placement="post" index={1} />

          {/* Download CTA Inline */}
          <div className="flex justify-center my-8">
            {appData.downloadUrl ? (
              appData.downloadUrl.startsWith('http') ? (
                <a href={appData.downloadUrl} className="w-full sm:max-w-md">
                  <Button className="w-full h-14 text-lg font-bold shadow-lg shadow-[#3DDC84]/20 flex gap-3 animate-pulse rounded-full">
                    <Download className="w-6 h-6" /> Download Mod ({size})
                  </Button>
                </a>
              ) : (
                <a href={appData.downloadUrl} download className="w-full sm:max-w-md">
                  <Button className="w-full h-14 text-lg font-bold shadow-lg shadow-[#3DDC84]/20 flex gap-3 animate-pulse rounded-full">
                    <Download className="w-6 h-6" /> Download Mod ({size})
                  </Button>
                </a>
              )
            ) : (
              <Button disabled className="w-full sm:max-w-md h-14 text-lg font-bold shadow-lg shadow-[#3DDC84]/20 flex gap-3 rounded-full opacity-50">
                <Download className="w-6 h-6" /> Download Unavailable
              </Button>
            )}
          </div>

          {/* Description */}
          <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 border border-black/5 dark:border-white/5 space-y-4 mt-6">
            <h2 className="text-xl font-bold">About {name}</h2>
            <div className="prose dark:prose-invert text-sm text-foreground/80 leading-relaxed max-w-none text-justify whitespace-pre-wrap">
              {fullDesc}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6 sticky top-24">
          <h2 className="text-xl font-bold mb-4">Related {isGame ? "Games" : "Apps"}</h2>

          {/* First 6 Related Apps */}
          <div className="space-y-4">
            {relatedApps.length > 0 ? (
              relatedApps.map((app: any, i: number) => (
                <Link key={i} href={`/apps/${app.id}`} className="flex items-center gap-4 p-3 rounded-2xl border border-black/5 dark:border-white/5 hover:border-[#3DDC84]/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 text-white relative overflow-hidden text-sm border border-black/5 dark:border-white/5 ${!app.iconUrl ? 'bg-gradient-to-br from-[#3DDC84] to-emerald-600' : 'bg-black/5 dark:bg-white/5'}`}>
                    {app.iconUrl ? (
                      <Image src={app.iconUrl} alt={app.appName || "App icon"} fill className="object-cover" unoptimized />
                    ) : (
                      (app.appName || "A").charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{app.appName || app.name || "Unknown App"}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex items-center gap-0.5 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-semibold text-foreground/80">{app.rating || "4.8"}</span>
                      </div>
                      <span className="text-foreground/30 text-[10px]">•</span>
                      <span className="text-[10px] text-foreground/60">{app.size || "85 MB"}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-sm text-foreground/50 italic py-4">No related apps available right now.</div>
            )}
          </div>

          {/* Ad Placement */}
          <AdSidebar300 placement="post" index={1} />

          {/* Categories Sidebar */}
          <div>
            <h3 className="font-bold mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => {
                const liveCount = allApps.filter((app: any) => app.category === cat.name || app.category?.toLowerCase().includes(cat.slug)).length;
                return (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="flex items-center justify-between p-3 rounded-2xl border border-black/5 dark:border-white/5 hover:border-[#3DDC84]/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#3DDC84]/10 text-[#3DDC84] flex items-center justify-center group-hover:bg-gradient-to-br from-[#3DDC84] to-emerald-600 group-hover:text-white transition-all">
                        <cat.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm truncate">{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-foreground/40 font-mono font-semibold bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">{liveCount}</span>
                  </Link>
                )
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Installation Guide & Comments */}
      <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-6">How to Install Mod APK?</h2>
          <ol className="space-y-4 text-sm text-foreground/80 list-decimal pl-4">
            <li className="pl-2"><strong>Uninstall original version:</strong> If you have the original version of this app installed from Google Play, you must uninstall it first to avoid signature conflicts.</li>
            <li className="pl-2"><strong>Download the file:</strong> Scroll up to the top of this page and tap on the <strong>Download Mod APK</strong> button. Wait for the secure download to finish.</li>
            <li className="pl-2"><strong>Locate the APK:</strong> Once downloaded, open your device's <strong>File Manager</strong> or Downloads app and locate the newly downloaded APK file.</li>
            <li className="pl-2"><strong>Enable Unknown Sources:</strong> Tap the file to install. If your device prompts a security warning, go to Settings and toggle on <strong>"Allow installation from Unknown Sources"</strong> (or "Allow from this source").</li>
            <li className="pl-2"><strong>Install and Launch:</strong> Return to the installation screen and tap <strong>Install</strong>. Once completed, launch the app and enjoy all the fully unlocked premium features immediately!</li>
          </ol>
        </div>

        {/* User Reviews */}
        <div className="w-full">
          <ReviewsList initialReviews={appData.reviews || []} appId={appData.id || slug} />
        </div>
      </div>

    </div>
  );
}
