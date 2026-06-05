'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

// Inisialisasi layanan secara statis untuk ketersediaan instan di sisi client
let initializedServices: any = null;
if (typeof window !== 'undefined') {
  initializedServices = initializeFirebase();
}

/**
 * FirebaseClientProvider yang dioptimalkan untuk kecepatan akses data.
 * Menyediakan layanan Firebase secara instan ke seluruh aplikasi.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Gunakan state hanya untuk memicu pembaruan jika diperlukan, 
  // tapi gunakan variabel statis untuk render pertama yang cepat.
  const [services] = useState(initializedServices);

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
