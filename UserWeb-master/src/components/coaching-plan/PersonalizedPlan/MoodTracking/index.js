import React from 'react';
import { getCoachName, getCoachPhoto } from '../../../../models/coach';
import Text from '../../../app/Text';
import styles from './styles';

export default function MoodTracking({ coach }) {
  return (
    <div className={`container`}>
      <Text type="h4" weight="normal" color="b100">
        3. Beautiful mindfulness, sleep, and mood tracking with automated
        insights
      </Text>
      <div className="mood-tracking">
        <img
          src="/static/images/coachplan/mood-tracking.png"
          alt="moodtracking"
          className="mood-graph"
        />
        <div className="mood-text">
          <Text type="h4" color="b100" style={{ lineHeight: '21px' }}>
            Close your daily rings, view weekly insights, and build streaks with
            calendar view
          </Text>
        </div>
      </div>
      <Text type="body2" color="g100">
        You can discuss this data with {coach && getCoachName(coach)} on a daily
        basis. Get motivated, adjust your goals, discuss your ups and downs.
      </Text>
      <div className="chart-container">
        <img
          src="/static/images/coachplan/mood-chart.png"
          alt="chart"
          width={177}
        />
        <div className="coach-container">
          <img
            src={coach && getCoachPhoto(coach, 'photo100Url')}
            alt="coach-image"
            className="coach-image"
          />
          <div className="talk-bubble tri-right left-top">
            <div className="talktext">
              <Text type="body2" color="b100" align="left">
                Wow! You started off the week really strong. What...
              </Text>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}
