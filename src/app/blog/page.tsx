"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdBanner728 from "@/components/AdBanner728";
import { useState, useEffect } from "react";

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => {
        setBlogPosts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const displayedPosts = blogPosts.slice(0, displayCount);
  
  // Group posts into chunks of 2 for the requested ad pattern
  const chunkedPosts = [];
  for (let i = 0; i < displayedPosts.length; i += 2) {
    chunkedPosts.push(displayedPosts.slice(i, i + 2));
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Bili Mod Blog</h1>
        <p className="text-foreground/70 text-lg">Latest updates, tutorials, and insights into the modified app ecosystem.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#3DDC84]/20 border-t-[#3DDC84] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-12">
          {chunkedPosts.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {chunk.map((post: any, i: number) => (
                  <Link href={`/blog/${post.id}`} key={post.id} className="group flex flex-col gap-4 p-6 rounded-3xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-black/5 dark:border-white/5 hover:border-[#3DDC84]/50">
                    {/* Thumbnail Placeholder */}
                    <div className={`w-full h-48 rounded-2xl flex items-center justify-center text-white font-bold text-xl uppercase ${i % 2 === 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-[#3DDC84] to-emerald-600'}`}>
                      Blog Image
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between text-xs text-foreground/50">
                        <Badge variant="secondary">{post.tag}</Badge>
                        <span>{post.date}</span>
                      </div>
                      <h2 className="text-xl font-bold group-hover:text-[#3DDC84] transition-colors leading-snug">{post.title}</h2>
                      <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">{post.excerpt}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-black/10 dark:border-white/10 mt-auto flex items-center justify-between">
                      <span className="text-sm font-medium">By {post.author}</span>
                      <span className="text-[#3DDC84] font-semibold text-sm group-hover:translate-x-1 transition-transform">Read more →</span>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Ad Placement after every 2 posts - Repeating with unique indices */}
              <AdBanner728 placement="blog" index={chunkIndex + 1} />
            </div>
          ))}

          {displayCount < blogPosts.length && (
            <div className="mt-12 flex justify-center">
              <Button 
                size="lg" 
                className="rounded-full px-12 h-14 font-bold bg-[#3DDC84] text-black hover:bg-[#3DDC84]/80 shadow-lg shadow-[#3DDC84]/20"
                onClick={() => setDisplayCount(prev => prev + 6)}
              >
                Load More Blog
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
