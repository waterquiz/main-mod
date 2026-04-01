"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function DynamicAds() {
  const [settings, setSettings] = useState<any>(null);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  // Load settings once when the component mounts
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load ad settings:", error);
      }
    }
    loadSettings();
  }, []);

  // Handle injection and cleanup
  useEffect(() => {
    if (isAdminPage) {
      // Clean up injected scripts when entering admin areas
      ['popunder-1', 'socialbar-1'].forEach(id => {
        const el = document.getElementById(`dynamic-ad-${id}`);
        if (el) el.remove();
      });
      return;
    }

    if (settings?.ad_global_enabled) {
      // Inject Popunder script (Slot 1 only) - Instruction: Paste before </head>
      const popunderCode = settings[`ad_popunder_1`];
      if (popunderCode && popunderCode.trim() !== '') {
        injectScript(popunderCode, `popunder-1`, 'head');
      }

      // Inject Social Bar script (Slot 1 only) - Instruction: Insert above </body>
      const socialBarCode = settings[`ad_socialbar_1`];
      if (socialBarCode && socialBarCode.trim() !== '') {
        injectScript(socialBarCode, `socialbar-1`, 'body');
      }
    }
  }, [isAdminPage, pathname, settings]);

  const injectScript = (code: string, id: string, target: 'head' | 'body') => {
    // Check if already injected
    if (document.getElementById(`dynamic-ad-${id}`)) return;

    try {
      // Create a temporary element to parse the HTML string
      const div = document.createElement('div');
      div.innerHTML = code.trim();
      const originalScript = div.querySelector('script');
      
      if (!originalScript) return;

      // Create the real script element
      const newScript = document.createElement('script');
      newScript.id = `dynamic-ad-${id}`;
      
      // Copy all attributes from the original script tag
      Array.from(originalScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy any inline content (if it's not a src-only script)
      if (originalScript.innerHTML) {
        newScript.innerHTML = originalScript.innerHTML;
      }

      // Append to the requested target location
      if (target === 'head') {
        document.head.appendChild(newScript);
      } else {
        document.body.appendChild(newScript);
      }
    } catch (e) {
      console.error(`Failed to inject dynamic script ${id}:`, e);
    }
  };

  return null;
}
