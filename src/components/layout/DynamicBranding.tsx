'use client';

import { useEffect, useMemo } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Komponen ini bertanggung jawab untuk mensinkronisasi judul tab browser 
 * dan favicon secara real-time dengan data dari database sekolah.
 */
export function DynamicBranding() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (!settings) return;

    // 1. Sinkronisasi Judul Tab
    const schoolName = settings.schoolName;
    if (schoolName && document.title !== schoolName) {
      document.title = schoolName;
    }

    // 2. Sinkronisasi Favicon
    // Logo perisai biru-emas sebagai fallback standar
    const defaultShield = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8cGF0aCBkPSJNNTAgNSBMMTAgMjUgVjU1IEMxMCA3NSA1MCA5NSA1MCA5NSBDNTAgOTUgOTAgNzUgOTAgNTUgVjI1IEw1MCA1IFoiIGZpbGw9IiMxYTM2NWQiIC8+CiAgPHBhdGggZD0iTTUwIDIwIEw1NSAzNSBINzAgTDU4IDQ1IEw2MiA2MCBMNTAgNTAgTDM4IDYwIEw0MiA0NSBMMzAgMzUgSDQ1IEw1MCAyMCBaIiBmaWxsPSIjZmJiZjI0IiAvPgo8L3N2Zz4=';
    const logoUrl = settings.schoolLogoUrl || defaultShield;
    
    const updateIcons = () => {
      // Kita memperbarui href pada elemen ikon yang sudah ada alih-alih menghapusnya.
      // Ini mencegah error "removeChild" karena kita tidak merusak node yang dikelola Next.js.
      const iconLinks = document.querySelectorAll("link[rel*='icon']");
      if (iconLinks.length > 0) {
        iconLinks.forEach(link => {
          const l = link as HTMLLinkElement;
          if (l.href !== logoUrl) {
            l.href = logoUrl;
          }
        });
      } else {
        // Jika belum ada sama sekali, baru kita buat satu
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = logoUrl;
        document.head.appendChild(newLink);
      }

      // Update apple-touch-icon untuk perangkat mobile
      const appleLinks = document.querySelectorAll("link[rel='apple-touch-icon']");
      appleLinks.forEach(link => {
        (link as HTMLLinkElement).href = logoUrl;
      });
    };

    updateIcons();
    
    // Gunakan timeout singkat untuk memastikan kita menimpa metadata default framework
    const timeoutId = setTimeout(updateIcons, 500);
    return () => clearTimeout(timeoutId);

  }, [settings]);

  return null;
}
