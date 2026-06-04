'use client';

import { useState, useEffect } from 'react';
import { Query, onSnapshot } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T = any>(query: Query | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Jika query null atau undefined, hentikan loading
    if (!query) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        if (!isMounted) return;
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(items);
        setLoading(false);
        setError(null);
      },
      (serverError) => {
        if (!isMounted) return;
        const permissionError = new FirestorePermissionError({
          path: 'collection',
          operation: 'list',
        });
        // Jangan emit error jika ini hanya karena unmount saat development
        if (serverError.code !== 'cancelled') {
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [query]); 

  return { data, loading, error };
}
