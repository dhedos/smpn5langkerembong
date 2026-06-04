'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Fallback default profile if document doesn't exist yet
            setProfile({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Admin',
              email: firebaseUser.email || '',
              role: 'admin',
              schoolId: 'default-school'
            });
          }
        } catch (error) {
          console.error("Firestore Permission Error handled:", error);
          // Don't crash the app, provide fallback for initialization
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
