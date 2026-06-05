'use client';

import { useEffect, useMemo } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export function DynamicBranding() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (!settings) return;

    // 1. Update Judul Tab Browser secara instan
    const schoolName = settings.schoolName;
    if (schoolName && document.title !== schoolName) {
      document.title = schoolName;
    }

    // 2. Update Favicon tanpa manipulasi DOM yang merusak hydration
    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl) {
      const links = document.querySelectorAll("link[rel*='icon']");
      if (links.length > 0) {
        links.forEach(link => {
          if ((link as HTMLLinkElement).href !== logoUrl) {
            (link as HTMLLinkElement).href = logoUrl;
          }
        });
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = logoUrl;
        document.head.appendChild(link);
      }
    }
  }, [settings]);

  return null;
}
