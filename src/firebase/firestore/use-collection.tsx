
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
    if (!query) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);
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
        console.error("Firestore useCollection Error:", serverError);
        
        if (serverError.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: 'collection_query',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
        } else {
          setError(serverError);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [query?.toString()]); // Re-run if query definition changes

  return { data, loading, error };
}
