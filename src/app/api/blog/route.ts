import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'blog.json');
    try {
      await fs.access(dataPath);
    } catch {
      await fs.writeFile(dataPath, '[]');
    }
    const data = await fs.readFile(dataPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read blog data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newPost = await request.json();
    const dataPath = path.join(process.cwd(), 'src', 'data', 'blog.json');
    let posts = [];
    
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      posts = JSON.parse(data);
    } catch {
      await fs.writeFile(dataPath, '[]');
    }

    const postRecord = {
      id: newPost.id || newPost.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `post-${Date.now()}`,
      title: newPost.title,
      excerpt: newPost.excerpt,
      date: newPost.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: newPost.author || "Admin",
      tag: newPost.tag || "Update",
      content: newPost.content || "",
      bannerUrl: newPost.bannerUrl || null,
      createdAt: new Date().toISOString(),
    };

    posts.unshift(postRecord); // Add to the top
    await fs.writeFile(dataPath, JSON.stringify(posts, null, 2));

    return NextResponse.json({ success: true, post: postRecord });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedPost = await request.json();
    if (!updatedPost.id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), 'src', 'data', 'blog.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    let posts = JSON.parse(data);

    const index = posts.findIndex((p: any) => p.id === updatedPost.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    posts[index] = { ...posts[index], ...updatedPost, updatedAt: new Date().toISOString() };
    await fs.writeFile(dataPath, JSON.stringify(posts, null, 2));

    return NextResponse.json({ success: true, post: posts[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), 'src', 'data', 'blog.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    let posts = JSON.parse(data);

    const newPosts = posts.filter((p: any) => p.id !== id);
    if (posts.length === newPosts.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await fs.writeFile(dataPath, JSON.stringify(newPosts, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
