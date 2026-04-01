"use client";

import { useEffect, useRef, useState } from 'react';

interface AdSidebarProps {
  placement?: 'sidebar' | 'post';
  index?: number;
}

export default function AdSidebar300({ placement = 'sidebar', index = 1 }: AdSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCode, setHasCode] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load sidebar ad settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings?.ad_300x250_enabled) {
      const fieldKey = placement === 'post' ? 'ad_300x250_post_1' : `ad_300x250_sidebar_${index}`;
      const code = settings[fieldKey];
      
      if (!code || code.trim() === '') {
        setHasCode(false);
        return;
      }

      setHasCode(true);

      if (containerRef.current) {
        // Clear previous content
        containerRef.current.innerHTML = '';
        
        // Extract key from the code if it's there
        const keyMatch = code.match(/'key'\s*:\s*'([^']*)'/) || code.match(/"key"\s*:\s*"([^"]*)"/);
        const key = keyMatch ? keyMatch[1] : 'e84916296eb2ccc66cb11a88656affcf';

        // Extract script src if it's there
        const srcMatch = code.match(/src="([^"]*)"/) || code.match(/src='([^']*)'/);
        const src = srcMatch ? srcMatch[1] : `//www.highperformanceformat.com/${key}/invoke.js`;

        const scriptId = `at-options-sidebar-${key}`;
        if (!document.getElementById(scriptId)) {
          const atOptionsScript = document.createElement('script');
          atOptionsScript.id = scriptId;
          atOptionsScript.innerHTML = `
            atOptions = {
              'key' : '${key}',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          `;
          document.head.appendChild(atOptionsScript);
        }

        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = src;
        
        containerRef.current.appendChild(invokeScript);
      }
    } else {
      setHasCode(false);
    }
  }, [settings, placement, index]);

  if (isLoading || !settings?.ad_300x250_enabled || !hasCode) return null;

  return (
    <div className="w-full flex justify-center py-4 my-4 overflow-hidden">
      <div className="relative">
        <div className="absolute -top-4 left-0 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Advertisement</div>
        <div 
          ref={containerRef}
          style={{ width: '300px', height: '250px' }}
          className="bg-black/20 border border-white/5 rounded-2xl flex items-center justify-center text-neutral-600 text-xs"
        >
          {/* Ad will be injected here */}
          Loading Sidebar Ad ({index})...
        </div>
      </div>
    </div>
  );
}
