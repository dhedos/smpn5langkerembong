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

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  // Tidak melemparkan error agar SSR dan initial hydration tidak crash
  return context;
};

export const useFirebaseApp = () => useFirebase()?.app || null;
export const useFirestore = () => useFirebase()?.firestore || null;
export const useAuth = () => useFirebase()?.auth || null;
