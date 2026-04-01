"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2, Layout, LayoutPanelTop, Monitor, Smartphone, Globe, Code, ShieldCheck, Activity, Home, Package, LayoutGrid, TrendingUp, Layers, Newspaper, Gamepad2, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdsManagerPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeAdTab, setActiveAdTab] = useState<'home' | 'apps' | 'categories' | 'trending' | 'blog' | 'post' | 'global'>('home');
  
  const [settings, setSettings] = useState<any>({
    ad_728x90_enabled: true,
    ad_728x90_home_1: "", ad_728x90_home_2: "", ad_728x90_home_3: "",
    ad_728x90_apps_1: "", ad_728x90_apps_2: "", ad_728x90_apps_3: "",
    ad_728x90_categories_1: "", ad_728x90_categories_2: "", ad_728x90_categories_3: "",
    ad_728x90_trending_1: "", ad_728x90_trending_2: "", ad_728x90_trending_3: "",
    ad_728x90_blog_1: "", ad_728x90_blog_2: "", ad_728x90_blog_3: "",
    ad_728x90_post_1: "",
    ad_300x250_enabled: true,
    ad_300x250_post_1: "",
    ad_global_enabled: true,
    ad_popunder_1: "", ad_popunder_2: "", ad_popunder_3: "",
    ad_socialbar_1: "", ad_socialbar_2: "", ad_socialbar_3: ""
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        const newSettings = { ...settings };
        Object.keys(settings).forEach(key => {
          if (data[key] !== undefined) newSettings[key] = data[key];
        });
        setSettings(newSettings);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentSettingsRes = await fetch('/api/settings');
      const currentSettings = await currentSettingsRes.json();
      const newSettings = { ...currentSettings, ...settings };
      
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      
      setIsSaving(false); setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setIsSaving(false);
    }
  };

  const updateAdCode = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const renderSlots = (prefix: string, titleName: string, isSidebar: boolean = false, count: number = 3) => {
    return Array.from({ length: count }, (_, i) => i + 1).map(index => {
      const key = `${prefix}_${index}`;
      return (
        <AdSection 
          key={key}
          title={`${titleName} ${count === 1 ? '' : index} Slot`} 
          index={index} 
          isSidebar={isSidebar}
          code={settings[key]} 
          onCodeChange={(val: string) => updateAdCode(key, val)} 
        />
      );
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.03] backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3DDC84]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Ads Manager</h1>
          <p className="text-neutral-400 max-w-md text-sm">Now with high-performance Popunder and Social Bar global scripts. Manage every ad format site-wide.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className={`h-12 px-8 font-black rounded-2xl shadow-[0_0_30px_rgba(61,220,132,0.2)] transition-all flex items-center gap-3 relative z-10 ${isSaved ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-[#3DDC84] hover:bg-[#3DDC84]/90 text-black hover:shadow-[0_0_40px_rgba(61,220,132,0.4)]'}`}>
          {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save All Slots"}
        </Button>
      </div>

      {/* Main Placement Nav */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
        <PlacementTab active={activeAdTab === 'home'} onClick={() => setActiveAdTab('home')} icon={Home} label="Homepage" count={3} />
        <PlacementTab active={activeAdTab === 'apps'} onClick={() => setActiveAdTab('apps')} icon={Gamepad2} label="apps" count={3} />
        <PlacementTab active={activeAdTab === 'trending'} onClick={() => setActiveAdTab('trending')} icon={TrendingUp} label="trending" count={3} />
        <PlacementTab active={activeAdTab === 'categories'} onClick={() => setActiveAdTab('categories')} icon={LayoutGrid} label="categories" count={3} />
        <PlacementTab active={activeAdTab === 'blog'} onClick={() => setActiveAdTab('blog')} icon={Newspaper} label="Blog page" count={3} />
        <PlacementTab active={activeAdTab === 'post'} onClick={() => setActiveAdTab('post')} icon={FileText} label="Post Detail" count={2} />
        <PlacementTab active={activeAdTab === 'global'} onClick={() => setActiveAdTab('global')} icon={Zap} label="Global Ads" count={2} />
      </div>

      <div className="space-y-12">
        {activeAdTab === 'home' && renderSlots('ad_728x90_home', 'Homepage')}
        {activeAdTab === 'apps' && renderSlots('ad_728x90_apps', 'apps')}
        {activeAdTab === 'trending' && renderSlots('ad_728x90_trending', 'trending')}
        {activeAdTab === 'categories' && renderSlots('ad_728x90_categories', 'categories all page')}
        {activeAdTab === 'blog' && renderSlots('ad_728x90_blog', 'Blog page')}
        
        {activeAdTab === 'post' && (
          <div className="space-y-12">
            <AdSection 
              title="Post page 728 x 90 Slot 1" 
              index={1} 
              isSidebar={false}
              code={settings.ad_728x90_post_1} 
              onCodeChange={(val: string) => updateAdCode('ad_728x90_post_1', val)} 
            />
            <AdSection 
              title="Post page Sidebar Slot 1" 
              index={1} 
              isSidebar={true}
              code={settings.ad_300x250_post_1} 
              onCodeChange={(val: string) => updateAdCode('ad_300x250_post_1', val)} 
            />
          </div>
        )}

        {activeAdTab === 'global' && (
          <div className="space-y-12">
            <div className="bg-[#3DDC84]/5 p-6 rounded-[2rem] border border-[#3DDC84]/10 mb-8">
              <h2 className="text-xl font-bold text-[#3DDC84] flex items-center gap-2 mb-2"><Zap className="w-5 h-5" /> High Performance Scripts</h2>
              <p className="text-sm text-neutral-400">Popunder and Social Bar scripts are injected site-wide. Paste the full script tag provided by your ad network.</p>
            </div>
            {renderSlots('ad_popunder', 'Popunder', false, 1)}
            {renderSlots('ad_socialbar', 'Social Bar', false, 1)}
          </div>
        )}
      </div>

      {/* Global Toggles */}
      <div className="pt-10 space-y-6">
        <div className="bg-[#3DDC84]/10 p-8 rounded-[2.5rem] border border-[#3DDC84]/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-[#3DDC84]/15 transition-all duration-500">
          <div>
            <span className="font-black text-[#3DDC84] text-2xl block mb-1">Master Ads Switch</span>
            <span className="text-sm text-neutral-400">Instantly enable or disable ALL ad formats across the entire website.</span>
          </div>
          <button 
            onClick={() => {
              const areAllOn = settings.ad_728x90_enabled && settings.ad_300x250_enabled && settings.ad_global_enabled;
              const newState = !areAllOn;
              setSettings({
                ...settings,
                ad_728x90_enabled: newState,
                ad_300x250_enabled: newState,
                ad_global_enabled: newState
              });
            }} 
            className={`h-12 px-10 rounded-2xl font-black transition-all duration-500 flex items-center gap-2 ${
              (settings.ad_728x90_enabled && settings.ad_300x250_enabled && settings.ad_global_enabled)
                ? 'bg-red-500/20 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                : 'bg-[#3DDC84] text-black hover:bg-[#3DDC84]/90'
            }`}
          >
            {(settings.ad_728x90_enabled && settings.ad_300x250_enabled && settings.ad_global_enabled) ? "Disable All Ads" : "Enable All Ads"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlobalToggle 
            label="Leaderboard Switch" 
            description="All 728x90 banners." 
            enabled={settings.ad_728x90_enabled} 
            onToggle={() => setSettings({...settings, ad_728x90_enabled: !settings.ad_728x90_enabled})} 
          />
          <GlobalToggle 
            label="Sidebar Switch" 
            description="All 300x250 sidebar ads." 
            enabled={settings.ad_300x250_enabled} 
            onToggle={() => setSettings({...settings, ad_300x250_enabled: !settings.ad_300x250_enabled})} 
          />
          <GlobalToggle 
            label="Global Script Switch" 
            description="Popunder & Social Bar." 
            enabled={settings.ad_global_enabled} 
            onToggle={() => setSettings({...settings, ad_global_enabled: !settings.ad_global_enabled})} 
          />
        </div>
      </div>
    </div>
  );
}

function PlacementTab({ active, onClick, icon: Icon, label, count }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-500 ${active ? 'bg-[#3DDC84] text-black shadow-lg shadow-[#3DDC84]/20 scale-[1.02]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
      <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
      <span className="capitalize">{label}</span>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${active ? 'bg-black/20 text-black' : 'bg-white/10 text-white/40'}`}>{count} Slots</span>
    </button>
  );
}

function GlobalToggle({ label, description, enabled, onToggle }: any) {
  return (
    <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-sm flex items-center justify-between group hover:border-[#3DDC84]/20 transition-all duration-500">
      <div><span className="font-black text-white text-lg block mb-1">{label}</span><span className="text-xs text-neutral-500">{description}</span></div>
      <button onClick={onToggle} className={`w-16 h-8 rounded-full transition-all duration-500 relative flex items-center px-1 shadow-inner ${enabled ? 'bg-[#3DDC84]' : 'bg-neutral-800'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-2xl transition-all duration-500 transform ${enabled ? 'translate-x-8' : 'translate-x-0'}`} /></button>
    </div>
  );
}

function AdSection({ title, index, code, onCodeChange, isSidebar }: any) {
  return (
    <div className="group rounded-[3rem] border border-white/5 bg-white/[0.01] overflow-hidden transform transition-all duration-700 hover:bg-white/[0.02] hover:border-white/10 animate-in slide-in-from-right-10 duration-700">
      <div className="px-10 py-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:rotate-12 transition-all duration-500 text-xl font-black text-[#3DDC84]">#{index}</div>
          <div><h4 className="font-black text-2xl text-white tracking-tight capitalize">{title}</h4><div className="flex items-center gap-2 mt-1"><span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{isSidebar ? '300 x 250' : 'Script'}</span><div className="w-1 h-1 bg-neutral-700 rounded-full" /><span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Active Placement</span></div></div>
        </div>
      </div>
      <div className="p-10 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2"><Code className="w-4 h-4 text-[#3DDC84]/50" /> Script Configuration</label>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-500/20 uppercase tracking-tighter"><ShieldCheck className="w-3 h-3" /> Secure</div>
        </div>
        <textarea rows={6} value={code} onChange={e => onCodeChange(e.target.value)} placeholder={`Paste ad code for slot #${index} here...`} className="w-full bg-black/60 border-2 border-white/5 rounded-[2rem] px-8 py-6 text-white focus:outline-none focus:border-[#3DDC84]/30 focus:shadow-[0_0_50px_rgba(61,220,132,0.05)] resize-none text-sm font-mono transition-all leading-relaxed" />
      </div>
    </div>
  );
}
