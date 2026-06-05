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

    // Update Judul Tab Browser Secara Instan
    const schoolName = settings.schoolName;
    if (schoolName) {
      document.title = schoolName;
    }

    // Update Favicon (Ikon Tab Browser)
    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl) {
      // Hapus ikon lama jika ada untuk mencegah tumpang tindih
      const existingIcons = document.querySelectorAll("link[rel*='icon']");
      existingIcons.forEach(icon => icon.remove());

      // Buat ikon baru dari logo sekolah yang diunggah
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = logoUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [settings]);

  return null;
}
