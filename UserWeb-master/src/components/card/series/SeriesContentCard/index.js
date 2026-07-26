import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles';
import Text from '../../../app/Text';
import { getCoachPhoto } from '../../../../models/coach';
import usePageQuery from '../../../../hooks/pageQuery';
import { generateQueryPath } from '../../../../utils';
import routeConstants from '../../../../utils/constants/routes';

export default function SeriesContentCard({ series, isClickable, coach }) {
  const {
    utm_source = null,
    userId = null,
    utm_campaign = null,
  } = usePageQuery();
  const { cardImage, name, data, id } = series;
  const Component = isClickable ? Link : 'span';
  return (
    <div className="wrapper-is-fixed">
      <div
        className="blur-background-fixed"
        style={{
          backgroundImage: `url("${cardImage}")`,
        }}></div>

      <div
        className="root-is-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
          url("${cardImage}")`,
        }}>
        <Component
          href={generateQueryPath(
            `${routeConstants.PAGE_COACHES}/${coach.slug}/${routeConstants.PAGE_SERIES}/${id}`,
            {
              utm_source,
              utm_campaign,
              userId,
            }
          )}
          className={`item-container ${isClickable && 'clickable'}`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
        url("${cardImage}")`,
          }}>
          <Text
            style={{ marginTop: 12 }}
            type="footnote"
            color="w100"
            weight="regular"
            align="center">
            {'Series'}
          </Text>
          <Text
            type="cta"
            color="w100"
            weight="bold"
            align="center"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              marginBottom: 8,
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
            {name || ''}
          </Text>
          <Text type="footnote" color="w100" align="center">
            {data && data.contents?.length} days
          </Text>
          <div className="coach-container">
            {coach && !!getCoachPhoto(coach, 'photo100Url') && (
              <span className="coach-thumbnail">
                <Image
                  src={getCoachPhoto(coach, 'photo100Url')}
                  alt="coach photo"
                  fill
                />
              </span>
            )}
            <div className="coach-information">
              {coach && (
                <Text type="body2" align="left" weight="bold" color="w100">
                  {coach.name || 'Aura'}
                </Text>
              )}
              {coach && (
                <div className="professional-title">
                  <Text
                    type="footnote"
                    align="left"
                    weight="regular"
                    color="w100"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                    {coach.professionalTitle}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </Component>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
