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

    // 1. Update Tab Title
    const schoolName = settings.schoolName;
    if (schoolName && document.title !== schoolName) {
      document.title = schoolName;
    }

    // 2. Aggressive Favicon Update
    // Mendapatkan URL logo dari database (jika ada)
    const logoUrl = settings.schoolLogoUrl;
    
    if (logoUrl) {
      const updateIcons = () => {
        // Cari semua link icon yang ada
        const links = document.querySelectorAll("link[rel*='icon']");
        
        if (links.length > 0) {
          links.forEach(link => {
            (link as HTMLLinkElement).href = logoUrl;
          });
        } else {
          // Jika tidak ada sama sekali, buat baru
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          newLink.href = logoUrl;
          document.head.appendChild(newLink);
        }
      };

      updateIcons();
      // Jalankan sekali lagi setelah jeda singkat untuk memastikan sistem framework tidak menimpanya kembali
      setTimeout(updateIcons, 1000);
    }
  }, [settings]);

  return null;
}
