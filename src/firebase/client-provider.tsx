'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * FirebaseClientProvider ensures Firebase is initialized on the client.
 * It provides the Firebase context to the rest of the application.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Initialize services. In Next.js SSR, this returns null.
  // On the client, it initializes and returns the services.
  const services = useMemo(() => {
    if (typeof window !== 'undefined') {
      return initializeFirebase();
    }
    return null;
  }, []);

  // We always render the provider and children to maintain a consistent HTML structure
  // between server and client, which prevents hydration mismatches.
  // Components inside handle the 'null' state of services gracefully.
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
