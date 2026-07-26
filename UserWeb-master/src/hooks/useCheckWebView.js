import { useEffect, useState } from 'react';

export default function useCheckWebView() {
  const [isWebView, setIsWebView] = useState(true);

  useEffect(() => {
    const checkWebView = () => {
      const userAgent = navigator.userAgent || window.opera;

      const safari = /safari/.test(userAgent);

      const isAndroidWebview = /; wv\)/.test(userAgent.toLowerCase());
      const isIosWebview =
        /iphone|ipod|ipad/.test(userAgent.toLowerCase()) &&
        !window.navigator.standalone &&
        !safari;

      if (isAndroidWebview || isIosWebview) setIsWebView(true);
      else setIsWebView(false);
    };

    checkWebView();
  }, []);

  return [isWebView];
}
