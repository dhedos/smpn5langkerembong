'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Komponen ini mensinkronisasi judul tab dan favicon secara aman.
 * Hanya dijalankan di sisi klien setelah mounting selesai.
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

    // Sinkronisasi Judul Tab (Mengikuti input admin, besar/kecil huruf tetap)
    const schoolName = settings.schoolName;
    if (schoolName && document.title !== schoolName) {
      document.title = schoolName;
    }

    // Sinkronisasi Favicon (Menggunakan logo yang diinput admin)
    const logoUrl = settings.schoolLogoUrl;
    if (logoUrl) {
      let favLink = document.getElementById('dynamic-favicon') as HTMLLinkElement;
      if (!favLink) {
        favLink = document.createElement('link');
        favLink.id = 'dynamic-favicon';
        favLink.rel = 'icon';
        document.head.appendChild(favLink);
      }
      
      // Update link href jika berbeda dengan logo di database
      if (favLink.href !== logoUrl) {
        favLink.href = logoUrl;
      }
    }
  }, [mounted, settings]);

  return null;
}
