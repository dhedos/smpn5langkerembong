
'use client';

import { useEffect, useMemo } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Komponen ini mensinkronisasi judul tab dan favicon secara aman.
 * Menghindari error 'removeChild' dengan memperbarui atribut elemen yang sudah ada,
 * bukan menambah/menghapus node secara manual di head.
 */
export function DynamicBranding() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db, currentSchoolId]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (!settings) return;

    // 1. Sinkronisasi Judul Tab
    const schoolName = settings.schoolName;
    if (schoolName && document.title !== schoolName) {
      document.title = schoolName;
    }

    // 2. Sinkronisasi Favicon secara aman dengan memperbarui elemen ber-ID
    const defaultShield = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8cGF0aCBkPSJNNTAgNSBMMTAgMjUgVjU1IEMxMCA3NSA1MCA5NSA1MCA5NSBDNTAgOTUgOTAgNzUgOTAgNTUgVjI1IEw1MCA1IFoiIGZpbGw9IiMxYTM2NWQiIC8+CiAgPHBhdGggZD0iTTUwIDIwIEw1NSAzNSBINzAgTDU4IDQ1IEw2MiA2MCBMNTAgNTAgTDM4IDYwIEw0MiA0NSBMMzAgMzUgSDQ1IEw1MCAyMCBaIiBmaWxsPSIjZmJiZjI0IiAvPgo8L3N2Zz4=';
    const logoUrl = settings.schoolLogoUrl || defaultShield;
    
    // Update elemen favicon yang dideklarasikan di layout.tsx
    const favLink = document.getElementById('dynamic-favicon') as HTMLLinkElement;
    if (favLink && favLink.href !== logoUrl) {
      favLink.href = logoUrl;
    }

    const appleLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if (appleLink && appleLink.href !== logoUrl) {
      appleLink.href = logoUrl;
    }

  }, [settings]);

  return null;
}
