"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Search, Trash2, Mail, Calendar } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete this message from ${name}?`)) {
      try {
        const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (res.ok) {
          setMessages(messages.filter(m => m.id !== id));
        } else {
          alert('Failed to delete message.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredMessages = messages.filter(m => 
    (m.name && m.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (m.message && m.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#3DDC84]" /> Inbox
          </h1>
          <p className="text-neutral-400">Read messages, mod requests, and inquiries from your users.</p>
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
            placeholder="Search messages, names, subject..." 
            className="w-full text-sm bg-transparent border-none focus:ring-0 text-white pl-10 h-10 placeholder-neutral-500 rounded-xl outline-none"
          />
        </div>
      </div>

      {/* Messages Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-neutral-500">Loading messages...</div>
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div key={msg.id} className="bg-black/40 border border-white/10 rounded-3xl p-6 backdrop-blur-sm transition-all hover:border-[#3DDC84]/50 group relative">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {msg.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      {msg.name} 
                      <span className="text-xs font-normal text-[#3DDC84] bg-[#3DDC84]/10 px-2 py-0.5 rounded-full border border-[#3DDC84]/20">
                        {msg.subject}
                      </span>
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {msg.email}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(msg.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(msg.id, msg.name)} className="opacity-0 group-hover:opacity-100 p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete Message">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border border-white/10 rounded-3xl bg-black/20 flex flex-col items-center">
            <MessageSquare className="w-12 h-12 text-neutral-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No messages found</h3>
            <p className="text-neutral-500 text-sm">When users fill out the contact form, their queries will appear here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
