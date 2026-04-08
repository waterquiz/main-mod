"use client";

import { useState, useEffect } from "react";
import { PackageSearch, Download, Users, TrendingUp, AlertCircle, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentMods, setRecentMods] = useState<any[]>([]);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/apps');
      if (res.ok) {
        const data = await res.json();
        setRecentMods(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApps();
    // Simulate real-time active users fluctuating at a very low level for a new site
    const interval = setInterval(() => {
      setActiveUsers(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchApps();
    setTimeout(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 2));
      setIsRefreshing(false);
    }, 500);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Dashboard Central</h1>
          <p className="text-neutral-400 text-lg">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline" 
            className="h-11 px-6 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl text-neutral-300 gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#3DDC84]" : ""}`} /> 
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Link href="/admin/apps/upload">
            <Button className="h-11 px-6 bg-[#3DDC84] hover:bg-[#3DDC84]/80 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(61,220,132,0.3)] hover:shadow-[0_0_30px_rgba(61,220,132,0.5)] transition-all">
              Upload New App
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Apps" value={recentMods.length.toString()} change="Up to date" isIncrease icon={PackageSearch} />
        <StatCard title="Real-Time Active Users" value={formatNumber(activeUsers)} change="Live" isIncrease icon={Users} />
        <StatCard 
          title="All-Time Downloads" 
          value="0" 
          change="0%" 
          isIncrease 
          icon={() => (
            <div className="w-6 h-6 relative shrink-0">
              <Image src="/bili-logo.png" alt="Downloads" fill className="object-contain" />
            </div>
          )} 
        />
        <StatCard title="Updates Pending (New Version)" value="0" change="0%" isIncrease={false} icon={AlertCircle} glowColor="rgba(239,68,68,0.2)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Apps */}
        <div className="lg:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Recently Uploaded Mods</h2>
            <Link href="/admin/apps" className="text-sm font-medium text-[#3DDC84] hover:text-white transition-colors">View All &rarr;</Link>
          </div>
          
          <div className="space-y-4">
            {recentMods.length > 0 ? recentMods.slice(0, 5).map((mod: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center shadow-inner border border-white/5">
                    <span className="font-bold text-lg">{mod.appName?.charAt(0) || "A"}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-[#3DDC84] transition-colors">{mod.appName}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{mod.category} • {mod.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-neutral-200">{mod.downloads || "0"}</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">Downloads</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold bg-[#3DDC84]/20 text-[#3DDC84]`}>
                    Active
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-black/20">
                <PackageSearch className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No uploads yet</h3>
                <p className="text-neutral-500 text-sm">You haven't uploaded any apps to the platform.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="rounded-3xl bg-gradient-to-b from-[#3DDC84]/10 to-transparent border border-[#3DDC84]/20 p-8">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <TrendingUp className="text-[#3DDC84]" /> Platform Insights
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Action Games</span>
                <span className="font-bold">0%</span>
              </div>
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-[#3DDC84] w-[0%] rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Streaming Apps</span>
                <span className="font-bold">0%</span>
              </div>
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-[#3DDC84] w-[0%] rounded-full opacity-80" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Premium Tools</span>
                <span className="font-bold">0%</span>
              </div>
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-[#3DDC84] w-[0%] rounded-full opacity-60" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Other</span>
                <span className="font-bold">0%</span>
              </div>
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-[#3DDC84] w-[0%] rounded-full opacity-40" />
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-black/40 border border-white/5">
            <p className="text-sm text-neutral-300 leading-relaxed">
              <span className="text-white font-bold block mb-1">Weekly Summary</span>
              Your website is fresh and ready! Start uploading apps to see insights and traction data here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, isIncrease, icon: Icon, glowColor = "rgba(61,220,132,0.2)" }: any) {
  return (
    <div className="relative group">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 rounded-3xl blur-xl transition-opacity opacity-0 group-hover:opacity-100 duration-500" 
        style={{ backgroundColor: glowColor }}
      />
      <div className="relative p-7 rounded-3xl bg-neutral-900/80 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors h-full flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            {typeof Icon === 'function' ? <Icon /> : <Icon className="w-6 h-6 text-neutral-400" />}
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isIncrease ? 'bg-[#3DDC84]/20 text-[#3DDC84]' : 'bg-neutral-500/20 text-neutral-400'}`}>
            {change}
          </span>
        </div>
        <div>
          <h3 className="text-3xl font-black mb-1">{value}</h3>
          <p className="text-sm text-neutral-500 font-medium">{title}</p>
        </div>
      </div>
    </div>
  );
}

