'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * FirebaseClientProvider memastikan Firebase diinisialisasi secara stabil di sisi client.
 * Menggunakan pola hydration-safe untuk mencegah mismatch antara server dan client.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  // Inisialisasi Firebase hanya setelah komponen terpasang di browser.
  useEffect(() => {
    const initialized = initializeFirebase();
    setServices(initialized);
  }, []);

  // Selalu render provider dengan shell yang stabil.
  // Layanan awal diberikan sebagai null agar konsisten dengan render server (SSR).
  return (
    <FirebaseProvider 
      app={services?.app || null} 
      firestore={services?.firestore || null} 
      auth={services?.auth || null}
    >
      {children}
    </FirebaseProvider>
  );
}
