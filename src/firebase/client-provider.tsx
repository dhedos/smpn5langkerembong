'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * FirebaseClientProvider yang aman untuk hidrasi.
 * Menghindari render kondisional di tingkat root yang dapat memicu ketidakcocokan DOM.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // Inisialisasi hanya terjadi di sisi client setelah hidrasi selesai
    const initialized = initializeFirebase();
    setServices(initialized);
  }, []);

  // Selalu render children dengan provider tanpa div pembungkus tambahan yang berbeda antara server/client.
  // Hooks di dalamnya (useFirestore, dll) sudah didesain menangani status null selama proses inisialisasi.
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
