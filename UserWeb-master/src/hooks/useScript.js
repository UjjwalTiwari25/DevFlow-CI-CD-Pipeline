import { useEffect } from 'react';

const useScript = (url, includeScripts) => {
  useEffect(() => {
    if (!includeScripts) return () => {};
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, includeScripts]);
};

export default useScript;
