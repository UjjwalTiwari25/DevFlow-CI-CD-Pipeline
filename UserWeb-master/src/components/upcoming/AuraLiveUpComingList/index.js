import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import Router from 'next/router';
import { HiCheck } from 'react-icons/hi';
import { getCoach, getCoachFirstName } from '../../../models/coach';
import Text from '../../app/Text';
import Loader from '../../app/Loader';
import { generateQueryPath, getCountDisplayValue } from '../../../utils';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import styles from './styles';
import routeConstants from '../../../utils/constants/routes';
import { trackTypeDisplayStringFromId } from '../../../models/meditation';

export default function AuraLiveUpComingList({
  liveEvent,
  handleSubmit,
  isAlreadyReserved,
}) {
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
    <>
      <div className="row align-center live-container-desktop clickable">
        <div className="row align-center" style={{ width: 282 }}>
          <div className="col align-center">
            <Text type="h2" weight="regular" color="b100">
              {format(new Date(liveEvent.scheduledAt), 'dd')}
            </Text>
            <Text type="body2" color="b100">
              {format(new Date(liveEvent.scheduledAt), 'MMM')}
            </Text>
          </div>
          <div className="bg-gradient">
            <img
              src={coach.profileBgRemovedPicture}
              alt="aura"
              className="coach-image-schedual"
            />
          </div>
          <div className="free-webinar-container">
            <div className="free-webinar">
              <Text
                type="footnote"
                weight="semibold"
                style={{ color: '#9092A3', lineHeight: '11px' }}>
                Free
              </Text>
            </div>
            <Text
              type="cta"
              weight="semibold"
              color="b100"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                marginBottom: 8,
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}>
              {liveEvent.title}
            </Text>
          </div>
        </div>
        <div>
          <Text type="body" color="b100">
            {trackTypeDisplayStringFromId(liveEvent.contentType)}
          </Text>
          <Text type="body2" color="b64">
            by {getCoachFirstName(coach)}
          </Text>
        </div>
        <div>
          <Text
            type="body"
            color="b100"
            align="center"
            style={{ minWidth: 100 }}>
            Duration
          </Text>
          <Text
            type="body2"
            color="b64"
            align="center"
            style={{ minWidth: 100 }}>
            {liveEvent.duration} min
          </Text>
        </div>
        {isLoading && liveEventDetails.id === liveEvent.id ? (
          <div className="reserve-spots-desktop position-center">
            <Loader color="#03a9f4" size={26} style={{ height: '100%' }} />
          </div>
        ) : (
          <>
            <div
              className={classNames('reserve-spots-desktop clickable', {
                'position-center': !reservationPositionCenter(
                  liveEvent.reservations
                ),
                'low-opacity': isAlreadyReserved(liveEvent),
                'low-padding': isAlreadyReserved(liveEvent),
              })}
              onClick={() => {
                handleSubmit(liveEvent, coach);
              }}>
              <Text
                type="cta"
                color="b100"
                weight="semibold"
                style={{ minWidth: 100 }}>
                {isAlreadyReserved(liveEvent) ? 'Reserved' : 'Reserve'}
              </Text>
              {liveEvent.reservations &&
                Object.keys(liveEvent.reservations).length > 2 && (
                  <div className="relative reservation-warpper">
                    <div className="reservation-numbers count">
                      <Text type="footnote" color="g50">
                        {liveEvent.reservations
                          ? getCountDisplayValue(
                              Object.keys(liveEvent.reservations).length
                            )
                          : '0'}
                      </Text>
                    </div>
                  </div>
                )}
            </div>
          </>
        )}
        <div
          className="over-lay clickable"
          onClick={() => {
            if (isAlreadyReserved(liveEvent)) {
              return;
            }
            handleClick(liveEvent.id);
          }}
        />
      </div>
      <div
        className="row align-center schedule-margin live-container"
        key={liveEvent.id}>
        <div className="col align-center">
          <Text
            type="h2"
            weight="regular"
            color="b100"
            style={{ lineHeight: '26px' }}>
            {format(new Date(liveEvent.scheduledAt), 'dd')}
          </Text>
          <Text type="cta" color="b100">
            {format(new Date(liveEvent.scheduledAt), 'MMM')}
          </Text>
          <div className="free-webinar">
            <Text
              type="footnote"
              weight="semibold"
              style={{ color: '#9092A3', lineHeight: '11px' }}>
              Free
            </Text>
          </div>
        </div>
        <div className="bg-gradient">
          <img
            src={coach.profileBgRemovedPicture}
            alt="aura"
            className="coach-image-schedual"
          />
        </div>
        <div className="col live-time-details">
          <Text
            type="body"
            color="b100"
            weight="semibold"
            style={{
              lineHeight: '17.05px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}>
            {liveEvent.title}
          </Text>
          <Text type="body2" color="b100" weight="regular">
            by {getCoachFirstName(coach)}
          </Text>
          <Text
            type="body2"
            color="b64"
            weight="regular"
            style={{ marginTop: 3 }}>
            {trackTypeDisplayStringFromId(liveEvent.contentType)}
          </Text>
          <Text type="body2" color="b64" weight="regular">
            {liveEvent.reservations
              ? Object.keys(liveEvent.reservations).length
              : '0'}{' '}
            reserved
          </Text>
        </div>
        <div
          className={classNames(
            'add-button clickable row jusify-center align-center',
            {
              'low-opacity': isAlreadyReserved(liveEvent),
              'add-button-svg': isAlreadyReserved(liveEvent),
              'position-center':
                isLoading && liveEventDetails.id === liveEvent.id,
            }
          )}>
          {isLoading && liveEventDetails.id === liveEvent.id ? (
            <Loader color="#03a9f4" size={26} style={{ height: '100%' }} />
          ) : (
            <>
              {isAlreadyReserved(liveEvent) ? (
                <HiCheck />
              ) : (
                <img
                  src="/static/images/newCoach/add.png"
                  alt="aura"
                  className="add-icon"
                  onClick={() => {
                    handleSubmit(liveEvent, coach);
                  }}
                />
              )}
            </>
          )}
        </div>
        <div
          className="over-lay"
          onClick={() => {
            if (isAlreadyReserved(liveEvent)) {
              return;
            }
            handleClick(liveEvent.id);
          }}
        />
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
