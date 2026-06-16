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
    if (logoUrl && logoUrl.startsWith('http')) {
      // Gunakan cache-buster unik agar browser terpaksa memuat ulang gambar baru
      const newHref = `${logoUrl}${logoUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;

      // Daftar rel yang sering digunakan untuk icon
      const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];

      rels.forEach(rel => {
        let element = document.querySelector(`link[rel*="${rel}"]`) as HTMLLinkElement;
        
        if (element) {
          // Jika elemen sudah ada, perbarui href-nya
          element.href = newHref;
        } else {
          // Jika belum ada, buat elemen baru
          const link = document.createElement('link');
          link.rel = rel;
          link.href = newHref;
          document.head.appendChild(link);
        }
      });
    }
  }, [mounted, settings]);

  return null;
}
