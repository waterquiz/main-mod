import { MetadataRoute } from 'next'
import path from 'path'
import fs from 'fs'

const BASE_URL = 'https://www.bilimod.com'

function readJson(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', filename)
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Dynamic app pages
  const appsData = readJson('apps.json')
  const apps = Array.isArray(appsData) ? appsData : (appsData.apps || [])
  const appPages: MetadataRoute.Sitemap = apps.map((app: { slug?: string; id?: string }) => ({
    url: `${BASE_URL}/apps/${app.slug || app.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Dynamic blog pages
  const blogData = readJson('blog.json')
  const posts = Array.isArray(blogData) ? blogData : (blogData.posts || [])
  const blogPages: MetadataRoute.Sitemap = posts.map((post: { slug?: string; id?: string }) => ({
    url: `${BASE_URL}/blog/${post.slug || post.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...appPages, ...blogPages]
}
