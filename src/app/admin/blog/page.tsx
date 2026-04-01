"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, FileText, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManageBlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);
  
  // Edit Modal State
  const [editingPost, setEditingPost] = useState<any>(null);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tag?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Handlers
  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Search Handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Delete Handler
  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const res = await fetch(`/api/blog?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (res.ok) {
          await fetchBlogs();
          if (paginatedPosts.length === 1 && currentPage > 1) {
            setCurrentPage(p => p - 1);
          }
        } else {
          alert('Failed to delete post.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Save Edit Handler
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    
    try {
      const res = await fetch('/api/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost)
      });
      
      if (res.ok) {
        await fetchBlogs();
        setEditingPost(null);
      } else {
        alert('Failed to save edit.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-20 relative">
      
      {/* Edit Modal Overlay */}
      {editingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Edit className="w-5 h-5 text-[#3DDC84]" /> Edit Blog Post</h2>
              <button onClick={() => setEditingPost(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm text-neutral-400 font-medium">Post Title</label>
                  <input type="text" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#3DDC84]/50" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-neutral-400 font-medium">Author</label>
                  <input type="text" value={editingPost.author} onChange={e => setEditingPost({...editingPost, author: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#3DDC84]/50" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-neutral-400 font-medium">Tag / Category</label>
                  <input type="text" value={editingPost.tag} onChange={e => setEditingPost({...editingPost, tag: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#3DDC84]/50" required />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm text-neutral-400 font-medium">Short Excerpt</label>
                  <textarea rows={2} value={editingPost.excerpt} onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#3DDC84]/50 resize-y" required />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm text-neutral-400 font-medium">Full HTML Content</label>
                  <textarea rows={8} value={editingPost.content} onChange={e => setEditingPost({...editingPost, content: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#3DDC84]/50 font-mono text-xs resize-y leading-relaxed" required />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-white/10 mt-6">
                <Button type="button" variant="outline" onClick={() => setEditingPost(null)} className="bg-transparent border-white/10 text-neutral-300 hover:bg-white/5">Cancel</Button>
                <Button type="submit" className="bg-[#3DDC84] text-black font-bold hover:bg-[#3DDC84]/80 flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Manage Blogs</h1>
          <p className="text-neutral-400">View, edit, or remove published articles and posts.</p>
        </div>
        <Link href="/admin/blog/upload">
          <Button className="h-11 px-6 bg-[#3DDC84] hover:bg-[#3DDC84]/80 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(61,220,132,0.3)] hover:shadow-[0_0_30px_rgba(61,220,132,0.5)] transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Write Post
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
            placeholder="Search titles or authors..." 
            className="w-full text-sm bg-transparent border-none focus:ring-0 text-white pl-10 h-10 placeholder-neutral-500 rounded-xl outline-none"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-3xl border border-white/10 bg-black/40 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-neutral-400 font-medium uppercase tracking-wider text-xs border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Title / ID</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Tag</th>
                <th className="px-6 py-4">Date String</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedPosts.length > 0 ? paginatedPosts.map((post, index) => (
                <tr key={`${post.id}-${index}`} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white truncate max-w-[200px] sm:max-w-[300px]">{post.title}</div>
                        <div className="text-xs text-neutral-500 font-mono mt-0.5">{post.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-300">{post.author}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#3DDC84]/10 text-[#3DDC84] border border-[#3DDC84]/20">
                      {post.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-300">{post.date}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingPost(post)}
                        className="p-2 text-neutral-400 hover:text-[#3DDC84] hover:bg-[#3DDC84]/10 rounded-lg transition-colors" 
                        title="Edit Post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Details */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-400">
            Showing <span className="font-semibold text-white">{filteredPosts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, filteredPosts.length)}</span> of <span className="font-semibold text-white">{filteredPosts.length}</span> posts
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 disabled:opacity-50" onClick={handlePrevPage} disabled={currentPage <= 1 || filteredPosts.length === 0}>
              Previous
            </Button>
            <Button variant="outline" className="h-8 border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 disabled:opacity-50" onClick={handleNextPage} disabled={currentPage >= totalPages || filteredPosts.length === 0}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
