import React from 'react';
import Image from 'next/image';
import Text from '@/components/app/Text';
import {
  getMeditationDisplayDuration,
  getTrackTitle,
  trackTypeDisplayStringFromId,
} from '@/models/meditation';
import { getContentTypeMinimalIcon } from '@/models/contentTypes';
import { getLocaleImage } from '@/models/locale';

import useTranslations from '@/hooks/translations';
import {
  getCoachPhoto,
  getCoachProfessionalTitle,
  getCoachName,
} from '@/models/coach';
import referralConstants from '@/utils/constants/referral';
import ReferralSignup from '../../ReferralSignup';
import styles from './styles';

function TrackReferralSignup({
  referrer,
  track,
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

  return (
    <div className="content-wrapper">
      <div className="card-bg"></div>
      <div className="signup-card">
        <div className="card-content">
          <div
            className="track-card"
            style={{
              background: `url("${track.photoUrl}")`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}>
            <div className="track-info-wrapper">
              <div className="type-wrapper">
                <Image
                  src={getContentTypeMinimalIcon(track.trackType)}
                  alt=""
                  height={14}
                  width={14}
                />
                <Text
                  align="center"
                  type="body"
                  color="w100"
                  weight="semibold"
                  style={{
                    lineHeight: 'normal',
                    fontSize: 15,
                  }}>
                  {trackTypeDisplayStringFromId(track.trackType)}
                </Text>
              </div>
              <Text
                align="center"
                type="h3"
                color="w100"
                weight="bold"
                style={{
                  lineHeight: '110%',
                  marginBottom: 10,
                }}>
                {getTrackTitle(track)}
              </Text>
              <Text
                align="center"
                type="body2"
                color="w70"
                style={{
                  marginBottom: 10,
                }}>
                {t('referral_track_duration', {
                  duration: getMeditationDisplayDuration(track.duration),
                })}
              </Text>
            </div>
            <div className="coach-info-wrapper">
              <Image
                src={getCoachPhoto(coachDetails)}
                alt="profile"
                height={36}
                width={36}
                style={{ borderRadius: '36px' }}
              />
              <div className="col">
                <Text
                  align="left"
                  type="body"
                  color="w100"
                  weight="semibold"
                  style={{
                    lineHeight: 'normal',
                    fontSize: 15,
                    marginBottom: 2,
                  }}>
                  {getCoachName(coachDetails)}
                </Text>
                <Text align="left" type="body2" color="w76">
                  {getCoachProfessionalTitle(coachDetails)}
                </Text>
              </div>
            </div>
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
            {referrer && track && referrer.givenName && track.title
              ? t('referral_track_referrer_sent_you_track', {
                  referrerName: referrer.givenName,
                  trackTitle: track.title,
                })
              : t('referral_track_aura_sent_you_track', {
                  trackTitle: track.title,
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
            {referrer && referrer.givenName
              ? t('referral_track_redeem_your_guest_pass_from', {
                  referrerName: referrer.givenName,
                  count:
                    referralCode === referralConstants.REFER_CODE_AURA_SOCIAL
                      ? 7
                      : 30,
                })
              : t('referral_track_redeem_your_guest_pass', {
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

export default TrackReferralSignup;
