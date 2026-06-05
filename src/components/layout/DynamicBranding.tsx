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

    // 2. Update Favicon Tanpa Menghapus Node (Menghindari Error removeChild)
    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      
      link.href = logoUrl;
    }
  }, [settings]);

  // Efek pembersihan awal untuk memastikan judul tidak menampilkan teks default framework
  useEffect(() => {
    if (document.title.includes('Next.js') || document.title === '') {
      document.title = 'Memuat Website...';
    }
  }, []);

  return null;
}
