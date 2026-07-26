import { useEffect } from 'react';
import useScript from './useScript';

function useNewLandingPageStyle({ includeScripts }) {
  useScript(
    'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=5e261bc81db8f10d29648998',
    includeScripts
  );
  useScript(
    'https://aura-health-code.pages.dev/tab-content/handler.js',
    includeScripts
  );
  useScript('/static/newLandingPageContent/js/webflow.js', includeScripts);

  useEffect(() => {
    const htmlElement = document.querySelector('html');
    const bodyElement = document.querySelector('body');
    if (htmlElement) {
      htmlElement.setAttribute('data-wf-page', '6481da17a733d9bcc15e12a0');
      htmlElement.setAttribute('data-wf-site', '5e261bc81db8f10d29648998');
    }
    if (bodyElement) {
      bodyElement.setAttribute('data-w-id', '5fdcd5e9eb688ecfafbffbd0');
      bodyElement.classList.add('bg-whitesmoke');
      bodyElement.classList.add('body-res');
    }
  }, []);
}

export default useNewLandingPageStyle;
