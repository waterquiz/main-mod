"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Save, Plus, X, Image as ImageIcon, Smartphone, FileText, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Action Games", "Arcade Games", "Premium Tools", "VPNs & Security", 
  "Streaming", "Photo Editing", "Education", "Music & Audio"
];

export default function UploadAppPage() {
  const [features, setFeatures] = useState(["Premium Unlocked", "No Ads"]);
  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [apkFile, setApkFile] = useState<File | null>(null);

  // New controlled states
  const [appName, setAppName] = useState("");
  const [developer, setDeveloper] = useState("");
  const [category, setCategory] = useState("");
  const [version, setVersion] = useState("");
  const [size, setSize] = useState("");
  const [rating, setRating] = useState("");
  const [downloads, setDownloads] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [directDownloadUrl, setDirectDownloadUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.appName) setAppName(data.appName);
        if (data.developer) setDeveloper(data.developer);
        if (data.category && CATEGORIES.includes(data.category)) setCategory(data.category);
        if (data.version) setVersion(data.version);
        if (data.size) setSize(data.size);
        if (data.rating) setRating(data.rating);
        if (data.downloads) setDownloads(data.downloads);
        if (data.fullDesc) setFullDesc(data.fullDesc);
        if (data.features && Array.isArray(data.features)) setFeatures(data.features);
        if (data.downloadUrl) setDirectDownloadUrl(data.downloadUrl);
      } catch (err) {
        alert("Invalid or malformed JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input so same file can be imported again
  };


  const addFeature = () => {
    if (newFeature.trim() !== "") {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apkFile && !directDownloadUrl.trim()) {
      alert("Please either upload an APK file or provide a Direct Download Link.");
      return;
    }
    
    if (apkFile && directDownloadUrl.trim()) {
      alert("Please use only one option: either upload an APK/OBB file OR provide a direct download link.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let uploadedIcon = "";
      if (iconFile) {
        const fd = new FormData();
        fd.append("file", iconFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const data = await res.json();
          uploadedIcon = data.paths[0];
        }
      }

      let uploadedScreenshots: string[] = [];
      if (screenshots.length > 0) {
        const fd = new FormData();
        screenshots.forEach(f => fd.append("file", f));
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const data = await res.json();
          uploadedScreenshots = data.paths;
        }
      }

      let uploadedApk = directDownloadUrl.trim();
      if (apkFile) {
        const fd = new FormData();
        fd.append("file", apkFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const data = await res.json();
          uploadedApk = data.paths[0];
        }
      }

      const generatedSlug = appName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName, developer, packageName: generatedSlug, category, 
          version, size, rating, downloads, fullDesc, features,
          iconUrl: uploadedIcon, screenshotUrls: uploadedScreenshots, downloadUrl: uploadedApk
        }),
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        alert("Failed to publish app.");
      }
    } catch (err) {
      console.error(err);
      alert("Error publishing app.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/apps">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-white/10 bg-white/5 hover:bg-white/10 shrink-0">
              <ArrowLeft className="w-5 h-5 text-neutral-400" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Upload New App</h1>
            <p className="text-neutral-400">Publish a new modded application to the platform.</p>
          </div>
        </div>
        <div className="hidden flex-1 sm:flex justify-end gap-3">
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
          <Button 
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-11 px-6 font-bold rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <div className="w-5 h-5 relative">
              <Image src="/bili-logo.png" alt="Import" fill className="object-contain" />
            </div>
            Import Data
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={`h-11 px-6 font-bold rounded-xl shadow-[0_0_20px_rgba(61,220,132,0.3)] transition-all flex items-center gap-2
              ${isSuccess ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-[#3DDC84] hover:bg-[#3DDC84]/80 text-black hover:shadow-[0_0_30px_rgba(61,220,132,0.5)]'}
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Saving...</span>
            ) : isSuccess ? (
              <><CheckCircle2 className="w-5 h-5" /> Published</>
            ) : (
              <><Save className="w-5 h-5" /> Publish App</>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Information Section */}
          <SectionCard title="Basic Information" icon={Smartphone}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300">App Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g., Spotify Premium Mod" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50 focus:border-[#3DDC84]/50 transition-all font-medium text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300">Developer</label>
                <input 
                  type="text" 
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  placeholder="e.g., Spotify Ltd" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50 transition-all font-medium"
                />
              </div>
            </div>
          </SectionCard>

          {/* Detailed Content Section */}
          <SectionCard title="Detailed Content" icon={FileText}>
            <div className="space-y-6">
              
              {/* Mod Features dynamic list */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-neutral-300">Mod Features Highlights</label>
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3DDC84]/10 border border-[#3DDC84]/20 text-[#3DDC84] text-sm font-medium group">
                        {feat}
                        <button type="button" onClick={() => removeFeature(idx)} className="text-[#3DDC84]/50 hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="text" 
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Add a feature (e.g. Unlimited Money)" 
                      className="flex-1 bg-transparent border-b border-white/10 focus:border-[#3DDC84] px-2 py-1 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                    <Button type="button" onClick={addFeature} variant="secondary" size="sm" className="h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300 flex items-center justify-between">
                  <span>Full App Description</span>
                  <span className="text-xs font-normal text-neutral-500 bg-black/50 px-2 py-0.5 rounded">Markdown supported</span>
                </label>
                <textarea 
                  rows={16}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Write the full description and installation instructions here..." 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50 transition-all resize-y font-mono text-sm leading-relaxed"
                />
              </div>

            </div>
          </SectionCard>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Media Section */}
          <SectionCard title="Media & Branding" icon={ImageIcon}>
            <div className="space-y-6">
              
              {/* Icon Upload */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-neutral-300">App Icon</label>
                <label 
                  onDragOver={handleDragOver}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) setIconFile(e.dataTransfer.files[0]);
                  }}
                  className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-black/20 hover:bg-black/40 hover:border-[#3DDC84]/50 transition-all cursor-pointer group w-full"
                >
                  <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={(e) => {
                    if (e.target.files?.[0]) setIconFile(e.target.files[0]);
                  }} />
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#3DDC84]/10 transition-all duration-300">
                    {iconFile ? <ImageIcon className="w-8 h-8 text-[#3DDC84]" /> : <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-[#3DDC84] transition-colors" />}
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{iconFile ? iconFile.name : "Click or drag to upload icon"}</p>
                  <p className="text-xs text-neutral-500">PNG, JPG up to 2MB (512x512)</p>
                </label>
              </div>

              {/* Screenshots Upload */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-neutral-300">Screenshots</label>
                <label 
                  onDragOver={handleDragOver}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files) setScreenshots(Array.from(e.dataTransfer.files).slice(0, 5));
                  }}
                  className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-black/20 hover:bg-black/40 hover:border-[#3DDC84]/50 transition-all cursor-pointer group w-full"
                >
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files) setScreenshots(Array.from(e.target.files).slice(0, 5));
                  }} />
                  <div className="flex gap-2 justify-center mb-3 flex-wrap">
                    {screenshots.length > 0 ? (
                      screenshots.map((file, i) => (
                        <div key={i} className="w-10 h-10 rounded-lg bg-white/10 flex flex-col items-center justify-center group-hover:scale-110 transition-all">
                          <ImageIcon className="w-5 h-5 text-[#3DDC84]" />
                        </div>
                      ))
                    ) : (
                      <ImageIcon className="w-8 h-8 text-neutral-400 group-hover:text-[#3DDC84] transition-colors" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-white mb-1">
                    {screenshots.length > 0 ? `${screenshots.length} file(s) selected` : "Click or drag screenshots"}
                  </p>
                  <p className="text-xs text-neutral-500">Select multiple files. Up to 5 images.</p>
                </label>
              </div>
            </div>
          </SectionCard>

          {/* File Data Section */}
          <SectionCard title="File Data" icon={Save}>
            <div className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50 transition-all appearance-none">
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Version</label>
                  <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="e.g. 1.0.4" className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Size</label>
                  <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 145 MB" className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Rating</label>
                  <input type="number" step="0.1" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="e.g. 4.8" className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Downloads</label>
                  <input type="text" value={downloads} onChange={(e) => setDownloads(e.target.value)} placeholder="e.g. 10M+" className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="text-sm font-semibold text-neutral-300">File Upload (APK/OBB)</label>
                <label className="border border-white/10 rounded-xl px-4 py-3 bg-black flex items-center justify-between group hover:border-[#3DDC84]/30 cursor-pointer transition-colors flex-1 w-full relative">
                  <input 
                    type="file" 
                    accept=".apk,.obb" 
                    className="hidden" 
                    onClick={(e) => (e.currentTarget.value = "")}
                    onChange={(e) => {
                      if (e.target.files?.[0]) setApkFile(e.target.files[0]);
                    }} 
                  />
                  <div className="flex items-center gap-3 truncate max-w-[70%]">
                    <div className="p-2 bg-white/5 rounded-lg text-neutral-400 group-hover:text-[#3DDC84] transition-colors"><Save className="w-4 h-4"/></div>
                    <span className={`text-sm font-medium truncate group-hover:text-white transition-colors ${apkFile ? 'text-[#3DDC84]' : 'text-neutral-400'}`}>
                      {apkFile ? apkFile.name : "Choose APK file..."}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {apkFile && (
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.preventDefault();
                          setApkFile(null);
                        }}
                        className="h-7 w-7 bg-red-500/10 hover:bg-red-500/20 text-red-400 flex flex-col items-center justify-center rounded-md transition-colors"
                        title="Remove APK"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="h-7 px-3 text-xs bg-white/10 hover:bg-white/20 flex items-center justify-center rounded-md font-medium">Browse</div>
                  </div>
                </label>
                
                <div className="flex items-center justify-center py-2">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest bg-black px-3 py-1 rounded-full border border-white/10">OR</span>
                </div>
                
                <div className="space-y-2 pb-2">
                  <label className="text-sm font-semibold text-neutral-300">Direct Download Link</label>
                  <input 
                    type="url" 
                    value={directDownloadUrl}
                    onChange={(e) => setDirectDownloadUrl(e.target.value)}
                    placeholder="https://example.com/download/app.apk" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50 transition-all font-mono text-sm"
                  />
                </div>
              </div>

            </div>
          </SectionCard>

        </div>
        
        {/* Mobile Submit Button (Visible only on small screens) */}
        <div className="sm:hidden mt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={`w-full h-14 font-bold rounded-xl shadow-[0_0_20px_rgba(61,220,132,0.3)] text-lg flex items-center justify-center gap-2
              ${isSuccess ? 'bg-emerald-500 text-white' : 'bg-[#3DDC84] text-black'}
            `}
          >
            {isSubmitting ? (
              <><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Publishing...</>
            ) : isSuccess ? (
              <><CheckCircle2 className="w-6 h-6" /> Published Successfully</>
            ) : (
              <><Save className="w-6 h-6" /> Publish App</>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center gap-3">
        <Icon className="w-5 h-5 text-[#3DDC84]" />
        <h2 className="font-bold text-lg">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
