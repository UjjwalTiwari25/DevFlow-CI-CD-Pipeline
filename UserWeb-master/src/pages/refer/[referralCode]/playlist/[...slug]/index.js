import React from 'react';
import Head from 'next/head';
import { wrapper } from '@/store';
import usePageQuery from '@/hooks/pageQuery';
import useTrackPageView from '@/hooks/trackPageView';
import I18N from '@/services/I18N';
import referralConstants from '@/utils/constants/referral';
import useExperiments from '@/hooks/experiments';
import NewLandingPageStyle from '@/components/newLandingPageContent/NewLandingPageStyle';
import Loader from '@/components/app/Loader';
import PlaylistReferralPage from '@/components/page/refer/playlist/[playlistId]';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import { getUser, getUserPlaylist } from '@/models/user';
import { getReferralDetails } from '@/hooks/referral';
import useReferralAuthListener from '@/hooks/useReferralAuthListener';
import { getCoach } from '@/models/coach';
import { generateExternalUrlQueryPath } from '@/utils';
import { listMeditations } from '@/models/meditation';
import BaseLayout from '../../../../../layouts/BaseLayout';

const EXPERIMENTS = ['removeNameReferralSignup'];

function PlaylistReferral({
  coach,
  isInfluencerReferral,
  referral,
  playlist,
  playlistId,
  playlistOwnerUser,
}) {
  const { referrer } = referral;
  const [experiments] = useExperiments(EXPERIMENTS, null);
  const isExperimentsAssigned =
    !EXPERIMENTS.length || !!Object.values(experiments).length;
  const pageQuery = usePageQuery();

  const playlistOwnerId = playlistOwnerUser?.id;

  const {
    utm_campaign = referralConstants.SOURCE_PLAYLIST_REFERRAL,
    utm_source = isInfluencerReferral
      ? referralConstants.SOURCE_INFLUENCER
      : referralConstants.SOURCE_PLAYLIST_REFERRAL,
    utm_medium = null,
    referralType = referrer.referralType,
    referralCode = null,
    channel = null,
  } = pageQuery;

  const onAuthChange = useReferralAuthListener({
    experiments,
    playlistId,
    playlistOwnerId,
    playlistName: playlist?.name,
    referralType,
    referralCode,
    referrer,
    type: isInfluencerReferral
      ? referralConstants.SOURCE_INFLUENCER_REFERRAL
      : referralConstants.SOURCE_PLAYLIST_REFERRAL,
    utm_campaign,
    utm_source,
    utm_medium,
  });

  useTrackPageView(
    {
      'Coach ID': coach?.id,
      'Coach Name': coach?.name,
      ReferralCode: referralCode,
      ReferralType: referralType,
      Medium: utm_medium,
      Channel: channel,
      PlaylistId: playlistId,
      'Playlist Name': playlist?.name,
      Source: utm_source,
      ReferrerId: referrer?.id,
    },
    [referralCode, playlistId]
  );

  return (
    <BaseLayout
      hideFooterBackground
      hideBackgroundImages
      useAuth
      allowSignup
      onAuthChange={onAuthChange}>
      <Head>
        <title>
          {`Check out ${playlist?.name} playlist by ${playlistOwnerUser?.givenName} on Aura`}
        </title>
        <meta
          name="description"
          content={`Join Aura now and claim your 30-Day Guest Pass`}
        />
        <meta
          property="og:title"
          content={`Check out ${playlist?.name} playlist by ${playlistOwnerUser?.givenName} on Aura`}
        />
        <meta
          property="og:description"
          content={`Join Aura now and claim your 30-Day Guest Pass`}
        />
        {!!playlist?.tracks && !!playlist?.tracks.length && (
          <meta
            property="og:image"
            content={`${playlist?.tracks[0]?.photoUrl}`}
            itemProp="image"
          />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <NewLandingPageStyle />
      {!isExperimentsAssigned ? (
        <Loader />
      ) : (
        playlist && (
          <PlaylistReferralPage
            isInfluencerReferral={isInfluencerReferral}
            referralCode={referralCode}
            referralType={referralType}
            utm_source={utm_source}
            utm_campaign={utm_campaign}
            utm_medium={utm_medium}
            channel={channel}
            experiments={experiments}
            loading={!isExperimentsAssigned}
            playlistId={playlistId}
            playlistOwnerId={playlistOwnerId}
            referrer={referrer}
            playlist={playlist}
          />
        )
      )}
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, locale, query }) => {
      const { referralCode, slug } = params;
      const {
        utm_campaign = referralConstants.SOURCE_PLAYLIST_REFERRAL,
        referralType,
        ...utmParams
      } = query;

      let playlistUserId;
      let playlistId;
      let isInfluencerReferral = false;
      if (slug.length > 1) {
        [playlistUserId, playlistId] = slug;
      } else {
        [playlistId] = slug;
      }
      store.dispatch(setAppLocale(getISOLocale(locale)));
      const referral = await getReferralDetails({
        referralCode,
        getReferralType: async (referrer) => {
          if (!referrer) {
            return referralConstants.TYPE_USER_SUBSCRIPTION_30TRIAL;
          }
          const coach = await getCoach(referrer.id);
          if (coach) {
            return referralConstants.COACH_SUBSCRIPTION_30TRIAL;
          }
          const user = await getUser(referrer.id);
          if (user?.role === 'influencer' && referrer.id === playlistUserId) {
            isInfluencerReferral = true;
            return referralConstants.TYPE_INFLUENCER_SUBSCRIPTION_25OFF_7TRIAL;
          }
          return referralConstants.TYPE_USER_SUBSCRIPTION_30TRIAL;
        },
      });
      const { referrer } = referral;

      const coach = await getCoach(referrer?.id);
      const playlist = await getUserPlaylist(
        playlistUserId || referrer?.id,
        playlistId
      );
      if (!referrer || !playlist) {
        return { notFound: true };
      }

      if (playlist?.tracks) {
        const trackKeys = Object.keys(playlist?.tracks);
        const tracksToFetch = trackKeys.length < 4 ? 1 : 4;
        const playlistTracks = await listMeditations(
          trackKeys.slice(0, tracksToFetch)
        );
        playlist.tracks = playlistTracks;
      }

      const playlistOwnerUser = await getUser(playlist.owner);

      if (isInfluencerReferral) {
        const utmQuery = {
          utm_campaign,
          utm_source: referralConstants.SOURCE_INFLUENCER,
          referralCode,
          referralType: referralType || referrer.referralType,
          playlistId,
          playlistName: playlist.name,
          playlistOwnerId: playlist.owner,
          referrerPhoto: referrer?.picture,
          referrerName: referrer?.givenName,
          ...utmParams,
        };
        const path = generateExternalUrlQueryPath(
          'https://www.aurahealth.io/offer-influencer',
          utmQuery
        );
        if (path) {
          return {
            redirect: {
              destination: path,
              permanent: false,
            },
          };
        }
      }

      return {
        props: {
          coach,
          isInfluencerReferral,
          playlist,
          playlistId,
          playlistOwnerUser,
          referral,
          ...(await I18N.loadLocale({
            locale,
            route: '/refer/[referralCode]/playlist/[...slug]',
          })),
        },
      };
    }
);

export default PlaylistReferral;
