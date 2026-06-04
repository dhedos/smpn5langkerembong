'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<{
    app: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
  } | null>(null);

  useEffect(() => {
    const initialized = initializeFirebase();
    setServices(initialized);
    setMounted(true);
  }, []);

  // Untuk mencegah hydration mismatch, kita merender fallback yang sama di server dan client awal.
  // suppressHydrationWarning digunakan pada kontainer loading untuk mengabaikan perbedaan atribut kecil selama inisialisasi.
  if (!mounted || !services) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-transparent z-[9999]"
        suppressHydrationWarning
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary/30" strokeWidth={1.5} />
      </div>
    );
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
