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
    // Menggunakan logo sekolah dari DB jika ada, jika tidak gunakan logo perisai default
    const defaultShield = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8cGF0aCBkPSJNNTAgNSBMMTAgMjUgVjU1IEMxMCA3NSA1MCA5NSA1MCA5NSBDNTAgOTUgOTAgNzUgOTAgNTUgVjI1IEw1MCA1IFoiIGZpbGw9IiMxYTM2NWQiIC8+CiAgPHBhdGggZD0iTTUwIDIwIEw1NSAzNSBINzAgTDU4IDQ1IEw2MiA2MCBMNTAgNTAgTDM4IDYwIEw0MiA0NSBMMzAgMzUgSDQ1IEw1MCAyMCBaIiBmaWxsPSIjZmJiZjI0IiAvPgo8L3N2Zz4=';
    const logoUrl = settings.schoolLogoUrl || defaultShield;
    
    const updateIcons = () => {
      // Hapus semua link icon yang mungkin merujuk ke favicon.ico bawaan
      const existingIcons = document.querySelectorAll("link[rel*='icon']");
      existingIcons.forEach(el => el.remove());

      // Buat link icon baru yang bersih
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.type = logoUrl.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/x-icon';
      newLink.href = logoUrl;
      document.head.appendChild(newLink);

      // Tambahkan juga untuk apple-touch-icon
      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = logoUrl;
      document.head.appendChild(appleLink);
    };

    updateIcons();
    
    // Jalankan beberapa kali untuk memastikan sistem framework tidak menimpanya kembali
    const intervals = [100, 500, 1000, 2000];
    intervals.forEach(ms => setTimeout(updateIcons, ms));

  }, [settings]);

  return null;
}
