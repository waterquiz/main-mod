import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bili Mod - Download Mod APK Files',
    short_name: 'Bili Mod',
    description: 'Bilimod trusted platform for safe, fast, and secure Android app and game mod apk downloads.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#3DDC84',
    icons: [
      {
        src: '/download-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/download-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
