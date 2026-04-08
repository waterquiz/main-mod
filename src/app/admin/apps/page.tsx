"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, X, Save, BarChart2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ManageAppsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Requested: 10 items per page

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/apps');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((item: any) => ({
          ...item,
          name: item.appName || item.name || "Unknown App",
          status: item.status || "Active",
          icon: item.appName?.charAt(0) || "A"
        }));
        setApps(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);
  

  // Filter apps based on search query
  const filteredApps = useMemo(() => {
    return apps.filter((app) => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [apps, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Handlers
  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Search Handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Delete Handler
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const res = await fetch(`/api/apps?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (res.ok) {
          await fetchApps();
          if (paginatedApps.length === 1 && currentPage > 1) {
            setCurrentPage(p => p - 1);
          }
        } else {
          alert('Failed to delete app.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };


  // Export Handler
  const handleExport = () => {
    const csvContent = [
      ["ID", "Name", "Developer", "Category", "Status", "Downloads"],
      ...filteredApps.map(a => [a.id, a.name, a.developer, a.category, a.status, a.downloads])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `apps_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Manage Apps</h1>
          <p className="text-neutral-400">View, edit, or remove published modifications.</p>
        </div>
        <Link href="/admin/apps/upload">
          <Button className="h-11 px-6 bg-[#3DDC84] hover:bg-[#3DDC84]/80 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(61,220,132,0.3)] hover:shadow-[0_0_30px_rgba(61,220,132,0.5)] transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Upload App
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name, developer, or ID..." 
            className="w-full text-sm bg-transparent border-none focus:ring-0 text-white pl-10 h-10 placeholder-neutral-500 rounded-xl outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto px-2 pb-2 sm:px-0 sm:pb-0 sm:pr-2">
          <Button 
            variant="outline" 
            className="h-10 border-white/10 bg-black/50 hover:bg-white/10 text-neutral-300 w-full sm:w-auto rounded-xl"
            onClick={() => alert("Filter modal would open here!")}
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button 
            variant="outline" 
            className="h-10 border-white/10 bg-black/50 hover:bg-white/10 text-neutral-300 w-full sm:w-auto rounded-xl"
            onClick={handleExport}
          >
            <div className="w-4 h-4 relative mr-2">
              <Image src="/bili-logo.png" alt="Export" fill className="object-contain" />
            </div>
            Export
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-3xl border border-white/10 bg-black/40 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-neutral-400 font-medium uppercase tracking-wider text-xs border-b border-white/10">
              <tr>
                <th className="px-6 py-4">App Details</th>
                <th className="px-6 py-4 hidden md:table-cell">Category</th>
                <th className="px-6 py-4 hidden lg:table-cell">Version / Size</th>
                <th className="px-6 py-4">Statistics</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedApps.length > 0 ? paginatedApps.map((app, index) => (
                <tr key={`${app.id}-${index}`} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black/20 flex flex-col items-center justify-center text-white font-bold shrink-0 shadow-lg group-hover:shadow-[#3DDC84]/20 transition-all relative overflow-hidden border border-white/5">
                        <Image src={app.iconUrl || "/bili-logo.png"} alt={app.name} fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#3DDC84] transition-colors hidden sm:block">{app.name}</div>
                        <div className="font-semibold text-white group-hover:text-[#3DDC84] transition-colors sm:hidden w-32 truncate">{app.name}</div>
                        <div className="text-xs text-neutral-500">{app.developer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300">
                      {app.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="text-neutral-300">{app.version}</div>
                    <div className="text-xs text-neutral-500">{app.size}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      {app.downloads}
                    </div>
                    <div className="text-xs text-yellow-500 font-medium tracking-tight">
                      ★ {app.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      app.status === 'Active' 
                        ? 'bg-[#3DDC84]/10 text-[#3DDC84] border border-[#3DDC84]/20' 
                        : app.status === 'Pending Update'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/apps/stats/${app.id}`}>
                        <button 
                          className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" 
                          title="Statistics"
                        >
                          <BarChart2 className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={`/admin/apps/edit/${app.id}`}>
                        <button 
                          className="p-2 text-neutral-400 hover:text-[#3DDC84] hover:bg-[#3DDC84]/10 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(app.id, app.name)}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Mobile always visible action */}
                    <div className="sm:hidden -mt-10 mr-1 opacity-100 border border-white/10 bg-white/5 rounded-md w-8 h-8 flex items-center justify-center">
                      <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    No apps found matching "{searchQuery}". Try a different term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Details */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-400">
            Showing <span className="font-semibold text-white">{filteredApps.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, filteredApps.length)}</span> of <span className="font-semibold text-white">{filteredApps.length}</span> apps
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="h-8 border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 disabled:opacity-50 transition-colors" 
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || filteredApps.length === 0}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              className="h-8 border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 disabled:opacity-50 transition-colors" 
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || filteredApps.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
