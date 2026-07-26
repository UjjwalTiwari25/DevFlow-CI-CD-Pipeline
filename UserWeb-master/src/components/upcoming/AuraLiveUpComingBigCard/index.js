import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import Router from 'next/router';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import { getCoach } from '../../../models/coach';
import Text from '../../app/Text';
import Loader from '../../app/Loader';
import { generateQueryPath, getCountDisplayValue } from '../../../utils';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import styles from './styles';
import routeConstants from '../../../utils/constants/routes';
import LiveUserInfo from '../../coachingLive/LiveUserInfo';

export default function AuraLiveUpComingBigCard({
  liveEvent,
  handleSubmit,
  isAlreadyReserved,
}) {
  const [, isMobile] = useResponsiveWindow();
  const [coach, setCoach] = useState(null);
  const { liveEventDetails, isLoading } = useShallowEqualSelector(
    ({ live }) => live
  );
  useEffect(() => {
    async function getCoachDetails() {
      const res = await getCoach(liveEvent.coachId);
      if (res && !res.error) {
        setCoach(res);
      }
    }
    if (liveEvent) {
      getCoachDetails();
    }
  }, [liveEvent]);
  const reservationPositionCenter = useCallback((reservation) => {
    if (reservation && Object.keys(reservation).length > 3) {
      return true;
    }
    return false;
  }, []);

  function handleClick(id) {
    const path = generateQueryPath(
      `${routeConstants.PAGE_COACHES}/${coach.slug}/live`,
      {
        liveEventId: id,
      }
    );
    Router.push(path);
  }
  if (!coach) {
    return <Loader />;
  }
  return (
    <div
      className={classNames('gradient-background col align-center', {
        clickable: !isAlreadyReserved(liveEvent),
      })}>
      <img
        src="/static/images/newCoach/liveBackground.png"
        alt="aura"
        className="background-live"
      />
      <div className={`live-details align-center`}>
        <div className="info-wrapper">
          <div className="coach-info-block">
            <div className="live-badge">
              <Text type="body2" weight="bold" style={{ color: '#FF3ACD' }}>
                Live
              </Text>
            </div>
            <div className="info-live col">
              <Text
                type={isMobile ? 'h3-large' : 'h2'}
                weight="bold"
                align={isMobile ? 'center' : 'left'}
                color="w100">
                {liveEvent.title}
              </Text>
              <Text
                type={isMobile ? 'body2' : 'cta'}
                color="w100"
                style={{ marginTop: 4 }}>
                {liveEvent &&
                  format(
                    new Date(liveEvent.scheduledAt),
                    'MMM dd, h:mm a,'
                  )}{' '}
                {liveEvent.duration} min long
              </Text>
              <Text
                type={isMobile ? 'body2' : 'cta'}
                color="w100"
                weight="bold"
                style={{ marginTop: 18 }}>
                {coach.name}
              </Text>
              <Text
                type={isMobile ? 'body2' : 'cta'}
                color="w100"
                weight="regular"
                style={{ marginTop: 4 }}>
                {coach.professionalTitle}
              </Text>
              {isLoading &&
              liveEventDetails &&
              liveEventDetails.id === liveEvent.id ? (
                <div className="reserve-spots position-center">
                  <Loader
                    color="#03a9f4"
                    size={26}
                    style={{ height: '100%' }}
                  />
                </div>
              ) : (
                <div
                  className={classNames('reserve-spots', {
                    'low-opacity': isAlreadyReserved(liveEvent),
                    'position-center': !reservationPositionCenter(
                      liveEvent.reservations
                    ),
                  })}
                  onClick={() => {
                    handleSubmit(liveEvent, coach);
                  }}>
                  <Text
                    type={isMobile ? 'body' : 'cta'}
                    color="b100"
                    weight="semibold">
                    {isAlreadyReserved(liveEvent)
                      ? 'Reserved Spot'
                      : 'Reserve Spot'}
                  </Text>
                  {liveEvent.reservations &&
                    Object.values(liveEvent.reservations).length > 3 && (
                      <div className="relative">
                        <div className="relative reservation-warpper">
                          {Object.values(liveEvent.reservations)
                            .splice(0, 2)
                            .map((info, index) => (
                              <div
                                className={classNames('reservation-numbers', {
                                  'user-0': index === 0,
                                  'user-1': index === 1,
                                })}
                                key={index}>
                                <LiveUserInfo info={info} />
                              </div>
                            ))}
                          <div className="reservation-numbers count">
                            <Text type="footnote" color="g50">
                              {liveEvent &&
                                liveEvent.reservations &&
                                getCountDisplayValue(
                                  Object.keys(liveEvent.reservations).length
                                )}
                            </Text>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
          <div className="coach-image-wrapper">
            <img
              src={coach && coach.profileBgRemovedPicture}
              alt="aura coach"
              className="coach-image"
            />
          </div>
          <div
            className="over-lay clickable"
            onClick={() => {
              if (isAlreadyReserved(liveEvent)) {
                return;
              }
              handleClick(liveEvent.id);
            }}></div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
