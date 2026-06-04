'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<{
    app: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
  } | null>(null);

  useEffect(() => {
    // Inisialisasi dilakukan hanya sekali di sisi client
    const initializedServices = initializeFirebase();
    setServices(initializedServices);
    setMounted(true);
  }, []);

  // Mencegah pendobelan/flicker saat hydration dengan memastikan
  // konten hanya dirender setelah komponen benar-benar terpasang di client.
  if (!mounted || !services) {
    return null;
  }

  return (
    <FirebaseProvider 
      app={services.app} 
      firestore={services.firestore} 
      auth={services.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
