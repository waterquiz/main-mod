"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        router.push('/admin');
        router.refresh(); // force layout to recalculate middleware
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3DDC84]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#3DDC84] to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-[#3DDC84]/20 shadow-xl">
            <ShieldCheck className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Gateway</h1>
          <p className="text-neutral-400 font-medium mt-2">Sign in to manage the platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-300">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[#3DDC84] focus:ring-1 focus:ring-[#3DDC84] transition-all"
              placeholder="admin@bilimod.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-300">Master Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-12 bg-black/50 border border-white/10 rounded-xl px-4 pl-10 text-white focus:outline-none focus:border-[#3DDC84] focus:ring-1 focus:ring-[#3DDC84] transition-all"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-[#3DDC84] hover:bg-[#3DDC84]/90 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(61,220,132,0.3)] transition-all"
          >
            {loading ? "Authenticating..." : "Access Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
