"use client";

import { useState, useEffect } from "react";
import { UserPlus, Search, Filter, MoreHorizontal, Edit, UserX, ShieldCheck, Mail, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/subscribers');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((sub: any) => ({
          id: sub.id,
          name: "Subscriber", 
          email: sub.email,
          role: "Subscriber",
          status: sub.status || "Active",
          joined: sub.date,
          avatar: sub.email.charAt(0).toUpperCase()
        }));
        setUsers(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const filteredUsers = users.filter((u: any) => 
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  const handleBan = async (id: string, name: string) => {
    if (confirm(`Remove subscriber ${name}?`)) {
      try {
        const res = await fetch(`/api/subscribers?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (res.ok) {
          await fetchUsers();
        } else {
          alert('Failed to delete subscriber.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      


      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">User Management</h1>
          <p className="text-neutral-400">Manage administrators, editors, and regular users.</p>
        </div>

      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..." 
            className="w-full text-sm bg-transparent border-none focus:ring-0 text-white pl-10 h-10 placeholder-neutral-500 rounded-xl outline-none"
          />
        </div>
        <Button onClick={() => alert("Filter functionality would open here!")} variant="outline" className="h-10 border-white/10 bg-black/50 hover:bg-white/10 text-neutral-300 w-full sm:w-auto rounded-xl">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-white/10 bg-black/40 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-neutral-400 font-medium uppercase tracking-wider text-xs border-b border-white/10">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4 hidden md:table-cell">Role</th>
                <th className="px-6 py-4 hidden sm:table-cell">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 flex items-center justify-center text-white font-bold shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#3DDC84] transition-colors">{user.name}</div>
                        <div className="text-xs text-neutral-500">Joined {user.joined}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      {user.role === "Super Admin" && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" /> {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.status === 'Active' ? 'bg-[#3DDC84]/10 text-[#3DDC84] border border-[#3DDC84]/20' 
                      : user.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => alert("Edit user: " + user.name)} className="p-2 text-neutral-400 hover:text-[#3DDC84] hover:bg-[#3DDC84]/10 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleBan(user.id, user.name)} className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Ban/Delete">
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="sm:hidden -mt-10 mr-1 border border-white/10 bg-white/5 rounded-md w-8 h-8 flex items-center justify-center">
                      <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    No users found matching "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
