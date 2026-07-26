import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useHandleServerDataError(serverError) {
  const router = useRouter();
  useEffect(() => {
    if (serverError && !router.isFallback) {
      window.location.replace('/not-found');
    }
  }, [serverError, router.isFallback]);
}
