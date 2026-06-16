'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Komponen ini mensinkronisasi judul tab dan favicon secara aman.
 * Menggunakan pembaruan atribut href daripada menghapus elemen untuk menghindari error 'removeChild' di Next.js.
 */
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

    // 1. Sinkronisasi Judul Tab
    const schoolName = settings.schoolName;
    if (schoolName && document.title !== schoolName) {
      document.title = schoolName;
    }

    // 2. Sinkronisasi Favicon secara Aman
    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl) {
      // Cari favicon yang sudah ada (link rel="icon")
      let link: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
      
      // Jika tidak ditemukan, buat elemen baru
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      
      // Gunakan cache-buster sederhana agar perubahan logo langsung terlihat
      const newHref = `${logoUrl}?v=${Date.now()}`;
      
      // Update href hanya jika berbeda untuk menghindari loop tak terbatas
      if (link.href !== newHref) {
        link.href = newHref;
      }
      
      // Juga update shortcut icon jika ada untuk kompatibilitas browser lama
      let shortcutLink: HTMLLinkElement | null = document.querySelector('link[rel="shortcut icon"]');
      if (shortcutLink) {
        shortcutLink.href = newHref;
      }
    }
  }, [mounted, settings]);

  return null;
}
