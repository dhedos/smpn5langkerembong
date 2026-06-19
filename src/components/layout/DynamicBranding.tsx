'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export function DynamicBranding() {
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !settings) return;

    const schoolName = settings.schoolName;
    if (schoolName && typeof document !== 'undefined') {
      document.title = schoolName;
    }

    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl && typeof document !== 'undefined') {
      const cacheBuster = `v=${Date.now()}`;
      const newHref = logoUrl.startsWith('data:') ? logoUrl : `${logoUrl}${logoUrl.includes('?') ? '&' : '?'}${cacheBuster}`;

      const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];

      rels.forEach(rel => {
        let elements = document.querySelectorAll(`link[rel*="${rel}"]`);
        
        if (elements.length > 0) {
          elements.forEach(el => {
            const link = el as HTMLLinkElement;
            if (link.href !== newHref) {
              link.href = newHref;
            }
          });
        } else {
          const link = document.createElement('link');
          link.rel = rel;
          link.href = newHref;
          document.head.appendChild(link);
        }
      });
    }
  }, [mounted, settings]);

  return null;
}