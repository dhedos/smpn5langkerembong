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
            // Inisialisasi profil jika belum ada
            const defaultProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'GN Admin',
              email: firebaseUser.email || '',
              role: 'admin',
              schoolId: 'smpn5-langke-rembong' // Default tenant ID
            };
            
            // Mencoba membuat profil secara otomatis (Rules mengizinkan ini untuk pemilik UID)
            setDoc(userDocRef, defaultProfile, { merge: true })
              .catch(err => console.warn("Auto-profile sync delayed:", err));
              
            setProfile(defaultProfile);
            setLoading(false);
          }
        }, (error) => {
          console.error("Profile access denied:", error);
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