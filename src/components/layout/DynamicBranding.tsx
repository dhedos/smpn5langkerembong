
'use client';

import { useEffect, useMemo } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Komponen ini berfungsi untuk mensinkronisasi identitas sekolah (Nama & Logo)
 * ke elemen browser seperti Judul Tab dan Favicon secara real-time.
 */
export function DynamicBranding() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (!settings) return;

    // Update Judul Tab Browser
    const schoolName = settings.schoolName;
    if (schoolName) {
      document.title = `${schoolName} - Official Portal`;
    }

    // Update Favicon (Ikon Tab Browser)
    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl) {
      // Cari elemen link icon yang sudah ada atau buat baru
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      
      // Update href favicon dengan URL logo sekolah
      link.href = logoUrl;
    }
  }, [settings]);

  return null;
}
