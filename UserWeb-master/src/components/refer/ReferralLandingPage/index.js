import React from 'react';
import Text from '@/components/app/Text';
import NewLandingPageContent from '@/components/newLandingPageContent';
import AuraRing from '@/components/app/AuraRing';
import useTranslations from '@/hooks/translations';
import appConstants from '@/utils/constants/app';
import styles from './styles';

function ReferralLandingPage({ children }) {
  const { currentLocale, t } = useTranslations();
  const handleGetStarted = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="page-background-image">
      <div className="header">
        <AuraRing size={27} />
        <Text
          type="body"
          style={{
            color: '#2F3237',
          }}>
          {t('app_aura')}
        </Text>
      </div>
      {children}
      {currentLocale === appConstants.DEFAULT_LOCALE && (
        <NewLandingPageContent
          onContinueClick={handleGetStarted}
          hideCoachAndTrackSlider
        />
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
export default ReferralLandingPage;
