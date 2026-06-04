'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin';
  schoolId: string | null;
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
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setProfile(userDocSnap.data() as UserProfile);
          } else {
            // Jika dokumen profil belum ada, buatkan default untuk mencegah error permission
            const defaultProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Admin Baru',
              email: firebaseUser.email || '',
              role: 'admin',
              schoolId: 'default-school'
            };
            
            // Simpan ke Firestore
            await setDoc(userDocRef, defaultProfile);
            setProfile(defaultProfile);
          }
        } catch (error) {
          console.warn("Permission handling during init:", error);
          // Fallback lokal jika Firestore belum siap atau rules memblokir sementara
          setProfile({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Admin',
            email: firebaseUser.email || '',
            role: 'admin',
            schoolId: 'default-school'
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, [auth, db]);

  return { user, profile, loading };
}