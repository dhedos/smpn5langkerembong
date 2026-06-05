'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * FirebaseClientProvider yang dioptimalkan untuk performa.
 * Langsung merender children agar Next.js bisa menampilkan shell statis dengan cepat.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // Inisialisasi Firebase segera setelah hidrasi selesai
    const initialized = initializeFirebase();
    setServices(initialized);
  }, []);

  // Selalu render children. Context akan bernilai null sejenak, 
  // namun komponen anak sudah didesain untuk menangani status null dengan anggun.
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
