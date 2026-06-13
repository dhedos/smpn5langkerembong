
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Komponen ini mensinkronisasi judul tab dan favicon secara aman.
 * Hanya dijalankan di sisi klien setelah mounting selesai untuk mencegah client-side exceptions.
 */
export function DynamicBranding() {
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db, currentSchoolId]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !settings) return;

    // 1. Sinkronisasi Judul Tab
    const schoolName = settings.schoolName;
    if (schoolName && typeof document !== 'undefined' && document.title !== schoolName) {
      document.title = schoolName;
    }

    // 2. Sinkronisasi Favicon secara aman
    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl && typeof document !== 'undefined') {
      const favLink = document.getElementById('dynamic-favicon') as HTMLLinkElement;
      if (favLink && favLink.href !== logoUrl) {
        favLink.href = logoUrl;
      }
    }
  }, [mounted, settings]);

  return null;
}
