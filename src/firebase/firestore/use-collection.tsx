'use client';

import { useState, useEffect, useRef } from 'react';
import { Query, onSnapshot } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T = any>(query: Query | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const queryRef = useRef<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    // Use a simpler stability check to avoid ID: ca9 internal errors
    const currentQueryKey = query.toString();
    if (queryRef.current === currentQueryKey) return;
    queryRef.current = currentQueryKey;

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
  }, [query]); 

  return { data, loading, error };
}