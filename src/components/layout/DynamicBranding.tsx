'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Komponen ini mensinkronisasi judul tab dan favicon secara aman.
 * Menghapus ikon default browser secara paksa dan menggantinya dengan logo admin.
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
      // Hapus semua link icon yang ada untuk menghindari konflik
      const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      existingIcons.forEach(icon => icon.remove());

      // Buat link icon baru
      const newIcon = document.createElement('link');
      newIcon.id = 'dynamic-favicon';
      newIcon.rel = 'icon';
      newIcon.type = 'image/x-icon'; // Atau sesuaikan dengan tipe file jika perlu
      newIcon.href = `${logoUrl}?v=${Date.now()}`; // Tambahkan cache-buster
      
      document.head.appendChild(newIcon);
    }
  }, [mounted, settings]);

  return null;
}
