'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * FirebaseClientProvider ensures Firebase is initialized on the client.
 * It provides the Firebase context to the rest of the application in a 
 * hydration-safe manner.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Use state to hold services. Initial state is null to match server-side rendering.
  const [services, setServices] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // Initialize services only after the component has mounted on the client.
    // This prevents hydration mismatches because the first render will match the server.
    const initialized = initializeFirebase();
    setServices(initialized);
  }, []);

  // We always render the provider and children. 
  // Components inside handle the 'null' state of services gracefully 
  // (e.g., showing loading states or default content).
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
