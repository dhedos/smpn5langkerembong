'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Komponen ini mensinkronisasi judul tab dan favicon secara agresif.
 * Memastikan logo sekolah yang diunggah admin menggantikan ikon default framework secara total.
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

    // 2. Sinkronisasi Favicon secara Agresif
    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl) {
      // Gunakan cache-buster unik agar browser terpaksa memuat ulang gambar baru
      const newHref = `${logoUrl}?v=${Date.now()}`;

      // Cari semua elemen link yang berhubungan dengan icon (icon, shortcut icon, apple-touch-icon)
      const iconLinks = document.querySelectorAll('link[rel*="icon"]');

      if (iconLinks.length > 0) {
        // Update semua icon yang ditemukan
        iconLinks.forEach((link: any) => {
          link.href = newHref;
        });
      } else {
        // Jika tidak ditemukan sama sekali, buat elemen baru untuk icon standar dan shortcut
        const icon = document.createElement('link');
        icon.rel = 'icon';
        icon.href = newHref;
        document.head.appendChild(icon);

        const shortcut = document.createElement('link');
        shortcut.rel = 'shortcut icon';
        shortcut.href = newHref;
        document.head.appendChild(shortcut);
      }
    }
  }, [mounted, settings]);

  return null;
}
