'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin';
  schoolId: string;
};

export function useUser() {
  const auth = useAuth();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Use onSnapshot for real-time profile updates
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
            setLoading(false);
          } else {
            // Auto-create profile if missing to avoid permission issues
            const defaultProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Admin',
              email: firebaseUser.email || '',
              role: 'admin',
              schoolId: 'default-school'
            };
            
            // Set doc in background
            setDoc(userDocRef, defaultProfile, { merge: true });
            setProfile(defaultProfile);
            setLoading(false);
          }
        }, (error) => {
          console.error("Profile listen error:", error);
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
  }, [auth, db]);

  return { user, profile, loading };
}