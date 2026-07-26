import React from 'react';
import Image from 'next/image';
import { getCountDisplayValue } from '../../../../utils';
import contentConstants from '../../../../utils/constants/content';
import routeConstants from '../../../../utils/constants/routes';
import ClippedText from '../../../app/ClippedText';
import Text from '../../../app/Text';
import CustomChannels from '../../../content/CustomChannels';
import CustomTracks from '../../../content/CustomTracks';
import styles from './styles';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';
import useTrackPageView from '../../../../hooks/trackPageView';
import useCountryDetails from '../../../../hooks/countryDetails';

export default function CoachesSlug({ coach, tracks, channels }) {
  const {
    id,
    profilePictureThumbs = {},
    name,
    bio,
    slug,
    countryCode,
    followersCount = 0,
    listenedCount = 0,
    playedCount = 0,
    profilePicture,
  } = coach;
  useTrackPageView({ CoachID: id, 'Coach Name': name }, [coach]);
  const [, isMobile] = useResponsiveWindow();
  const { countryDetails } = useCountryDetails(countryCode);

  const maxPlays = Math.max(listenedCount, playedCount);
  return (
    <div>
      <div className="outer-wrap content-padding">
        <div className="coach-image">
          <img
            src={profilePictureThumbs.photoUrl || profilePicture}
            style={{ objectFit: 'cover' }}
            alt="coach image"
            width={230}
            height={230}
          />
        </div>
        <div className="coach-cover ">
          {countryDetails && !!countryDetails.imageUrl && (
            <div className="row margin-b-6">
              <Image
                src={countryDetails.imageUrl}
                alt={countryDetails.displayName}
                width={32}
                height={26}
                style={{ marginRight: '8px' }}
              />
              <Text
                type="body"
                color="b100"
                weight="regular"
                style={{
                  maxWidth: 188,
                }}>
                {countryDetails.displayName}
              </Text>
            </div>
          )}
          <div className="margin-b-6">
            <Text
              type={isMobile ? 'h3-large' : 'h2'}
              component="h1"
              color="b100">
              {name}
            </Text>
          </div>
          <div
            className="row align-center"
            style={{
              marginBottom: '34px',
            }}>
            {followersCount > 0 && (
              <Text type="body" color="b100">
                {`${getCountDisplayValue(followersCount)} followers`}
                &nbsp;|&nbsp;
              </Text>
            )}
            {maxPlays > 0 && (
              <Text type="body" color="b100">{`${getCountDisplayValue(
                maxPlays
              )} plays`}</Text>
            )}
          </div>
          <ClippedText
            type="body2"
            color="b64"
            style={{
              width: '95%',
            }}>
            {bio}
          </ClippedText>
        </div>
      </div>
      <div className="coach-content track-width">
        <div>
          <CustomTracks
            data={tracks}
            label={'Popular Tracks'}
            viewAllLink={`/${routeConstants.PAGE_COACHES}/${slug}/${contentConstants.CONTENT_UI_TYPES.TRACKS}`}
          />
        </div>
        <div style={{ marginTop: '40px' }}>
          <CustomChannels
            data={channels}
            label={`Channels by ${name}`}
            viewAllLink={`/${routeConstants.PAGE_COACHES}/${slug}/${contentConstants.CONTENT_UI_TYPES.CHANNELS}`}
          />
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}
