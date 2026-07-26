import classNames from 'classnames';
import { format } from 'date-fns';
import Router from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { HiCheck } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import { getCoachFirstName, getCoachName } from '../../../models/coach';
import { trackTypeDisplayStringFromId } from '../../../models/meditation';
import { generateQueryPath, getCountDisplayValue } from '../../../utils';
import routeConstants from '../../../utils/constants/routes';
import Text from '../../app/Text';
import styles from './styles';
import useAuthUser from '../../../hooks/authUser';
import {
  reserveSpot,
  setLiveEventAction,
  setLoading,
} from '../../../store/slices/live';
import {
  setScrollPosition,
  setShowLoginForm,
  showLoginModal,
} from '../../../store/slices/newCoachProfiles';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import Analytics from '../../../services/Analytics';
import Loader from '../../app/Loader';
import LiveUserInfo from '../../coachingLive/LiveUserInfo';

function AuraLive({
  coach,
  showViewAll,
  liveEvents,
  setSelectedTab,
  isHomePage,
  scrollPosition,
}) {
  const [, isMobile] = useResponsiveWindow();
  const upcomingEvent = liveEvents && liveEvents[0];
  const remainingLiveEvents = liveEvents && liveEvents.slice(1);
  const { user } = useAuthUser();
  const dispatch = useDispatch();
  const { liveEventDetails, isLoading } = useShallowEqualSelector(
    ({ live }) => live
  );

  const { currentScrollPosition } = useShallowEqualSelector(
    ({ profiles }) => profiles
  );

  useEffect(() => {
    if (currentScrollPosition > 0 && liveEvents) {
      window.scrollTo(0, currentScrollPosition);
    }
  }, [currentScrollPosition, liveEvents]);
  const redirectHandler = useCallback(
    async (event) => {
      dispatch(setScrollPosition(scrollPosition));
      const path = generateQueryPath(
        `${routeConstants.PAGE_COACHES}/${coach.slug}/${routeConstants.PAGE_LIVE}`,
        {
          isSpotReserved: true,
          liveEventId: event.id,
        }
      );
      Router.push(path).then(() => {
        window.scrollTo(0, 0);
      });
    },
    [coach, dispatch, scrollPosition]
  );

  useEffect(() => {
    async function reserveLiveEventSpot() {
      const { id: liveEventId, title } = liveEventDetails;
      const res = await dispatch(
        reserveSpot({ liveEventId: liveEventDetails.id })
      );
      dispatch(setLoading(false));
      if (res && !res.error) {
        Analytics.track('Reserved Live Event', {
          LiveEventId: liveEventId,
          LiveEventName: title,
          CoachId: coach?.id,
          CoachName: getCoachName(coach),
          Origin: 'live-list',
        });
        redirectHandler(liveEventDetails);
      }
    }
    if (
      user &&
      liveEventDetails &&
      liveEventDetails.reservations &&
      !liveEventDetails.reservations[user.id]
    ) {
      dispatch(setLoading(true));
      setTimeout(function () {
        reserveLiveEventSpot();
      }, 5000);
    }
  }, [dispatch, liveEventDetails, redirectHandler, user, coach]);

  const isAlreadyReserved = useCallback(
    (event) => {
      if (
        user &&
        ((event && event.reservations && !!event.reservations[user.id]) ||
          (liveEventDetails &&
            liveEventDetails.id === event.id &&
            liveEventDetails.reservations &&
            !!liveEventDetails.reservations[user.id]))
      ) {
        return true;
      }
      return false;
    },
    [user, liveEventDetails]
  );
  function handleClick(id) {
    dispatch(setScrollPosition(scrollPosition));
    const path = generateQueryPath(
      `${routeConstants.PAGE_COACHES}/${coach.slug}/live`,
      {
        liveEventId: id,
      }
    );
    Router.push(path);
  }

  async function handleSubmit(liveEvent) {
    dispatch(setShowLoginForm(false));
    if (isAlreadyReserved(liveEvent)) {
      return;
    }
    if (user) {
      dispatch(setLiveEventAction(liveEvent));
      const res = await dispatch(reserveSpot({ liveEventId: liveEvent.id }));
      if (res && !res.error) {
        redirectHandler(liveEvent);
      }
    } else {
      dispatch(setLiveEventAction(liveEvent));
      dispatch(showLoginModal());
    }
  }

  const reservationPositionCenter = useCallback((reservation) => {
    if (reservation && Object.keys(reservation).length > 3) {
      return true;
    }
    return false;
  }, []);
  return (
    <div className={classNames({ wrapper: !isHomePage })}>
      <div className={`live-session-container col align-center`}>
        <Text type={isMobile ? 'h4' : 'h1-large'} weight="regular" color="b100">
          {isMobile
            ? `Upcoming ${showViewAll ? 'Aura Live' : ''}`
            : 'Aura Live'}
        </Text>
        <div className="heading-text">
          <Text
            type="h2"
            weight="regular"
            color="b100"
            style={{ marginTop: 28 }}>
            Upcoming
          </Text>
        </div>
        {upcomingEvent && (
          <div
            className={classNames('gradient-background col align-center', {
              clickable: !isAlreadyReserved(upcomingEvent),
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
                    <Text
                      type="body2"
                      weight="bold"
                      style={{ color: '#FF3ACD' }}>
                      Live
                    </Text>
                  </div>
                  <div className="info-live col">
                    <Text
                      type={isMobile ? 'h3-large' : 'h2'}
                      weight="bold"
                      align={isMobile ? 'center' : 'left'}
                      color="w100">
                      {upcomingEvent.title}
                    </Text>
                    <Text
                      type={isMobile ? 'body2' : 'cta'}
                      color="w100"
                      style={{ marginTop: 4 }}>
                      {liveEvents &&
                        format(
                          new Date(upcomingEvent.scheduledAt),
                          'MMM dd, h:mm a,'
                        )}{' '}
                      {upcomingEvent.duration} min long
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
                    {isLoading && liveEventDetails.id === upcomingEvent.id ? (
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
                          'low-opacity': isAlreadyReserved(upcomingEvent),
                          'position-center': !reservationPositionCenter(
                            upcomingEvent.reservations
                          ),
                        })}
                        onClick={() => {
                          handleSubmit(upcomingEvent);
                        }}>
                        <Text
                          type={isMobile ? 'body' : 'cta'}
                          color="b100"
                          weight="semibold">
                          {isAlreadyReserved(upcomingEvent)
                            ? 'Reserved Spot'
                            : 'Reserve Spot'}
                        </Text>
                        {upcomingEvent.reservations &&
                          Object.values(upcomingEvent.reservations).length >
                            3 && (
                            <div className="relative">
                              <div className="relative reservation-warpper">
                                {Object.values(upcomingEvent.reservations)
                                  .splice(0, 2)
                                  .map((info, index) => (
                                    <div
                                      className={classNames(
                                        'reservation-numbers',
                                        {
                                          'user-0': index === 0,
                                          'user-1': index === 1,
                                        }
                                      )}
                                      key={index}>
                                      <LiveUserInfo info={info} />
                                    </div>
                                  ))}
                                <div className="reservation-numbers count">
                                  <Text type="footnote" color="g50">
                                    {upcomingEvent &&
                                      upcomingEvent.reservations &&
                                      getCountDisplayValue(
                                        Object.keys(upcomingEvent.reservations)
                                          .length
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
                    if (isAlreadyReserved(upcomingEvent)) {
                      return;
                    }
                    handleClick(upcomingEvent.id);
                  }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="row justify-center w-100">
        <div
          className={classNames('live-container-wrapper col align-center', {
            'margin-bottom': !isHomePage,
          })}>
          {remainingLiveEvents &&
            remainingLiveEvents.map((i) => (
              <div
                className="row align-center live-container-desktop clickable"
                key={i.id}>
                <div className="row align-center" style={{ width: 256 }}>
                  <div className="col align-center">
                    <Text type="h2" weight="regular" color="b100">
                      {format(new Date(i.scheduledAt), 'dd')}
                    </Text>
                    <Text type="body2" color="b100">
                      {format(new Date(i.scheduledAt), 'MMM')}
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
                    <Text type="cta" weight="semibold" color="b100">
                      {i.title}
                    </Text>
                  </div>
                </div>
                <div>
                  <Text type="body" color="b100">
                    {trackTypeDisplayStringFromId(i.contentType)}
                  </Text>
                  <Text type="body2" color="b64">
                    by {getCoachFirstName(coach)}
                  </Text>
                </div>
                {isLoading && liveEventDetails.id === i.id ? (
                  <div className="reserve-spots-desktop position-center">
                    <Loader
                      color="#03a9f4"
                      size={26}
                      style={{ height: '100%' }}
                    />
                  </div>
                ) : (
                  <div
                    className={classNames('reserve-spots-desktop clickable', {
                      'position-center': !reservationPositionCenter(
                        i.reservations
                      ),
                      'low-opacity': isAlreadyReserved(i),
                      'low-padding': isAlreadyReserved(i),
                    })}
                    onClick={() => {
                      handleSubmit(i);
                    }}>
                    <Text
                      type="cta"
                      color="b100"
                      weight="semibold"
                      style={{ minWidth: 100 }}>
                      {isAlreadyReserved(i) ? 'Reserved' : 'Reserve'}
                    </Text>
                    {i.reservations &&
                      Object.keys(i.reservations).length > 2 && (
                        <div className="relative reservation-warpper">
                          {i.reservations &&
                            Object.values(i.reservations)
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
                              {i.reservations
                                ? getCountDisplayValue(
                                    Object.keys(i.reservations).length
                                  )
                                : '0'}
                            </Text>
                          </div>
                        </div>
                      )}
                  </div>
                )}
                <div
                  className="over-lay clickable"
                  onClick={() => {
                    if (isAlreadyReserved(i)) {
                      return;
                    }
                    handleClick(i.id);
                  }}
                />
              </div>
            ))}
          <img
            src="/static/images/newCoach/live-background.png"
            alt="aura background"
            className={classNames('live-background-2', {
              'live-background-bigger-height': isHomePage,
            })}
          />
          {showViewAll && liveEvents.length > 3 && (
            <Text
              type="body"
              color="b100"
              style={{
                textDecoration: 'underline',
                marginTop: 23,
                cursor: 'pointer',
                zIndex: 2,
              }}
              onClick={() => setSelectedTab('Live')}>
              View All
            </Text>
          )}
        </div>
        <div className="live-container col align-center">
          {remainingLiveEvents &&
            remainingLiveEvents.map((i) => (
              <div className="row align-center schedule-margin" key={i.id}>
                <div className="col align-center">
                  <Text type="h2" weight="regular" color="b100">
                    {format(new Date(i.scheduledAt), 'dd')}
                  </Text>
                  <Text type="cta" color="b100">
                    {format(new Date(i.scheduledAt), 'MMM')}
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
                    {i.title}
                  </Text>
                  <Text type="body2" color="b100" weight="regular">
                    by {getCoachFirstName(coach)}
                  </Text>
                  <Text
                    type="body2"
                    color="b64"
                    weight="regular"
                    style={{ marginTop: 3 }}>
                    {trackTypeDisplayStringFromId(i.contentType)}
                  </Text>
                  <Text type="body2" color="b64" weight="regular">
                    {i.reservations ? Object.keys(i.reservations).length : '0'}{' '}
                    reserved
                  </Text>
                </div>
                <div
                  className={classNames(
                    'add-button clickable row jusify-center align-center',
                    {
                      'low-opacity': isAlreadyReserved(i),
                      'add-button-svg': isAlreadyReserved(i),
                      'position-center':
                        isLoading && liveEventDetails.id === i.id,
                    }
                  )}>
                  {isLoading && liveEventDetails.id === i.id ? (
                    <Loader
                      color="#03a9f4"
                      size={26}
                      style={{ height: '100%' }}
                    />
                  ) : (
                    <>
                      {isAlreadyReserved(i) ? (
                        <HiCheck />
                      ) : (
                        <img
                          src="/static/images/newCoach/add.png"
                          alt="aura"
                          className="add-icon"
                          onClick={() => {
                            handleSubmit(i);
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
                <div
                  className="over-lay"
                  onClick={() => {
                    if (isAlreadyReserved(i)) {
                      return;
                    }
                    handleClick(i.id);
                  }}
                />
              </div>
            ))}
          {showViewAll && liveEvents.length > 3 && (
            <Text
              type="body"
              color="b100"
              style={{
                textDecoration: 'underline',
                marginTop: 23,
                cursor: 'pointer',
                zIndex: 2,
              }}
              onClick={() => setSelectedTab('Live')}>
              View All
            </Text>
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default AuraLive;
