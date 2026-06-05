'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

interface FirebaseContextType {
  app: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ 
  children, 
  app, 
  firestore, 
  auth 
}: { 
  children: React.ReactNode;
  app?: FirebaseApp | null;
  firestore?: Firestore | null;
  auth?: Auth | null;
}) {
  const value = useMemo(() => ({
    app: app || null,
    firestore: firestore || null,
    auth: auth || null
  }), [app, firestore, auth]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

/**
 * Hooks aman yang tidak melempar error jika provider belum siap,
 * mencegah crash pada render pertama (SSR/Hydration).
 */
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  return context || { app: null, firestore: null, auth: null };
};

export const useFirebaseApp = () => useFirebase().app;
export const useFirestore = () => useFirebase().firestore;
export const useAuth = () => useFirebase().auth;
