import React from 'react';
import { getCoachName, getCoachPhoto } from '../../../../models/coach';
import Text from '../../../app/Text';
import styles from './styles';

export default function CustomRecommendations({ coach }) {
  return (
    <div className={`container`}>
      <Text type="h4" weight="normal" color="b100">
        2. Custom recommendations from your coach
      </Text>
      <Text type="body2" weight="normal" color="g50" style={{ marginTop: 10 }}>
        Recommended from {coach && getCoachName(coach)}
      </Text>
      <div className="track-container">
        <div className="position">
          <img
            src="/static/images/coachplan/track-background.webp"
            className="track-shadow"
            alt="aura"
          />
          <div className="root">
            <div
              className="blur-image"
              style={{
                backgroundImage: `url("/static/images/coachplan/track-background.webp")`,
              }}
            />
            <div
              className={`item-container`}
              style={{
                backgroundImage: `
          url("/static/images/coachplan/track-background.webp")`,
              }}>
              <div className="track-type">
                <Text type="footnote" color="w64" weight="regular">
                  Story
                </Text>
              </div>
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
                Find Peace
              </Text>
              <div className="row align-center">
                <Text type="footnote" color="w100">
                  3 or 7 min
                </Text>
              </div>
              <div className="coach-container">
                {coach && (
                  <img
                    src={getCoachPhoto(coach, 'photo100Url')}
                    alt="coach photo"
                    className="coach-thumbnail"
                  />
                )}
                <div className="coach-information">
                  {coach && (
                    <Text type="body2" align="left" weight="bold" color="w100">
                      {getCoachName(coach)}
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
            </div>
          </div>
        </div>
        <div className="root shadow">
          <div className={`article-container`}>
            <img
              src="/static/images/coachplan/medium.png"
              alt="medium"
              className="medium"
            />
            <img
              src="/static/images/coachplan/medium-image.webp"
              alt="medium"
              className="medium-image"
            />
            <Text type="footnote" color="b100" style={{ fontSize: 11 }}>
              Five Signs of a Highly Intelligent Person
            </Text>
            <Text type="footnote" color="b40" style={{ marginTop: 2 }}>
              5 min
            </Text>
          </div>
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}
