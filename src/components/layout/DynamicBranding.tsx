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

    // 1. Update Judul Tab Browser
    if (settings.schoolName) {
      document.title = settings.schoolName;
    }

    // 2. Update Favicon dengan cara yang aman terhadap DOM
    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl) {
      // Cari semua elemen link yang berhubungan dengan icon
      const links = document.querySelectorAll("link[rel*='icon']");
      
      if (links.length > 0) {
        links.forEach(link => {
          (link as HTMLLinkElement).href = logoUrl;
        });
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = logoUrl;
        document.head.appendChild(link);
      }
    }
  }, [settings]);

  // Efek pembersihan awal untuk memastikan judul tidak menampilkan teks default framework
  useEffect(() => {
    if (document.title.includes('Next.js') || document.title === '' || document.title === 'Website Resmi Sekolah') {
      document.title = 'Memuat Website...';
    }
  }, []);

  return null;
}
