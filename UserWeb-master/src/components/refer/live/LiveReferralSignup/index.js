import React from 'react';
import { addMinutes } from 'date-fns';
import Image from 'next/image';
import Text from '@/components/app/Text';

import I18NFormatter from '@/services/I18NFormatter';

import useTranslations from '@/hooks/translations';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import { getCoachProfessionalTitle, getCoachName } from '@/models/coach';
import { getLocaleImage } from '@/models/locale';
import referralConstants from '@/utils/constants/referral';
import BACKGROUND_GRADIENTS from '@/data/backgroundGradient.json';
import ReferralSignup from '../../ReferralSignup';
import styles from './styles';

function LiveReferralSignup({
  referrer,
  onSubmit,
  coachDetails,
  referralCode,
  referralType,
  utm_campaign,
  utm_medium,
  utm_source,
  channel,
  experiments,
}) {
  const { currentLocale, t } = useTranslations();
  const { liveEventDetails } = useShallowEqualSelector(({ live }) => live);
  const liveEnded =
    liveEventDetails?.status === 'ended' && liveEventDetails?.end;

  const {
    previewCardsBackground: { liveEventPreviewBackround = 'night_fade' } = {},
    profileBgRemovedPicture,
  } = coachDetails || {};

  return (
    <div className="content-wrapper">
      <div className="card-bg"></div>
      <div className="signup-card">
        <div className="card-content">
          <div
            className="live-card"
            style={{
              backgroundImage: BACKGROUND_GRADIENTS[liveEventPreviewBackround],
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}>
            <div className="live-badge">
              <Text
                align="left"
                type="body2"
                color="w100"
                weight="semibold"
                style={{
                  fontSize: 13,
                  opacity: '0.8',
                  background:
                    'linear-gradient(278deg, #FF00BE 5.87%, #FF0010 88.53%)',
                  backgroundClip: 'text',
                  '-webkit-text-fill-color': 'transparent',
                }}>
                {t(
                  liveEnded
                    ? 'referral_live_badge_live_replay'
                    : 'referral_live_badge_live'
                )}
              </Text>
            </div>

            <Text
              type="body"
              color="w100"
              weight="semibold"
              style={{
                marginTop: 10,
                marginBottom: 2,
                fontSize: 23,
              }}>
              {liveEventDetails?.title}
            </Text>
            <Text type="body2" color="w76">
              {liveEnded
                ? t('referral_live_recorded_on', {
                    recordingDate: I18NFormatter.formatDate(
                      new Date(liveEventDetails?.end),
                      'MMM dd, h:mmaaa'
                    ),
                  })
                : `${I18NFormatter.formatDate(
                    new Date(liveEventDetails.scheduledAt),
                    'MMM dd, h:mm-'
                  )}${I18NFormatter.formatDate(
                    addMinutes(
                      new Date(liveEventDetails.scheduledAt),
                      liveEventDetails?.duration
                    ),
                    'h:mmaaa'
                  )}`}
            </Text>
            <Image
              src={profileBgRemovedPicture}
              alt="profile"
              height={176}
              width={144}
              style={{
                height: 'auto',
                position: 'absolute',
                bottom: 0,
                right: 0,
                zIndex: '-1',
              }}
            />

            <Text
              align="left"
              type="body2"
              color="w100"
              weight="semibold"
              style={{
                lineHeight: 'normal',
                marginBottom: 2,
                marginTop: 15,
              }}>
              {getCoachName(coachDetails)}
            </Text>
            <Text align="left" type="body2" color="w76">
              {getCoachProfessionalTitle(coachDetails)}
            </Text>
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
            liveEventDetails &&
            referrer.givenName &&
            liveEventDetails.title
              ? t(
                  liveEnded
                    ? 'referral_live_referrer_sent_you_live_recording'
                    : 'referral_live_referrer_sent_you_live',
                  {
                    referrerName: referrer.givenName,
                    liveTitle: liveEventDetails.title,
                  }
                )
              : t(
                  liveEnded
                    ? 'referral_live_aura_sent_you_live_recording'
                    : 'referral_live_aura_sent_you_live',
                  {
                    liveTitle: liveEventDetails.title,
                  }
                )}
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
            {referrer && referrer.givenName
              ? t('referral_live_redeem_your_guest_pass_from', {
                  referrerName: referrer.givenName,
                  count:
                    referralCode === referralConstants.REFER_CODE_AURA_SOCIAL
                      ? 7
                      : 30,
                })
              : t('referral_live_redeem_your_guest_pass', {
                  count:
                    referralCode === referralConstants.REFER_CODE_AURA_SOCIAL
                      ? 7
                      : 30,
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

export default LiveReferralSignup;
