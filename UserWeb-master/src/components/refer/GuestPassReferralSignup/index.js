import React from 'react';
import Image from 'next/image';
import Text from '@/components/app/Text';

import useTranslations from '@/hooks/translations';

import { getCoachName } from '@/models/coach';
import { getLocaleImage } from '@/models/locale';
import ReferralSignup from '../ReferralSignup';
import styles from './styles';

function GuestPassReferralSignup({
  onSubmit,
  referralCode,
  referralType,
  referrer,
  utm_campaign,
  utm_medium,
  utm_source,
  channel,
  experiments,
  coachDetails,
}) {
  const { currentLocale, t } = useTranslations();

  return (
    <div className="content-wrapper">
      <div className="card-bg"></div>
      <div className="signup-card">
        <div className="card-content">
          <img
            className="guest-pass-card"
            src={getLocaleImage(
              '/static/images/referNew/guest-pass.png',
              currentLocale
            )}
            alt="Guest Pass Card"
          />
          <Text
            type="h3-small"
            weight="semibold"
            align="center"
            color="b100"
            style={{
              lineHeight: '135%',
              marginBottom: '6px',
              padding: '0px 30px',
            }}>
            {t('referral_name_sent_you_guest_pass', {
              count: 30,
              referrerName: coachDetails ? getCoachName(coachDetails) : 'Aura',
            })}
          </Text>
          <Text
            type="body"
            align="center"
            style={{
              marginBottom: '-9px',
              lineHeight: '20px',
              color: '#5B657A',
              fontSize: 16,
            }}>
            {t('referral_redeem_your_guest_pass_from_aura', {
              count: 30,
            })}
          </Text>
          <ReferralSignup
            onSubmit={onSubmit}
            referralCode={referralCode}
            referralType={referralType}
            referrer={referrer}
            utm_source={utm_source}
            utm_campaign={utm_campaign}
            utm_medium={utm_medium}
            channel={channel}
            experiments={experiments}
          />
          <div className="social-proof-wrapper">
            <div className="social-proof-icons ">
              <Image
                src={getLocaleImage(
                  '/static/images/bestOfAppsWinner.svg',
                  currentLocale
                )}
                alt="best-of-apple"
                height={66}
                width={90}
                style={{ width: 'auto' }}
              />
              <Image
                src={getLocaleImage(
                  '/static/images/verywellAward.png ',
                  currentLocale
                )}
                alt="very-well-award"
                height={66}
                width={106}
                style={{ width: 'auto' }}
                unoptimized
              />
            </div>
            <div className="star-rating">
              <Image
                alt="5-stars"
                src="/static/images/5stars.png"
                height={21}
                width={120}
              />
              <Text type="footnote" color="b100">
                {t('text_trusted_by_eight_million_people')}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default GuestPassReferralSignup;
