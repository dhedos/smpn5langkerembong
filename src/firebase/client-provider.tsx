'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Inisialisasi services secara memoized agar stabil.
  // Di Next.js, ini akan bernilai null saat SSR karena window tidak didefinisikan.
  const services = useMemo(() => {
    if (typeof window !== 'undefined') {
      return initializeFirebase();
    }
    return null;
  }, []);

  // Kita selalu me-render FirebaseProvider untuk memastikan hooks tidak crash.
  // Pada server (SSR), services akan null. Komponen anak akan mendapatkan 'null' 
  // dan merender status loading/default mereka sendiri tanpa crash.
  return (
    <FirebaseProvider 
      app={services?.app} 
      firestore={services?.firestore} 
      auth={services?.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
