import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { isClient, isTestMode } from '@/utils';
import { appWithTranslation } from 'next-i18next/pages';
import { ErrorBoundary } from '../services/Bugsnag';
import Error from './_error';
import { wrapper } from '../store';
import { setupAxios } from '../utils/setupAxios';
import '@aurahealth/web-design-system/dist/styles/globals/global.scss';
import '@aurahealth/web-design-system/dist/assets/css/ui-video-seek-slider.css';

setupAxios();

function AuraApp({ Component, ...rest }) {
  const { props, store } = wrapper.useWrappedStore(rest);
  if (isTestMode() && isClient()) {
    window.store = store;
  }

  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={Error}>
        <Component {...props.pageProps} />
        <ToastContainer />
      </ErrorBoundary>
    </Provider>
  );
}

export default appWithTranslation(AuraApp);
