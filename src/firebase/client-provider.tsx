'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * FirebaseClientProvider memastikan Firebase diinisialisasi di sisi client.
 * Menyediakan konteks Firebase dengan cara yang aman terhadap hidrasi Next.js.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // Inisialisasi hanya setelah komponen terpasang di browser.
    // Hal ini memastikan render pertama di client cocok dengan render server.
    const initialized = initializeFirebase();
    setServices(initialized);
  }, []);

  // Selalu render provider dan children. Komponen di dalamnya menangani 
  // status 'null' layanan Firebase dengan aman (misal: menunjukkan status loading lokal).
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
