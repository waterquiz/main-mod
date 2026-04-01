import Link from "next/link";
import { LayoutDashboard, PackageSearch, UploadCloud, Users, Settings, ChevronRight, Activity, MessageSquare, FileText, Edit3 } from "lucide-react";
import { ReactNode } from "react";
import { LogoutButton } from "@/components/logout-button";

export const metadata = {
  title: "Admin Panel | Try Bili",
  description: "Manage Mod Apps, Categories, and Settings",
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-[#3DDC84]/30">
      {/* Sidebar Navigation */}
      <aside className="w-72 hidden lg:flex flex-col border-r border-white/10 bg-black backdrop-blur-xl shrink-0 sticky top-0 h-screen">
        <div className="h-20 flex items-center px-8 border-b border-white/10 bg-gradient-to-r from-black to-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3DDC84] to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(61,220,132,0.3)]">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Bili Admin</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8 no-scrollbar">
          <div className="space-y-2">
            <p className="px-4 text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider mb-4">Overview</p>
            <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
            <NavItem href="/admin/apps" icon={PackageSearch} label="Manage Apps" />
            <NavItem href="/admin/apps/upload" icon={UploadCloud} label="Upload App" />
            
            <p className="px-4 text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider mt-12 mb-4">Blog System</p>
            <NavItem href="/admin/blog" icon={FileText} label="Manage Blogs" />
            <NavItem href="/admin/blog/upload" icon={Edit3} label="Write Post" />
          </div>

          <div className="space-y-2 mt-8">
            <p className="px-4 text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider mb-4">System</p>
            <NavItem href="/admin/messages" icon={MessageSquare} label="Messages" />
            <NavItem href="/admin/ads" icon={Activity} label="Ads Manager" />
            <NavItem href="/admin/users" icon={Users} label="Users" />
            <NavItem href="/admin/settings" icon={Settings} label="Settings" />
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 bg-white/5">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-neutral-950 to-black">
        {/* Mobile Header (Hidden on large screens) */}
        <header className="h-16 lg:hidden border-b border-white/10 flex items-center px-4 sticky top-0 bg-black/80 backdrop-blur-lg z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3DDC84] to-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          
          <div className="relative z-10 p-6 lg:p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 group-hover:text-[#3DDC84] transition-colors" />
        {label}
      </div>
      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-neutral-500" />
    </Link>
  );
}
