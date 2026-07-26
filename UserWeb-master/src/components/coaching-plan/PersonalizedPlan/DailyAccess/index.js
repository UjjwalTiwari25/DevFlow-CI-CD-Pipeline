import React, { useEffect, useState } from 'react';
import { getCoachPhoto } from '../../../../models/coach';
import Text from '../../../app/Text';
import styles from './styles';
import COACHING_GOALS from '../../../../data/coachingGoals.json';

export default function DailyAccess({ coach, user }) {
  const [preferences, setPreferences] = useState([
    {
      title: 'Manage stress & anxiety',
      image:
        'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/PersonalizationTopics%2Fsmall%2FSleep.png?alt=media&token=6ca3cb81-c189-4fe5-bc34-d4032b7000ee',
    },
    {
      title: 'Improve my relationships',
      image:
        'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/PersonalizationTopics%2Fsmall%2FAnxiety.png?alt=media&token=d2cba28d-59a2-4aa2-b291-126ea095956f',
    },
  ]);
  useEffect(() => {
    if (user && user.coachingMotivationPreference) {
      const { coachingMotivationPreference = {} } = user;

      const preferencesArray = Object.keys(coachingMotivationPreference)
        .slice(0, 2)
        .map((item) => {
          if (COACHING_GOALS[item]?.unique === item) {
            return COACHING_GOALS[item];
          }
          return {
            title: 'Manage stress & anxiety',
            image:
              'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/PersonalizationTopics%2Fsmall%2FSleep.png?alt=media&token=6ca3cb81-c189-4fe5-bc34-d4032b7000ee',
          };
        });
      setPreferences(preferencesArray);
    }
  }, [user]);
  return (
    <div className={`main`}>
      <Text type="h4" weight="normal" color="b100">
        1. Daily access to 1-1 personal coaching
      </Text>
      <div className="topics-container">
        {preferences &&
          preferences.map((item, index) =>
            item ? (
              <div className="container" key={index}>
                <div
                  className="blur-background"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div
                  className="single-topic"
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}>
                  <Text
                    type="body"
                    color="w100"
                    align="center"
                    weight="semibold"
                    style={{ maxWidth: 115 }}>
                    {item.title}
                  </Text>
                </div>
              </div>
            ) : null
          )}
      </div>
      <div className="wrapper">
        <div className="coach-container">
          <img
            src={coach && getCoachPhoto(coach, 'photo100Url')}
            alt="coach-image"
            className="coach-image"
          />
          <div className="talk-bubble tri-right left-top">
            <div className="talktext">
              <Text type="body2" color="b100" align="left">
                How are you doing with your goals this week?
              </Text>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
