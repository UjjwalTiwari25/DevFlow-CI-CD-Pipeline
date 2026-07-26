import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import useUserPreferredLocale from '@/hooks/userPreferredLocale';
import { setAppLocale } from '@/store/slices/app';
import fontStyles from '../../styles/fontStyles';
import flexStyles from '../../styles/flexStyles';
import shadowStyles from '../../styles/shadowStyles';
import Analytics from '../../services/Analytics';
import useGTM from '../../hooks/googleTagManager';
import GetStartedBanner from '../../components/app/GetStartedBanner';
import AuthListener from '../../components/app/AuthListener';
import useTrackAttribution from '../../hooks/trackAttribution';
import styles, { componentStyles } from './styles';
import FooterBackground from '../../components/app/FooterBackground';
import { setAuthLoading } from '../../store/slices/auth';
import darkStyles from '../../styles/darkStyles';
import useThemeListener from '../../hooks/themeListener';

export default function BaseLayout({
  children,
  onAnalyticsInit,
  showBanner = false,
  useAuth = false,
  isUserFromQuery,
  allowSignup,
  onAuthChange,
  isDarkMode = false,
  hideFooterBackground,
  hideBackgroundImages,
  showSeriesBackground,
  isNewBackground,
  newBackgroundImage,
}) {
  const [showTopBar, setShowTopBar] = useState();
  const dispatch = useDispatch();
  const { isDark } = useThemeListener();
  const onAnalyticsInitRef = useRef(onAnalyticsInit);
  useTrackAttribution();
  useGTM();
  useUserPreferredLocale();
  const { currentLocale } = useTranslations();
  useEffect(() => {
    const showLoadingBar = () => {
      setShowTopBar(true);
    };
    const hideLoadingBar = () => {
      setShowTopBar(false);
    };
    Router.events.on('routeChangeStart', showLoadingBar);
    Router.events.on('routeChangeComplete', hideLoadingBar);
    Router.events.on('routeChangeError', hideLoadingBar);

    return () => {
      Router.events.off('routeChangeStart', showLoadingBar);
      Router.events.off('routeChangeComplete', hideLoadingBar);
      Router.events.off('routeChangeError', hideLoadingBar);
    };
  }, []);

  useEffect(() => {
    onAnalyticsInitRef.current = onAnalyticsInit;
  }, [onAnalyticsInit]);

  useEffect(() => {
    Analytics.init();
    if (typeof onAnalyticsInitRef.current === 'function') {
      onAnalyticsInitRef.current();
    }
  }, []);

  useEffect(() => {
    I18NFormatter.init(currentLocale);
    dispatch(setAppLocale(currentLocale));
  }, [currentLocale, dispatch]);

  useEffect(() => {
    if (!useAuth) {
      dispatch(setAuthLoading(false));
    }
  }, [useAuth, dispatch]);

  function applyDarkStyles() {
    return <style jsx>{darkStyles}</style>;
  }

  return (
    <div
      className={classNames({
        'dark-background': isDarkMode && !isNewBackground,
        'new-background': isNewBackground,
      })}>
      <Head>
        <link
          rel="icon"
          type="image/png"
          href="/static/images/icons/auraLogo.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          href="/static/images/icons/auraLogo.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <link rel="preload" href="/static/images/dark-background.webp" />
        <link
          rel="preload"
          href="/static/images/NewBackground2/newbackground2.webp"
        />
        <link
          rel="preload"
          href="/static/images/NewBackground2/newbackground2_a.webp"
        />
        <link
          rel="preload"
          href="/static/images/coach/series-background.webp"
        />
        {/* Zoho Conversion Tracker - PageSense (required by WebFlow) */}
        <script src="https://cdn.pagesense.io/js/aurahealth/e0c1420547624e6ebe9ad9e6e0585ff1.js" />
      </Head>

      {isDarkMode && !hideBackgroundImages && !isNewBackground && (
        <img
          src={'/static/images/dark-background.webp'}
          alt=""
          className="light-effect-background"
        />
      )}
      {isDarkMode &&
        !hideBackgroundImages &&
        isNewBackground &&
        newBackgroundImage && (
          <img
            src={newBackgroundImage}
            alt="aura"
            className="light-effect-background"
          />
        )}

      {showTopBar && <div id="bar"></div>}

      {isDarkMode && !hideBackgroundImages && !isNewBackground && (
        <div className="row align-center">
          <div>
            <img
              src="/static/images/NewBackground2/newbackground2.webp"
              alt="aura"
              className="darkmodebackground"
            />
          </div>
          <div>
            <img
              src="/static/images/NewBackground2/newbackground2_a.webp"
              alt="aura"
              className="newdarkbackground"
            />
          </div>
        </div>
      )}
      {!isDarkMode && (!hideBackgroundImages || !hideFooterBackground) && (
        <FooterBackground />
      )}
      {showSeriesBackground && (
        <img
          src="/static/images/coach/series-background.webp"
          alt="aura backgroung"
          className="background-series"
        />
      )}
      {!hideFooterBackground && !isNewBackground && <FooterBackground />}
      {(useAuth || showBanner) && (
        <AuthListener
          isUserFromQuery={isUserFromQuery}
          allowSignup={allowSignup}
          onAuthChange={onAuthChange}
        />
      )}
      {showBanner && <GetStartedBanner />}
      {children}
      <style jsx global>
        {styles}
      </style>
      <style jsx global>
        {fontStyles}
      </style>
      <style jsx global>
        {flexStyles}
      </style>
      <style jsx global>
        {shadowStyles}
      </style>
      <style jsx>{componentStyles}</style>
      {isDark && applyDarkStyles()}
    </div>
  );
}
