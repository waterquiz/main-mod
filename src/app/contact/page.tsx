"use client";

import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Share2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [supportEmail, setSupportEmail] = useState("support@moddroid.hub");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.supportEmail) setSupportEmail(data.supportEmail);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus("loading");
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Get in Touch</h1>
            <p className="text-foreground/70 text-lg">
              Have a question, mod request, or found a broken link? Let us know below. We typically respond within 24 hours.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#3DDC84] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Email Us</h3>
                <p className="text-foreground/60 text-sm">{supportEmail}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#3DDC84] shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Mod Requests</h3>
                <p className="text-foreground/60 text-sm">Use the form to request new games or apps you want unlocked.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#3DDC84] shrink-0">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Social Media</h3>
                <div className="flex gap-4 mt-2">
                  <span className="text-sm font-semibold hover:text-[#3DDC84] cursor-pointer transition-colors">Telegram</span>
                  <span className="text-sm font-semibold hover:text-[#3DDC84] cursor-pointer transition-colors">Twitter</span>
                  <span className="text-sm font-semibold hover:text-[#3DDC84] cursor-pointer transition-colors">Discord</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-sm relative">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold">Your Name</label>
              <input 
                id="name"
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                disabled={status === "loading" || status === "success"}
                placeholder="John Doe" 
                className="w-full h-12 px-4 rounded-xl bg-background border border-black/10 dark:border-white/10 focus:border-[#3DDC84] focus:outline-none focus:ring-1 focus:ring-[#3DDC84] transition-all disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">Email Address</label>
              <input 
                id="email"
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                disabled={status === "loading" || status === "success"}
                placeholder="john@example.com" 
                className="w-full h-12 px-4 rounded-xl bg-background border border-black/10 dark:border-white/10 focus:border-[#3DDC84] focus:outline-none focus:ring-1 focus:ring-[#3DDC84] transition-all disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-semibold">Subject</label>
              <select 
                id="subject"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                disabled={status === "loading" || status === "success"}
                className="w-full h-12 px-4 rounded-xl bg-background border border-black/10 dark:border-white/10 focus:border-[#3DDC84] focus:outline-none focus:ring-1 focus:ring-[#3DDC84] transition-all appearance-none disabled:opacity-50"
              >
                <option>General Inquiry</option>
                <option>Mod Request</option>
                <option>Report Broken Link</option>
                <option>DMCA Take Down</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-semibold">Message</label>
              <textarea 
                id="message"
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                disabled={status === "loading" || status === "success"}
                placeholder="How can we help you?" 
                rows={5}
                className="w-full p-4 rounded-xl bg-background border border-black/10 dark:border-white/10 focus:border-[#3DDC84] focus:outline-none focus:ring-1 focus:ring-[#3DDC84] transition-all resize-none disabled:opacity-50"
              ></textarea>
            </div>
            
            <Button 
              type="submit" 
              disabled={status === "loading" || status === "success"}
              className={`w-full h-12 text-lg shadow-md transition-all ${status === "success" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "shadow-[#3DDC84]/20"}`}
            >
              {status === "loading" ? "Sending..." : status === "success" ? "Message Sent!" : "Send Message"}
            </Button>
            
            {status === "error" && (
              <p className="text-red-500 text-sm text-center font-medium mt-4">Failed to send message. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
