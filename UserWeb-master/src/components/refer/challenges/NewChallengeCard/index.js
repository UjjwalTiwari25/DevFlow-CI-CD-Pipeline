import React, { useCallback } from 'react';
import classNames from 'classnames';

import useResponsiveWindow from '@/hooks/responsiveWindow';
import Image from 'next/image';
import { getLocaleImage } from '@/models/locale';
import Text from '@/components/app/Text';
import useTranslations from '@/hooks/translations';
import ReferralSignup from '../../ReferralSignup';
import styles from './styles';

function NewChallengeCard({
  experiments,
  referrer,
  challenge,
  onSubmit,
  coachDetails,
  referralCode,
  referralType,
  utm_campaign,
  utm_medium,
  utm_source,
  channel,
}) {
  const [, isMobile] = useResponsiveWindow();
  const { currentLocale, t } = useTranslations();
  const getSubtitleText = useCallback(() => {
    if (!referrer || !referrer.givenName) {
      return t('challenge_referral_subtitle_enjoy_trial');
    }
    if (challenge) {
      if (challenge.name?.toLowerCase().includes('challenge')) {
        return t('challenge_referral_subtitle_begin_with_challenge', {
          challengeName: challenge.name,
          referrerName: referrer.givenName,
        });
      }
      return t('challenge_referral_subtitle_begin_with_challenge2', {
        challengeName: challenge.name,
        referrerName: referrer.givenName,
      });
    }

    return t('challenge_referral_subtitle_enjoy_trial_from', {
      referrerName: referrer.givenName,
    });
  }, [challenge, referrer, t]);

  return (
    <div className="content-wrapper">
      <div className="card-bg"></div>
      <div className="new-challenge-card">
        <div
          className={classNames('new-challenge-content', {
            'coach-challenge-content': coachDetails,
          })}>
          <div
            className={classNames('challenge-card', {
              'coach-challenge-card': coachDetails,
            })}
            style={{
              background: `url("${challenge.cardImage}")`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}>
            {!coachDetails ? (
              <>
                <Image
                  src="/static/images/icons/challengeIcon.svg"
                  height={isMobile ? 34 : 39}
                  width={isMobile ? 34 : 39}
                  alt="medal"
                  style={{
                    marginBottom: 17,
                    width: 'auto',
                    filter: 'brightness(0) invert(1)',
                  }}
                />
                <Text
                  align="center"
                  type="h3-small"
                  color="w100"
                  weight="semibold"
                  style={{
                    maxWidth: 220,
                    lineHeight: '120%',
                    marginBottom: 6,
                  }}>
                  {challenge.name}
                </Text>
                <Text
                  align="center"
                  type="body2"
                  color="w100"
                  style={{ lineHeight: '135%', letterSpacing: ' 0.14px' }}>
                  {t('challenge_referral_challenge_duration', {
                    duration: challenge.tracks?.length || 30,
                  })}
                </Text>
              </>
            ) : (
              <>
                <div className="coach-challenge-icon-wrapper">
                  <Image
                    src="/static/images/icons/challengeIcon.svg"
                    height={15}
                    width={15}
                    alt="medal"
                    style={{
                      width: 'auto',
                      filter: 'brightness(0) invert(1)',
                    }}
                  />
                  <Text
                    align="center"
                    type="footnote"
                    color="w100"
                    style={{
                      lineHeight: '125%',
                      marginTop: 2,
                      textShadow: '0px 0px 8px rgba(0, 0, 0, 0.16)',
                    }}>
                    {t('challenge_referral_challenge_duration', {
                      duration: challenge.tracks?.length || 30,
                    })}
                  </Text>
                </div>
                <Text
                  align="left"
                  type={isMobile ? 'h4' : 'h3-small'}
                  color="w100"
                  weight="semibold"
                  style={{
                    maxWidth: 220,
                    lineHeight: '110%',
                    marginBottom: 4,
                  }}>
                  {challenge.name}
                </Text>
                <Text
                  align="left"
                  type="footnote"
                  color="w100"
                  weight="semibold"
                  style={{
                    maxWidth: 250,
                    lineHeight: '130%',
                    fontSize: 13,
                  }}>
                  {coachDetails.name}
                </Text>
                <Text
                  align="left"
                  type="footnote"
                  color="w76"
                  style={{
                    maxWidth: 250,
                    lineHeight: '125%',
                    marginBottom: 4,
                  }}>
                  {coachDetails.professionalTitle}
                </Text>
              </>
            )}
          </div>
          <Text
            type="h3-small"
            weight="semibold"
            align="center"
            color="b100"
            style={{
              lineHeight: '135%',
              marginBottom: '6px',
            }}>
            {referrer &&
              referrer.givenName &&
              t('challenge_referral_header', {
                referrerName: referrer.givenName,
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
            {getSubtitleText()}
          </Text>
          <ReferralSignup
            onSubmit={onSubmit}
            experiments={experiments}
            referralCode={referralCode}
            referralType={referralType}
            referrer={referrer}
            utm_source={utm_source}
            utm_campaign={utm_campaign}
            utm_medium={utm_medium}
            channel={channel}
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
                  '/static/images/verywellAward.png',
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
                {t('challenge_referral_trusted_by')}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default NewChallengeCard;
