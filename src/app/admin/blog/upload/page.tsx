"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, FileText, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadBlogPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [id, setId] = useState(""); // URL Slug
  const [author, setAuthor] = useState("Admin");
  const [tag, setTag] = useState("Update");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    const postData = {
      id: id || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title,
      author,
      tag,
      excerpt,
      content,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/admin/blog');
        }, 2000);
      } else {
        alert("Failed to publish blog post. Please check the logs.");
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("Network error occurred while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Write Blog Post</h1>
          <p className="text-neutral-400">Author and publish a new article to your public blog.</p>
        </div>
        <Button 
          type="submit"
          form="blogForm"
          disabled={isPublishing}
          className="h-11 px-8 bg-[#3DDC84] hover:bg-[#3DDC84]/80 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(61,220,132,0.3)] hover:shadow-[0_0_30px_rgba(61,220,132,0.5)] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isPublishing ? "Publishing..." : <><Globe className="w-5 h-5" /> Publish Now</>}
        </Button>
      </div>

      {showSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center gap-3 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-semibold text-sm">Post published successfully! Redirecting to manager...</p>
        </div>
      )}

      <form id="blogForm" onSubmit={handlePublish} className="space-y-6">
        {/* Core Info */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6"><FileText className="w-5 h-5 text-[#3DDC84]" /> Article Meta</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-neutral-300">Article Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. 10 Best Mod APKs in 2024"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#3DDC84]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-300 flex items-center justify-between">
                <span>URL Slug (Optional)</span>
                <span className="text-xs text-neutral-500 font-normal">Auto-generated if blank</span>
              </label>
              <input 
                type="text" 
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="e.g. best-mod-apks-2024"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#3DDC84]/50 transition-colors font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300">Author</label>
                <input 
                  type="text" 
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#3DDC84]/50 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300">Tag / Category</label>
                <input 
                  type="text" 
                  value={tag}
                  onChange={e => setTag(e.target.value)}
                  placeholder="e.g. Update"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#3DDC84]/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-neutral-300">Short Excerpt <span className="text-red-500">*</span></label>
              <p className="text-xs text-neutral-500 mb-2">A brief 1-2 sentence summary displayed on the blog listing page.</p>
              <textarea 
                rows={3}
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="Summarize the article briefly..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#3DDC84]/50 transition-colors resize-y leading-relaxed"
                required
              />
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6"><Save className="w-5 h-5 text-blue-400" /> Full Content (HTML Supported)</h2>
          
          <div className="space-y-2">
            <p className="text-xs text-neutral-500 mb-4">Write the full body of the article here. HTML tags like &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, and &lt;strong&gt; are natively supported and styled on the frontend.</p>
            <textarea 
              rows={15}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="<h3>1. The beginning</h3><p>Start your post here...</p>"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#3DDC84]/50 transition-colors font-mono text-sm resize-y leading-relaxed"
              required
            />
          </div>
        </div>

      </form>
    </div>
  );
}
