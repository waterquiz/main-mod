"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all font-medium text-sm group">
      <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      Log Out
    </button>
  );
}
