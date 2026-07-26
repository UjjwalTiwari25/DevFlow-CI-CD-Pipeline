import { toast } from 'react-toastify';
import { useMemo, useCallback } from 'react';

export default function useToastMessage() {
  const showSuccess = useCallback((message = 'Success') => {
    toast(message, {
      autoClose: 4000,
      hideProgressBar: false,
      theme: 'colored',
      type: 'success',
      pauseOnHover: true,
      style: {
        fontSize: '14px',
      },
    });
  }, []);

  const showError = useCallback((message = 'Error! Something went wrong') => {
    toast(message, {
      autoClose: 4000,
      hideProgressBar: false,
      theme: 'colored',
      type: 'error',
      pauseOnHover: true,
      style: {
        fontSize: '14px',
      },
    });
  }, []);

  return useMemo(() => ({ showSuccess, showError }), [showSuccess, showError]);
}
