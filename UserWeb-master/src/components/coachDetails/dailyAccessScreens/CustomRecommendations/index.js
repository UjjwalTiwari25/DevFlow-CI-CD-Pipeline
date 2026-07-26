import React from 'react';
import { getCoachName, getCoachPhoto } from '../../../../models/coach';
import Text from '../../../app/Text';
import styles from './styles';

function CoachCustomRecommendations({ coach }) {
  return (
    <div className="chat">
      <img
        src="/static/images/newCoach/daily-access-mobile.webp"
        alt="aura"
        className="mobile"
      />
      <img
        src="/static/images/newCoach/daily-access-mobile-background.png"
        alt="aura"
        className="mobile-background"
      />
      <div className="detail-container">
        <div className="coach-right row">
          <img
            src={getCoachPhoto(coach)}
            alt={getCoachName(coach)}
            className="coach-icon"
          />
          <div className="chat-box-white">
            <Text color="b100" type="footnote-small">
              I’m going to share Aura Tracks, articles, videos, podcasts and
              more for your goals.
            </Text>
            <Text color="b100" type="footnote-small" style={{ marginTop: 14 }}>
              Try these this week!
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
                      <Text
                        color="w100"
                        weight="regular"
                        style={{ fontSize: 8 }}>
                        Story
                      </Text>
                    </div>
                    <Text
                      type="footnote"
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
                      <Text style={{ fontSize: 8 }} color="w100">
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
                          <Text
                            type="footnote-small"
                            align="left"
                            weight="bold"
                            color="w100">
                            {getCoachName(coach)}
                          </Text>
                        )}
                        {coach && (
                          <div className="professional-title">
                            <Text
                              align="left"
                              weight="regular"
                              color="w100"
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                fontSize: 8,
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
                  <Text type="footnote-small" color="b100">
                    Five Signs of a Highly Intelligent Person
                  </Text>
                  <Text
                    type="footnote-small"
                    color="b40"
                    style={{ marginTop: 2 }}>
                    5 min
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default CoachCustomRecommendations;
