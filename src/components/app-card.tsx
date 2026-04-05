import Link from "next/link";
import Image from "next/image";
import { Star, Download } from "lucide-react";
import { Badge } from "./ui/badge";

interface AppCardProps {
  id: string;
  name: string;
  developer: string;
  icon?: string;
  iconUrl?: string;
  rating: number;
  size: string;
  version: string;
  downloads: string;
  category: string;
  features: string | string[];
}

export function AppCard({ id, name, developer, icon, iconUrl, rating, size, version, downloads, category, features }: AppCardProps) {
  return (
    <Link href={`/apps/${id}`} className="group relative bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl p-4 flex flex-col gap-4 hover:shadow-xl hover:border-[#3DDC84]/50 transition-all duration-300 overflow-hidden">
      {/* Decorative gradient blob on hover */}
      <div className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <Image src="/download-icon.png" alt="Download" fill className="object-contain" />
      </div>
      {/* Decorative gradient blob on hover */}
      <div className="absolute -inset-x-12 -inset-y-12 bg-gradient-to-br from-[#3DDC84]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[50%] blur-2xl" />
      
      <div className="flex gap-4 items-start relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex-shrink-0 overflow-hidden border border-black/5 dark:border-white/5 p-2 relative">
          {iconUrl ? (
            <div className="w-full h-full relative rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
               <Image src={iconUrl} alt={name} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#3DDC84] to-emerald-600 flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-xl">{name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base truncate group-hover:text-[#3DDC84] transition-colors">{name}</h3>
          
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5 text-yellow-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-semibold text-foreground/80">{rating}</span>
            </div>
            <span className="text-foreground/30 text-[10px]">•</span>
            <span className="text-[11px] text-foreground/60">{size}</span>
            <span className="text-foreground/30 text-[10px]">•</span>
            <span className="text-[11px] text-foreground/60">v{version}</span>
          </div>
          <div className="mt-1">
            <span className="text-[11px] text-[#3DDC84] font-medium">
              {Array.isArray(features) ? features.join(', ') : features}
            </span>
          </div>
        </div>
      </div>
      
    </Link>
  );
}
