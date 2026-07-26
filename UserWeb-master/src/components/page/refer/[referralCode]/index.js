import React, { useEffect } from 'react';
import Router from 'next/router';
import { getLocaleImage } from '@/models/locale';
import useTranslations from '@/hooks/translations';
import { Trans } from 'next-i18next/pages';
import usePageQuery from '../../../../hooks/pageQuery';
import referralConstants from '../../../../utils/constants/referral';
import LandingPageContent from '../../../landingPageContent';
import Text from '../../../app/Text';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';
import AuraButton from '../../../app/AuraButton';
import routeConstants from '../../../../utils/constants/routes';
import { generateQueryPath } from '../../../../utils';
import styles from './styles';
import useReferral from '../../../../hooks/referral';
import useHandleServerDataError from '../../../../hooks/handleServerDataError';
import Analytics from '../../../../services/Analytics';

function ReferReferralCode() {
  const [, isMobile] = useResponsiveWindow();
  const { t, currentLocale } = useTranslations();
  const {
    referralCode = null,
    referralType = referralConstants.TYPE_AMBASSADOR_30DAYS,
    utm_source = referralConstants.SOURCE_AMBASSADOR,
    utm_campaign = referralConstants.SOURCE_AMBASSADOR,
    channel = null,
  } = usePageQuery();
  const { referrer, loading, error } = useReferral(referralCode, referralType);
  useHandleServerDataError(error);
  useEffect(() => {
    if (referrer && !error) {
      Analytics.track('Web Referral View', {
        'Referral Code': referralCode,
        'Referral Type': referralType,
        ReferrerId: referrer && referrer.id,
        Channel: channel,
      });
    }
  }, [error, referrer, referralCode, referralType, channel]);
  function renderCTA() {
    return (
      <AuraButton
        title={t('referral_button_get_started')}
        onClick={() => {
          const path = generateQueryPath(routeConstants.PAGE_SIGNUP, {
            utm_source,
            utm_campaign,
            referralCode,
            referralType,
          });
          Router.push(path);
        }}
        loading={loading}
        style={{
          marginTop: 32,
          padding: '16px 56px',
        }}
        withShadow
        textStyle={{ fontSize: 18 }}
      />
    );
  }

  return (
    <div>
      <div className="page-content">
        <img
          src={getLocaleImage(
            '/static/images/bestOfAppleWhite.png',
            currentLocale
          )}
          id="best-of-apple"
          alt="Best of Apple"
        />
        <Text
          type={isMobile ? 'h3-large' : 'h1'}
          component="h1"
          align="center"
          color="w100"
          style={{
            maxWidth: isMobile && 300,
            border: '1px solid rgb(0, 0, 0, 0)',
          }}>
          {referrer
            ? t('referral_header_claim_guest_pass_from', {
                referrerName: referrer.givenName,
                trial: 30,
              })
            : t('referral_header_claim_guest_pass', { trial: 30 })}
        </Text>
        {isMobile && (
          <img
            src={getLocaleImage('/static/images/guestPass.png', currentLocale)}
            className="guest-pass-card"
            alt="Guest Pass Card"
          />
        )}
        <Text
          type={isMobile ? 'body' : 'h3'}
          align="center"
          color="w100"
          style={{
            marginTop: isMobile ? 32 : 12,
            marginBottom: 12,
            width: isMobile ? 260 : 'auto',
          }}>
          <Trans ns="refer" i18nKey="referral_subtitle_take_care" />
        </Text>
        {renderCTA()}
      </div>
      <LandingPageContent renderCTA={renderCTA} />
      <style jsx>{styles}</style>
    </div>
  );
}

export default ReferReferralCode;
