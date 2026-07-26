import classNames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import usePageQuery from '../../../hooks/pageQuery';
import { getLowestPricing, getPricingDetail } from '../../../models/service';
import { handleBookCoachingSessionCTA } from '../../../store/slices/coaching';
import { setScrollPosition } from '../../../store/slices/newCoachProfiles';
import schedulingConstants from '../../../utils/constants/scheduling';
import AuraButton from '../../app/AuraButton';
import Text from '../../app/Text';
import styles from './styles';

const {
  SESSION_TYPES: { FREE_SERVICE_INDIVIDUAL },
} = schedulingConstants;

function CoachingSessions({ session, horizontalOnly, coach, scrollPosition }) {
  const query = usePageQuery();
  const dispatch = useDispatch();
  return (
    <div
      className={classNames({
        'info-container': !horizontalOnly,
        'info-container-horizontal': horizontalOnly,
      })}
      onClick={() => {
        if (scrollPosition) {
          dispatch(setScrollPosition(scrollPosition));
        }
        dispatch(handleBookCoachingSessionCTA({ session, coach, query }));
      }}>
      <Text
        type="h4-large"
        weight="regular"
        color="b100"
        style={{ lineHeight: '24px', marginBottom: 12 }}>
        {session.title}
      </Text>
      <Text
        type="body2"
        weight="regular"
        color="b64"
        style={{
          maxWidth: 276,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          height: 30,
        }}>
        {session.description}
      </Text>
      <div className="row align-center icon-list">
        <img
          src="/static/images/newCoach/clock.png"
          alt="aura"
          className="icon"
        />
        <Text type="body" color="b100">
          {session.pricing
            ? getPricingDetail(session.pricing, 'duration')
            : 'Not Specified'}
        </Text>
      </div>
      <div className="row align-center">
        <img
          src="/static/images/newCoach/price.png"
          alt="aura"
          className="icon"
        />
        <Text type="body" color="b100">
          {session.sessionTypeId === FREE_SERVICE_INDIVIDUAL && 'Free'}{' '}
          {session.sessionTypeId !== FREE_SERVICE_INDIVIDUAL &&
            session.pricing &&
            `From $${getLowestPricing(session.pricing, 'price') / 100}`}
        </Text>
      </div>
      <AuraButton
        cleanStyle
        withShadow
        textWeight="bold"
        title="See availability"
        style={{
          width: '100%',
          marginTop: 20,
          boxShadow: 'rgb(4 210 244 / 62%) 0px 9px 35px -12px',
        }}
      />
      <style jsx>{styles}</style>
    </div>
  );
}

export default CoachingSessions;
