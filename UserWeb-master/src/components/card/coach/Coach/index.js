import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Text from '../../../app/Text';
import routeConstants from '../../../../utils/constants/routes';
import { getCoachPhoto } from '../../../../models/coach';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';
import styles from './styles';
import useCountryDetails from '../../../../hooks/countryDetails';

export default function Coach({ coach, style }) {
  const { name, countryCode, professionalTitle, slug } = coach;
  const [, isMobile] = useResponsiveWindow();
  const { countryDetails } = useCountryDetails(countryCode);
  if (!coach || !coach.name || coach.name === '') {
    return null;
  }

  return (
    <div className="wrapper" data-testid="coachCard">
      <Image
        src={`${getCoachPhoto(coach, 'photo50Url')}`}
        alt="background"
        width={28}
        height={22}
        style={{
          position: 'absolute',
          top: '0px',
          filter: 'blur(10px)',
          borderRadius: '40px',
          zIndex: '-2',
          height: '93%',
          width: '96%',
          left: '47%',
          transform: 'translate(-50%, 0)',
        }}
      />
      <div className="root" style={style}>
        <Link href={`/${routeConstants.PAGE_COACHES}/${slug}`} legacyBehavior>
          <a
            className={`coach-item-container clickable`}
            style={{
              backgroundImage: `linear-gradient(transparent, #0008),
            url(${getCoachPhoto(coach, 'photo400Url')})`,
            }}>
            {isMobile && countryDetails && countryDetails.imageUrl && (
              <div className="row">
                <Image
                  src={countryDetails.imageUrl}
                  alt={countryDetails.displayName}
                  style={{
                    marginRight: '8px',
                    marginBottom: '8px',
                  }}
                  width={28}
                  height={22}
                />
              </div>
            )}
            <Text
              type={isMobile ? 'body2' : 'cta'}
              color="w100"
              weight="bold"
              align="middle"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textAlign: 'center',
              }}>
              {name || ''}
            </Text>
            <Text
              type={isMobile ? 'footnote' : 'body'}
              color={isMobile ? 'w64' : 'w100'}
              weight="regular"
              align="middle"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                marginBottom: !isMobile && 8,
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textAlign: 'center',
              }}>
              {professionalTitle || 'Mindfulness Expert'}
            </Text>
            {!isMobile && countryDetails && (
              <div className="row">
                <Image
                  src={countryDetails.imageUrl}
                  alt={countryDetails.displayName}
                  style={{
                    marginRight: '8px',
                  }}
                  width={28}
                  height={22}
                />
                <Text
                  type="body"
                  color="w100"
                  weight="medium"
                  style={{
                    maxWidth: 188,
                  }}>
                  {countryDetails.displayName}
                </Text>
              </div>
            )}
          </a>
        </Link>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
