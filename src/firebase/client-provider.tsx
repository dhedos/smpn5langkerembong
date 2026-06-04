'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<{
    app: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
  } | null>(null);

  useEffect(() => {
    // Inisialisasi dilakukan hanya sekali di sisi client
    setServices(initializeFirebase());
  }, []);

  // Jika servis belum siap, kita kembalikan null untuk menghindari flash konten default
  // Ini menghilangkan loading screen pertama yang "wagu"
  if (!services) {
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
