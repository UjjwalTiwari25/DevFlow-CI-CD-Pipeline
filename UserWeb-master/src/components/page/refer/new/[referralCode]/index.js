import React from 'react';
import Router from 'next/router';
import NewLandingPageContent from '@/components/newLandingPageContent';
import NewLandingPageStyle from '@/components/newLandingPageContent/NewLandingPageStyle';
import AuraRing from '@/components/app/AuraRing';
import useTranslations from '@/hooks/translations';
import { getLocaleImage } from '@/models/locale';
import usePageQuery from '../../../../../hooks/pageQuery';
import referralConstants from '../../../../../utils/constants/referral';
import Text from '../../../../app/Text';
import useResponsiveWindow from '../../../../../hooks/responsiveWindow';
import AuraButton from '../../../../app/AuraButton';
import routeConstants from '../../../../../utils/constants/routes';
import { generateQueryPath } from '../../../../../utils';
import styles from './styles';

function NewReferReferralCode({ referral }) {
  const { referrer } = referral;

  const [, isMobile] = useResponsiveWindow();
  const { t, currentLocale } = useTranslations();
  const {
    referralCode = null,
    referralType = referralConstants.TYPE_USER_SUBSCRIPTION_30TRIAL,
    utm_source = referralConstants.SOURCE_USER_REFERRAL,
    utm_campaign = referralConstants.SOURCE_USER_REFERRAL,
    utm_medium,
  } = usePageQuery();
  const redirectURL = generateQueryPath(routeConstants.PAGE_SIGNUP, {
    utm_source,
    utm_campaign,
    referralCode,
    referralType,
    utm_medium,
  });

  const handleGetStarted = () => {
    if (!referrer || !referrer.id) return;
    Router.push(redirectURL);
  };

  function renderCTA() {
    return (
      <AuraButton
        title={t('referral_button_get_started')}
        onClick={handleGetStarted}
        style={{
          background: 'linear-gradient(270deg, #98DFFF 0%, #41F4FF 100%)',
          boxShadow: '0px -1.14px 0px 0px rgba(255, 255, 255, 0.60) inset',
          width: isMobile ? 180 : 240,
          marginBottom: isMobile ? 35 : 140,
        }}
        textStyle={{ fontSize: 20, fontWeight: 700 }}
      />
    );
  }

  return (
    <div className="page-background-image">
      <NewLandingPageStyle />
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
      <div className="page-content">
        {!isMobile && (
          <img
            src={getLocaleImage(
              '/static/images/bestOfAppleWhite.png',
              currentLocale
            )}
            className="best-of-apple"
            alt="Best of Apple"
          />
        )}
        <img
          className="guest-pass-card"
          src="/static/images/referNew/guest-pass.png"
          alt="Guest Pass Card"
        />
        <Text
          component="h1"
          align="center"
          style={{
            maxWidth: isMobile ? 300 : 450,
            border: '1px solid rgb(0, 0, 0, 0)',
            fontSize: isMobile ? 24 : 38,
            color: '#2F3237',
            margin: isMobile ? '0 0 10px' : '0 0 15px',
          }}>
          {referrer && referrer.givenName
            ? t('referral_header_claim_guest_pass_from', {
                referrerName: referrer.givenName,
                trial: 30,
              })
            : t('referral_header_claim_guest_pass', { trial: 30 })}
        </Text>

        <Text
          type={isMobile ? 'body' : 'h4'}
          align="center"
          color="b100"
          weight="regular"
          style={{
            width: isMobile ? 260 : 420,
            lineHeight: '125%',
            color: '#2F3237',
            textShadow: 'unset',
            marginBottom: 25,
          }}>
          {t('referral_subtitle_take_care2')}
        </Text>
        {renderCTA()}
      </div>
      <NewLandingPageContent onContinueClick={handleGetStarted} />
      <style jsx>{styles}</style>
    </div>
  );
}

export default NewReferReferralCode;
