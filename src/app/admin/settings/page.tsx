"use client";

import { useState, useEffect } from "react";
import { Save, Shield, Bell, Palette, Database, Server, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    siteName: "Bili Mod",
    supportEmail: "animebolt786@gmail.com",
    metaDescription: "Your trusted platform for safe, fast, and secure Android app and game mod downloads."
  });
  
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => setSettings(data));
    fetch('/api/auth/credentials').then(r => r.json()).then(data => setCredentials(data));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "General") {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
      } else if (activeTab === "Account") {
        await fetch('/api/auth/credentials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
      }
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Platform Settings</h1>
          <p className="text-neutral-400">Configure your website's global variables and policies.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className={`h-11 px-6 font-bold rounded-xl shadow-[0_0_20px_rgba(61,220,132,0.3)] transition-all flex items-center gap-2
            ${isSaved ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-[#3DDC84] hover:bg-[#3DDC84]/80 text-black hover:shadow-[0_0_30px_rgba(61,220,132,0.5)]'}
          `}
        >
          {isSaving ? (
            <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Saving...</span>
          ) : isSaved ? (
            <><CheckCircle2 className="w-5 h-5" /> Saved!</>
          ) : (
            <><Save className="w-5 h-5" /> Save Changes</>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-2 sticky top-24">
          <SettingsTab icon={Server} label="General" isActive={activeTab === "General"} onClick={() => setActiveTab("General")} />
          <SettingsTab icon={Users} label="Account" isActive={activeTab === "Account"} onClick={() => setActiveTab("Account")} />
          <SettingsTab icon={Palette} label="Appearance" isActive={activeTab === "Appearance"} onClick={() => setActiveTab("Appearance")} />
          <SettingsTab icon={Shield} label="Security" isActive={activeTab === "Security"} onClick={() => setActiveTab("Security")} />
          <SettingsTab icon={Bell} label="Notifications" isActive={activeTab === "Notifications"} onClick={() => setActiveTab("Notifications")} />
          <SettingsTab icon={Database} label="Backups" isActive={activeTab === "Backups"} onClick={() => setActiveTab("Backups")} />
        </div>

        {/* Settings Form Content */}
        <div className="md:col-span-3 space-y-8">
          
          {activeTab === "General" ? (
            <>
              <SettingSection title="General Information" description="Basic details about your ModDroid platform.">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-300">Site Name</label>
                    <input 
                      type="text" 
                      value={settings.siteName} 
                      onChange={e => setSettings({...settings, siteName: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#3DDC84]/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-300">Support Email</label>
                    <input 
                      type="email" 
                      value={settings.supportEmail} 
                      onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#3DDC84]/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-300">Meta Description</label>
                    <textarea 
                      rows={3} 
                      value={settings.metaDescription} 
                      onChange={e => setSettings({...settings, metaDescription: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3DDC84]/50 resize-y text-sm" 
                    />
                  </div>
                </div>
              </SettingSection>
            </>
          ) : activeTab === "Account" ? (
            <>
              <SettingSection title="Admin Credentials" description="Update the email and master password used to log in. NOTE: Refresh your browser after updating to sync credentials.">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-300">Admin Email</label>
                    <input 
                      type="email" 
                      value={credentials.email} 
                      onChange={e => setCredentials({...credentials, email: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#3DDC84]/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-300">Master Password</label>
                    <input 
                      type="text" 
                      value={credentials.password} 
                      onChange={e => setCredentials({...credentials, password: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#3DDC84]/50" 
                    />
                  </div>
                </div>
              </SettingSection>
            </>

          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-12 text-center text-neutral-400">
              <IconForTab tab={activeTab} className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">{activeTab} Settings</h3>
              <p>These settings modules are currently under construction and will be available in the next release.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function IconForTab({ tab, className }: any) {
  switch (tab) {
    case "Account": return <Users className={className} />;
    case "Appearance": return <Palette className={className} />;
    case "Security": return <Shield className={className} />;
    case "Notifications": return <Bell className={className} />;
    case "Backups": return <Database className={className} />;
    default: return <Server className={className} />;
  }
}

function SettingsTab({ icon: Icon, label, isActive, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${
        isActive ? "bg-[#3DDC84]/10 text-[#3DDC84] shadow-inner" : "text-neutral-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''} transition-transform`} />
      {label}
    </div>
  );
}

function SettingSection({ title, description, isDanger, children }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden transform transition-all">
      <div className={`px-6 py-5 border-b border-white/10 bg-black/40 ${isDanger ? "border-red-500/20" : ""}`}>
        <h3 className={`font-bold ${isDanger ? "text-red-400" : "text-white"}`}>{title}</h3>
        <p className="text-xs text-neutral-400 mt-1">{description}</p>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
