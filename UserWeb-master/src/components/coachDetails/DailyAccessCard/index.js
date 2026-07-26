import React from 'react';
import { useDispatch } from 'react-redux';
import { getAvailableCoachingSpots } from '../../../models/coach';
import { handleBookCoachingCTA } from '../../../store/slices/coaching';
import Text from '../../app/Text';
import CoachCustomRecommendations from '../dailyAccessScreens/CustomRecommendations';
import Journal from '../dailyAccessScreens/Journal';
import OneOnOne from '../dailyAccessScreens/OneOnOne';
import TrackYourSelf from '../dailyAccessScreens/TrackYourSelf';
import JoinWaitListButton from '../JoinWaitListButton';
import styles from './styles';

function DailyAccessCard({ row, index, coach }) {
  const { title, description } = row;
  const dispatch = useDispatch();
  return (
    <div className="daily-access row align-center">
      <div className="col daily-access-info">
        <Text
          type="h4-large"
          weight="semibold"
          color="b100"
          style={{ marginBottom: 18 }}>
          {title}
        </Text>
        <Text
          type="body"
          weight="regular"
          style={{ color: '#4e545f', whiteSpace: 'pre-line' }}>
          {description}
        </Text>
        {getAvailableCoachingSpots(coach) > 0 ? (
          <div
            className="row booking-coach align-center clickable"
            onClick={() => dispatch(handleBookCoachingCTA(coach))}>
            <Text type="body" color="b100" weight="semibold">
              Book 1-on-1 coaching
            </Text>
            <div className="spots-container">
              <div className="spots row align-center">
                <Text type="footnote" weight="semibold" color="w100">
                  {getAvailableCoachingSpots(coach)} spots left
                </Text>
              </div>
              <div className="shadow" />
            </div>
          </div>
        ) : (
          <JoinWaitListButton coach={coach} />
        )}
      </div>
      {index === 0 && <OneOnOne coach={coach} />}
      {index === 1 && <CoachCustomRecommendations coach={coach} />}
      {index === 2 && <TrackYourSelf coach={coach} />}
      {index === 3 && <Journal coach={coach} />}
      <style jsx>{styles}</style>
    </div>
  );
}

export default DailyAccessCard;
