import React from 'react';
import Footer from '@/components/app/footer';
import useTheme, { THEMES } from '@/hooks/theme';
import NavBar from '../../components/navbar';
import BaseLayout from '../BaseLayout';
import styles from './styles';

export default function LayoutWithNav({
  children,
  isUserFromQuery,
  hideFooterBackground,
  hideBackgroundImages,
  showBanner = true,
  showSeriesBackground = false,
  showSEOFooter,
}) {
  useTheme(THEMES.LIGHT);

  return (
    <div>
      <BaseLayout
        showBanner={showBanner}
        isUserFromQuery={isUserFromQuery}
        hideFooterBackground={hideFooterBackground}
        hideBackgroundImages={hideBackgroundImages}
        showSeriesBackground={showSeriesBackground}>
        <div className="main">
          <div className="nav">
            <NavBar></NavBar>
          </div>
          <div className={`child`} style={{ paddingTop: '0' }}>
            {children}
            {showSEOFooter && <Footer />}
          </div>
        </div>
      </BaseLayout>
      <style jsx>{styles}</style>
    </div>
  );
}
