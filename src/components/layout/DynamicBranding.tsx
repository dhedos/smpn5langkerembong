
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
    const defaultShield = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8cGF0aCBkPSJNNTAgNSBMMTAgMjUgVjU1IEMxMCA3NSA1MCA5NSA1MCA5NSBDNTAgOTUgOTAgNzUgOTAgNTUgVjI1IEw1MCA1IFoiIGZpbGw9IiMxYTM2NWQiIC8+CiAgPHBhdGggZD0iTTUwIDIwIEw1NSAzNSBINzAgTDU4IDQ1IEw2MiA2MCBMNTAgNTAgTDM4IDYwIEw0MiA0NSBMMzAgMzUgSDQ1IEw1MCAyMCBaIiBmaWxsPSIjZmJiZjI0IiAvPgo8L3N2Zz4=';
    const logoUrl = settings.schoolLogoUrl || defaultShield;
    
    const updateIcons = () => {
      // Kita menggunakan ID khusus agar tidak berbenturan dengan elemen yang dikelola Next.js
      const favId = 'dynamic-favicon';
      let favLink = document.getElementById(favId) as HTMLLinkElement;
      
      if (!favLink) {
        favLink = document.createElement('link');
        favLink.id = favId;
        favLink.rel = 'icon';
        document.head.appendChild(favLink);
      }
      
      if (favLink.href !== logoUrl) {
        favLink.href = logoUrl;
      }

      // Update apple-touch-icon juga dengan cara yang aman
      const appleId = 'dynamic-apple-icon';
      let appleLink = document.getElementById(appleId) as HTMLLinkElement;
      if (!appleLink) {
        appleLink = document.createElement('link');
        appleLink.id = appleId;
        appleLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleLink);
      }
      if (appleLink.href !== logoUrl) {
        appleLink.href = logoUrl;
      }
    };

    updateIcons();
    
    // Gunakan timeout singkat untuk memastikan kita menimpa metadata default framework
    const timeoutId = setTimeout(updateIcons, 100);
    return () => clearTimeout(timeoutId);

  }, [settings]);

  return null;
}
