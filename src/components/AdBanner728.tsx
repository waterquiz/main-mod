"use client";

import { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  placement?: 'home' | 'apps' | 'categories' | 'trending' | 'blog' | 'post';
  index?: number;
}

export default function AdBanner728({ placement = 'home', index = 1 }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCode, setHasCode] = useState(false);
  
  // Use a unique ID for each instance to avoid collisions
  const [instanceId] = useState(() => Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load ad settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings?.ad_728x90_enabled) {
      // Determine which ad code to use based on placement and index
      const normalizedIndex = ((index - 1) % 3) + 1;
      const fieldKey = `ad_728x90_${placement}_${normalizedIndex}`;
      let code = settings[fieldKey];

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
        const key = keyMatch ? keyMatch[1] : '5561d6e33a631fd07b956304f36f9373';

        // Extract script src if it's there
        const srcMatch = code.match(/src="([^"]*)"/) || code.match(/src='([^']*)'/);
        const src = srcMatch ? srcMatch[1] : `//www.highperformanceformat.com/${key}/invoke.js`;

        const scriptId = `at-options-${key}-${instanceId}`;
        if (!document.getElementById(scriptId)) {
          const atOptionsScript = document.createElement('script');
          atOptionsScript.id = scriptId;
          atOptionsScript.innerHTML = `
            atOptions = {
              'key' : '${key}',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
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
  }, [settings, placement, index, instanceId]);

  if (isLoading || !settings?.ad_728x90_enabled || !hasCode) return null;

  return (
    <div className="w-full flex justify-center py-6 my-8 overflow-hidden">
      <div 
        ref={containerRef}
        style={{ width: '728px', height: '90px' }}
        className="bg-black/10 border border-white/5 rounded-xl flex items-center justify-center text-neutral-600 text-xs"
      >
        {/* Ad will be injected here */}
        Loading Ad...
      </div>
    </div>
  );
}
