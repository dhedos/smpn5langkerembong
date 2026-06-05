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

    // 1. Update Judul Tab Segera
    if (settings.schoolName) {
      document.title = settings.schoolName;
    }

    // 2. Timpa Ikon (Favicon) Framework/Default
    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl) {
      // Cari dan hapus semua ikon bawaan (rel="icon", rel="shortcut icon", dll)
      const existingIcons = document.querySelectorAll("link[rel*='icon']");
      existingIcons.forEach(icon => icon.remove());

      // Buat ikon baru dari logo sekolah yang diunggah
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = logoUrl;
      document.getElementsByTagName('head')[0].appendChild(link);

      // Tambahkan rel shortcut icon untuk kompatibilitas luas
      const shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      shortcutLink.href = logoUrl;
      document.getElementsByTagName('head')[0].appendChild(shortcutLink);
    }
  }, [settings]);

  // Efek pembersihan awal untuk memaksa penghapusan teks default jika metadata Next.js belum berubah
  useEffect(() => {
    if (document.title === 'Website Resmi') {
      document.title = ' ';
    }
  }, []);

  return null;
}
