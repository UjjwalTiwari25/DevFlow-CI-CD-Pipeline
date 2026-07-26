import React from 'react';
import Text from '../../../app/Text';
import styles from './styles';
import useCoachDetails from '../../../../hooks/coachDetails';
import { getCoachPhoto } from '../../../../models/coach';
import useThemeListener from '../../../../hooks/themeListener';

export default function SeriesContentCard({
  series,
  style,
  isClickable = true,
}) {
  const { name, data, detailsImage } = series;
  const { coachDetails } = useCoachDetails(series.coachId);
  const { isDark } = useThemeListener();
  const fontColor = isDark ? 'b100' : 'w100';
  return (
    <div className="wrapper">
      <div className="root" style={style}>
        <span>
          <a
            className={`item-container ${isClickable && 'clickable'}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
          url("${detailsImage}")`,
            }}>
            <div className="track-type row">
              <img
                src="/static/images/icons/seriesIcon.png"
                alt="series icon"
                className="icon"
              />
              <Text
                type="footnote"
                color={isDark ? 'b64' : 'w64'}
                weight="regular">
                Series
              </Text>
            </div>
            <Text
              type="cta"
              color={fontColor}
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
            <div className="row align-center">
              <Text type="footnote" color={fontColor}>
                {data.contents.length} days
              </Text>
            </div>
            <div className="coach-container">
              {coachDetails && (
                <img
                  src={getCoachPhoto(coachDetails, 'photo100Url')}
                  alt="coach photo"
                  className="coach-thumbnail"
                />
              )}
              <div className="coach-information">
                {coachDetails && (
                  <Text
                    type="body2"
                    align="left"
                    weight="bold"
                    color={fontColor}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                    {coachDetails.name || 'Aura'}
                  </Text>
                )}
                {coachDetails && (
                  <div className="professional-title">
                    <Text
                      type="footnote"
                      align="left"
                      weight="regular"
                      color={fontColor}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                      {coachDetails.professionalTitle}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </a>
        </span>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
