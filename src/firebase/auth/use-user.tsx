'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
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
        
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
            setLoading(false);
          } else {
            const defaultProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Administrator',
              email: firebaseUser.email || '',
              role: 'admin',
              schoolId: 'smpn5-langke-rembong' // Default ID untuk sekolah pertama
            };
            
            setDoc(userDocRef, defaultProfile, { merge: true })
              .catch(err => console.error("Auto-profile creation failed:", err));
              
            setProfile(defaultProfile);
            setLoading(false);
          }
        }, (error) => {
          console.error("Profile sync error:", error);
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