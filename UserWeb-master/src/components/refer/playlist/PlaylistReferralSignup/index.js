import React from 'react';
import { Trans } from 'react-i18next';
import Image from 'next/image';
import classNames from 'classnames';
import { Icon } from '@aurahealth/web-design-system';
import useTranslations from '@/hooks/translations';
import Text from '@/components/app/Text';
import { getLocaleImage } from '@/models/locale';

import styles from './styles.module.scss';
import ReferralSignup from '../../ReferralSignup';

function PlaylistReferralSignup({
  isInfluencerReferral,
  referrer,
  onSubmit,
  referralCode,
  referralType,
  utm_campaign,
  utm_medium,
  utm_source,
  channel,
  experiments,
  playlist,
  playlistOwnerId,
}) {
  const { currentLocale, t } = useTranslations();
  const { tracks } = playlist || {};

  function getReferralTitle() {
    if (!referrer || !referrer.givenName) return '';

    if (isInfluencerReferral) {
      return t('playlist_influencer_name_invited_you_to_join_aura', {
        influencerName: referrer.givenName,
      });
    }

    return t('referral_playlist_referrer_sent_you_title', {
      referrerName: referrer.givenName,
      playlistName: playlist.name,
    });
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.cardBg}></div>
      <div
        className={classNames(styles.signupCard, {
          [styles.influencerBackground]: isInfluencerReferral,
        })}>
        <div className={styles.cardContent}>
          {isInfluencerReferral ? (
            <>
              <div className={styles.influencerCardHeader}>
                <div>
                  <div className={styles.influencerCardTitle}>
                    {playlist?.name}
                  </div>
                  <div className={styles.influencerCardSubtitle}>
                    {t('playlist_influencer_by', {
                      influencerName: referrer?.givenName,
                    })}
                  </div>
                </div>
                <div>
                  <img
                    src={referrer?.picture}
                    alt="influencer-photo"
                    className={styles.influencerImage}
                  />
                </div>
              </div>
              <img
                className={styles.influencerCard}
                src="/static/images/referNew/influencerGradientCard.png"
                alt="Influencer card"
              />
            </>
          ) : (
            <div
              className={classNames('dark-theme', styles.cardWrapper)}
              style={{
                background: `url(${tracks[0]?.photoUrl}) lightgray 50% / cover no-repeat`,
              }}>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardContentWrapper}>
                <div className={styles.cardLeftContent}>
                  <div className={styles.playListBadge}>
                    <Icon
                      name={Icon.LIST.ProfilePlaylists}
                      size={Icon.SIZES.extra}
                    />
                    <div>{t('badge_text_playlist')}</div>
                  </div>
                  <div className={styles.playListName}>{playlist.name}</div>
                </div>
                <div
                  className={
                    tracks.length >= 4
                      ? styles.imageCollage
                      : styles.singleImage
                  }>
                  {tracks
                    .slice(0, tracks.length >= 4 ? 4 : 1)
                    .map((track) =>
                      track?.photoUrl ? (
                        <img
                          src={track?.photoUrl}
                          alt={track?.title}
                          key={track?.id}
                          className={styles.trackImage}
                        />
                      ) : null
                    )}
                </div>
              </div>
            </div>
          )}
          <div className={styles.referralTitle}>{getReferralTitle()}</div>
          <div className={styles.referralSubtitle}>
            {isInfluencerReferral ? (
              <Trans
                i18nKey={
                  'playlist_influencer_limited_time_discount_code_applied'
                }
                components={[
                  <span
                    key="discount-code"
                    className={styles.discountCode}></span>,
                ]}
                values={{
                  influencerCode: referrer?.givenName
                    ?.trim()
                    .split(/\s+/)[0]
                    .toLowerCase(),
                }}
              />
            ) : (
              t('referral_playlist_redeem_access_to_aura', {
                count: 30,
              })
            )}
          </div>
          <ReferralSignup
            onSubmit={onSubmit}
            isInfluencerReferral={isInfluencerReferral}
            referralCode={referralCode}
            referralType={referralType}
            referrer={referrer}
            utm_source={utm_source}
            utm_campaign={utm_campaign}
            utm_medium={utm_medium}
            channel={channel}
            experiments={experiments}
            playlist={playlist}
            playlistOwnerId={playlistOwnerId}
          />

          {!isInfluencerReferral && (
            <div className={styles.socialProofWrapper}>
              <div className={styles.socialProofIcons}>
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
              <div className={styles.starRating}>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaylistReferralSignup;
