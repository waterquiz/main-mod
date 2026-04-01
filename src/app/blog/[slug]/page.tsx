import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdBanner728 from "@/components/AdBanner728";
import AdSidebar300 from "@/components/AdSidebar300";
import fs from 'fs/promises';
import path from 'path';

async function getBlogPosts() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'blog.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const BLOG_POSTS = await getBlogPosts();
  const post = BLOG_POSTS.find((p: any) => p.id === slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-2xl min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-foreground/60 mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link href="/blog">
          <Button className="rounded-full px-8 bg-[#3DDC84] text-black font-bold hover:bg-[#3DDC84]/80">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/blog" className="inline-flex items-center text-sm font-medium text-foreground/60 hover:text-[#3DDC84] transition-colors mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to all articles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Article Content */}
        <div className="lg:col-span-2">
          <article>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Badge className="bg-[#3DDC84]/20 text-[#3DDC84] hover:bg-[#3DDC84]/30">{post.tag}</Badge>
                <span className="text-sm text-foreground/50 font-medium">{post.date}</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3DDC84] to-blue-500 flex items-center justify-center text-white font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">{post.author}</p>
                  <p className="text-xs text-foreground/50">Author & Contributor</p>
                </div>
              </div>
            </div>

            <div className="w-full h-64 sm:h-[400px] rounded-3xl mb-12 flex items-center justify-center text-white/50 font-bold text-2xl uppercase bg-gradient-to-br from-black/20 to-black/40 border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-cover bg-center blur-sm opacity-50" style={{ backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' }}></div>
              <span className="relative z-10">{post.title} Banner</span>
            </div>

            {/* Top Leaderboard Ad */}
            <AdBanner728 placement="post" index={1} />

            <div 
              className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#3DDC84] hover:prose-a:text-[#3DDC84]/80 text-foreground/80 mb-20"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="border-t border-black/10 dark:border-white/10 pt-8 flex items-center justify-between">
              <p className="font-medium text-foreground/70">Enjoyed the read?</p>
              <Link href="/apps">
                <Button className="rounded-full font-bold bg-[#3DDC84] text-black hover:bg-[#3DDC84]/80">Explore Modded Apps</Button>
              </Link>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="sticky top-24">
            <h3 className="text-xl font-bold mb-6">Recommended</h3>
            <AdSidebar300 placement="post" index={1} />
            
            <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
              <h4 className="font-bold mb-4">Stay Updated</h4>
              <p className="text-sm text-foreground/60 mb-6 font-medium">Get the latest mod updates and gaming news directly in your browser.</p>
              <Button className="w-full rounded-2xl bg-white text-black font-bold hover:bg-white/90">Allow Notifications</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
