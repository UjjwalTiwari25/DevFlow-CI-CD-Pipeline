import React from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import Text from '@/components/app/Text';
import ReferralLandingPage from '@/components/refer/ReferralLandingPage';
import PlaylistReferralSignup from '@/components/refer/playlist/PlaylistReferralSignup';
import { getLocaleImage } from '@/models/locale';
import useTranslations from '@/hooks/translations';
import { updateProfile } from '@/store/onboard/actions';
import styles from './styles.module.scss';

function PlaylistReferralPage({
  experiments,
  isLoadingExperiments,
  isInfluencerReferral,
  referralCode,
  referralType,
  utm_campaign,
  utm_medium,
  utm_source,
  channel,
  referrer,
  playlist,
  playlistOwnerId,
}) {
  const dispatch = useDispatch();
  const { currentLocale, t } = useTranslations();

  const updateProfileOnboardingData = ({ givenName }) => {
    dispatch(updateProfile({ givenName }));
  };
  return (
    <>
      <ReferralLandingPage
        experiments={experiments}
        isLoadingExperiments={isLoadingExperiments}>
        <div className={styles.pageContent}>
          <PlaylistReferralSignup
            isInfluencerReferral={isInfluencerReferral}
            referrer={referrer}
            onSubmit={updateProfileOnboardingData}
            referralCode={referralCode}
            referralType={referralType}
            utm_source={utm_source}
            utm_campaign={utm_campaign}
            utm_medium={utm_medium}
            channel={channel}
            experiments={experiments}
            playlist={playlist}
            playlistOwnerId={playlistOwnerId}
          />

          {isInfluencerReferral && (
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
                  src="/static/images/referNew/5stars-blue.svg"
                  height={21}
                  width={120}
                />
                <Text type="footnote" color="b100" style={{ fontSize: '12px' }}>
                  {t('text_trusted_by_eight_million_people')}
                </Text>
              </div>
            </div>
          )}
        </div>
      </ReferralLandingPage>
    </>
  );
}

export default PlaylistReferralPage;
