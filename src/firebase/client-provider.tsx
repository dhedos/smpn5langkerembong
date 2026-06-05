'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * FirebaseClientProvider ensures Firebase is initialized correctly on the client side.
 * To avoid hydration mismatches, it renders the exact same children on server and client,
 * only providing the initialized services after the component has mounted.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // Initialize services only after hydration is complete
    const initialized = initializeFirebase();
    setServices(initialized);
  }, []);

  // We render the children immediately with null services to match SSR.
  // The FirebaseProvider and its hooks are designed to handle null services gracefully.
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
