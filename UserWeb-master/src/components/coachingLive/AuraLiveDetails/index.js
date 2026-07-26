import { format, intervalToDuration } from 'date-fns';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuthUser from '../../../hooks/authUser';
import usePageQuery from '../../../hooks/pageQuery';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import { getCoachName, getCoachPhoto } from '../../../models/coach';
import Analytics from '../../../services/Analytics';
import {
  reserveSpot,
  setLiveEventAction,
  setLoading,
} from '../../../store/slices/live';
import { setShowLoginForm } from '../../../store/slices/newCoachProfiles';
import AuraButton from '../../app/AuraButton';
import Loader from '../../app/Loader';
import Text from '../../app/Text';
import styles from './styles';

export default function AuraLiveDetails({
  coach,
  liveEvent,
  onNext,
  showLoginModal,
}) {
  const [, isMobile] = useResponsiveWindow();
  const { user, authLoading } = useAuthUser();
  const dispatch = useDispatch();
  const { autoReserve = null } = usePageQuery();
  const { liveEventDetails, isLoading } = useShallowEqualSelector(
    ({ live }) => live
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
          Origin: 'live-details',
        });
        onNext();
      }
    }
    if (
      user &&
      liveEventDetails &&
      liveEventDetails.reservations &&
      !liveEventDetails.reservations[user.id]
    ) {
      dispatch(setLoading(true));
      setTimeout(() => {
        reserveLiveEventSpot();
      }, 5000);
    }
  }, [dispatch, liveEventDetails, onNext, user, coach]);

  useEffect(() => {
    if (autoReserve === 'true' && !authLoading) {
      handleSubmit();
    }
  }, [autoReserve, authLoading]);

  const isAlreadyReserved = useCallback(() => {
    if (
      user &&
      ((liveEvent &&
        liveEvent.reservations &&
        !!liveEvent.reservations[user.id]) ||
        (liveEventDetails &&
          liveEventDetails.id === liveEvent.id &&
          liveEventDetails.reservations &&
          !!liveEventDetails.reservations[user.id]))
    ) {
      return true;
    }
    return false;
  }, [liveEvent, user, liveEventDetails]);

  const eventDuration = useCallback(() => {
    if (liveEvent) {
      const toStart = intervalToDuration({
        start: new Date(),
        end: new Date(liveEvent.scheduledAt),
      });
      return toStart;
    }
    return null;
  }, [liveEvent]);

  async function handleSubmit() {
    if (user) {
      const res = await dispatch(reserveSpot({ liveEventId: liveEvent.id }));
      dispatch(setLiveEventAction(liveEvent));
      if (res && !res.error) {
        onNext();
      }
    } else {
      dispatch(setShowLoginForm(false));
      dispatch(setLiveEventAction(liveEvent));
      showLoginModal();
    }
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="col align-center main" suppressHydrationWarning>
      <div className="coach-image-wrapper">
        <img
          src={
            isMobile
              ? '/static/images/coachingLive/coachLiveBackgroundMobile.png'
              : '/static/images/coachingLive/coachLiveBackground.png'
          }
          alt="coach background"
          className="coach-background"
        />
        <img
          src={coach && coach.profileBgRemovedPicture}
          alt="coach"
          className="coach-image"
        />
      </div>
      <div className="relative col align-center w-100">
        <div className="live-button row align-center justify-center">
          <Text
            type={isMobile ? 'body' : 'h3-small'}
            align="center"
            weight="semibold"
            style={{
              background: 'linear-gradient(to right, #FF3ACD, #FF3A46)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}>
            Live
          </Text>
        </div>
        <img
          src="/static/images/coachingLive/live-background.png"
          className="background-gradient"
          alt="background"
        />
      </div>
      <div className="col align-center relative">
        <Text
          type={isMobile ? 'h3' : 'h3-small'}
          align="center"
          weight={isMobile ? 'regular' : 'semibold'}
          color="b100"
          style={{
            marginTop: isMobile ? 13 : 21,
            fontSize: isMobile ? 24 : 38,
            lineHeight: isMobile ? '29.23px' : '46.28px',
          }}>
          {liveEvent && liveEvent.title}
        </Text>
        <Text
          type={isMobile ? 'body' : 'cta'}
          align="center"
          weight="regular"
          color="g50"
          style={{
            marginTop: 11,
            maxWidth: isMobile ? '100%' : '300px',
            lineHeight: isMobile && '19.49px',
          }}>
          {liveEvent && liveEvent.description}
        </Text>
        {isMobile && <hr className="hr" />}
      </div>
      <div className={isMobile && 'w-100 row'}>
        <div className={`row align-center coach-container`}>
          <img
            src={getCoachPhoto(coach)}
            alt={getCoachName(coach)}
            className="coach-thumbnail"
          />
          <div>
            <Text type="body2" color="b100" weight="semibold">
              {getCoachName(coach)}
            </Text>
            <Text
              type="body2"
              color="b40"
              weight="semibold"
              style={{ fontSize: 13, marginTop: 4, maxWidth: 120 }}>
              {coach && coach.professionalTitle}
            </Text>
          </div>
        </div>
      </div>
      <Text type="body" color="g100" weight="regular" style={{ marginTop: 20 }}>
        Starts in{' '}
        {eventDuration() && eventDuration().days && eventDuration().days}d{' '}
        {eventDuration() && eventDuration().hours && eventDuration().hours}h{' '}
        {eventDuration() && eventDuration().minutes && eventDuration().minutes}m
      </Text>
      <Text
        type="h3"
        color="b100"
        weight="regular"
        style={{ marginTop: isMobile ? 5 : 11 }}>
        {liveEvent &&
          format(new Date(liveEvent.scheduledAt), 'KK:mmaaa EEEE, MMM dd')}
      </Text>
      <Text
        type="body2"
        color="g50"
        weight="regular"
        style={{ marginTop: isMobile ? 22 : 24 }}>
        {liveEvent &&
        liveEvent.reservations &&
        Object.keys(liveEvent.reservations).length > 0
          ? Object.keys(liveEvent.reservations).length
          : '0'}{' '}
        Aura{' '}
        {liveEvent &&
        liveEvent.reservations &&
        Object.keys(liveEvent.reservations).length > 1
          ? 'Members'
          : 'Member'}{' '}
        Attending
      </Text>
      <AuraButton
        cleanStyle
        withShadow
        title={isAlreadyReserved() ? 'Reserved Spot' : 'Reserve Spot'}
        style={{
          marginTop: 10,
          width: 309,
          opacity: isAlreadyReserved() ? 0.5 : 1,
          position: 'relative',
          marginBottom: 20,
        }}
        textWeight="bold"
        disabled={isAlreadyReserved() || !liveEvent}
        onClick={() => {
          handleSubmit();
        }}
      />
      <style jsx>{styles}</style>
    </div>
  );
}
