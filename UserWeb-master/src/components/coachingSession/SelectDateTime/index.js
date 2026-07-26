import React, { useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import useToastMessage from '@/hooks/toastMessage';
import schedulingConstants from '@/utils/constants/scheduling';
import useTranslations from '@/hooks/translations';
import { pollUserExists } from '@/models/user';
import { getCoachName, getAvailableCoachingSpots } from '../../../models/coach';
import Text from '../../app/Text';
import styles from './styles';
import useBrowserHistory from '../../../hooks/browserHistory';
import CleanLoginModal from '../../login/CleanLoginModal';
import useAuthUser from '../../../hooks/authUser';
import { dateFormat } from '../../../utils';
import {
  createAppointmentAction,
  setAllowAppointment,
  setDate,
  setLoading,
  setTimeAction,
  setAppointmentType,
} from '../../../store/slices/coaching';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import Analytics from '../../../services/Analytics';
import Loader from '../../app/Loader';

export default function SelectDateTime({
  coach,
  onNext,
  onBack,
  onSubmitSignup,
  setIsReachEnd,
  videoCoachingFlow,
}) {
  const { t } = useTranslations();
  const { showError } = useToastMessage();
  useBrowserHistory('coachingSessionSelectDateTime', true, onBack, onNext);
  const {
    coachService,
    sortedTimeSlots,
    selectedDuration,
    selectedDate,
    selectedTime,
    allowAppointment,
    isLoading,
    isLoadingMore,
  } = useShallowEqualSelector(({ coaching }) => coaching);
  const { user, authLoading } = useAuthUser();
  const loginModalRef = useRef(null);
  const dispatch = useDispatch();
  const { id: serviceId, title, sessionTypeId } = coachService || {};

  const SessionTypeId = videoCoachingFlow
    ? schedulingConstants.SESSION_TYPES.FREE_DISCOVERY
    : sessionTypeId;

  function showLoginModal() {
    if (loginModalRef.current) {
      loginModalRef.current.show();
    }
  }
  const scrollRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scrollRefBar = scrollRef.current;
      if (
        scrollRefBar.scrollLeft + scrollRefBar.clientWidth >=
        scrollRefBar.scrollWidth
      ) {
        setIsReachEnd(true);
      }
    }
  }, [setIsReachEnd]);

  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      const scroll = scrollRef.current;
      scroll.addEventListener('scroll', handleScroll, false);
      return () => {
        scroll.removeEventListener('scroll', handleScroll, false);
      };
    }
    return undefined;
  }, [handleScroll, scrollRef]);

  async function setUserAppointment({ time } = {}) {
    const appointmentInformation = videoCoachingFlow
      ? {
          duration: 30,
          sessionTypeId: schedulingConstants.SESSION_TYPES.FREE_DISCOVERY,
          coachId: coach?.id,
          start: selectedTime?.start,
          end: selectedTime?.end,
          requiresCoachingSubscription: false,
          preventAutoConfirm: true,
          includesCoaching: true,
        }
      : null;
    const res = await dispatch(
      createAppointmentAction({ time, appointmentInformation })
    ).unwrap();
    if (res && !res.error) {
      dispatch(setAllowAppointment(false));
      onNext();
    } else {
      showError(t('error_failed_book_appointment'));
    }
  }

  async function setTime(time) {
    Analytics.track('Appointment Time Selected', {
      CoachId: coach?.id,
      CoachName: getCoachName(coach),
      ServiceId: serviceId,
      SessionTypeId,
      ServiceName: title,
      SelectedTime: time,
      SelectedDate: selectedDate,
      SelectedDuration: selectedDuration,
    });
    if (videoCoachingFlow) {
      await dispatch(
        setAppointmentType(schedulingConstants.SESSION_TYPES.FREE_DISCOVERY)
      );
      const appointmentData = sortedTimeSlots[selectedDate][time];
      dispatch(setTimeAction(appointmentData));
    }
    if (!user) {
      const appointmentData = sortedTimeSlots[selectedDate][time];
      dispatch(setTimeAction(appointmentData));
      showLoginModal();
    }
    if (user) {
      await setUserAppointment({ time });
    }
  }

  useEffect(() => {
    if (user && selectedTime && allowAppointment) {
      dispatch(setLoading(true));
      pollUserExists(user.id).then((result) => {
        if (result && !result.error) {
          setUserAppointment();
        }
      });
    }
  }, [user, dispatch]);

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="coach-row-info col align-center">
        {!videoCoachingFlow && (
          <div className="col align-center">
            <div className="coach-image-container">
              <img
                src={coach && coach.profileBgRemovedPicture}
                alt="coach"
                className="coach-image"
              />
            </div>
            <hr className="hr2" />
            <div className="col session-info">
              <Text type="h2-smaller" color="b100" weight="semibold">
                {coachService && coachService.title}
              </Text>
              <Text type="cta" color="b100" weight="regular">
                {t('coaching_session_by_coach', {
                  coachName: getCoachName(coach),
                })}
              </Text>
            </div>
          </div>
        )}
        {videoCoachingFlow && (
          <div className="availbility-header">
            <Text
              type="body2"
              weight="semibold"
              align="center"
              style={{ color: '#11D100', marginBottom: 6 }}>
              {t('video_coaching_availability_card_title_free_session')}
            </Text>
            <Text
              type="h4-large"
              weight="bold"
              align="center"
              style={{
                lineHeight: 'normal',
                color: '#2F3237',
                marginBottom: 3,
              }}>
              {t('video_coaching_availability_card_sub_title_book_call')}
            </Text>
            <Text
              type="body2"
              align="center"
              style={{
                lineHeight: '22px',
                color: '#5B657A',
                marginBottom: 8,
                letterSpacing: '0.1px',
              }}>
              {t('video_coaching_availability_card_sub_title_setup_plan')}
            </Text>
            <div className="spot-left">
              <Text type="footnote" weight="semibold">
                {t('video_coaching_availability_card_badge_spot_left', {
                  spotCount: getAvailableCoachingSpots(coach),
                })}
              </Text>
            </div>
          </div>
        )}
        <div
          className={classNames('timing-slots-container col align-center', {
            'timing-slots-container-video ': videoCoachingFlow,
          })}>
          {!videoCoachingFlow && (
            <Text type="body2" color="g50">
              {t('coaching_session_section_title_date')}
            </Text>
          )}
          <hr className="hr" />
          <div className="date-container row" ref={scrollRef}>
            {sortedTimeSlots &&
              selectedDuration &&
              Object.keys(sortedTimeSlots).map((date) => (
                <div
                  key={date}
                  className={classNames('single-date row align-center', {
                    'single-date-selected': selectedDate === date,
                  })}
                  onClick={() => {
                    Analytics.track('Appointment Date Selected', {
                      CoachId: coach?.id,
                      CoachName: getCoachName(coach),
                      ServiceId: serviceId,
                      SessionTypeId,
                      ServiceName: title,
                      SelectedDate: date,
                      SelectedDuration: selectedDuration,
                      SelectedTime: selectedTime,
                    });
                    dispatch(setDate(date));
                  }}>
                  <Text type="body2">{dateFormat(date)}</Text>
                </div>
              ))}
            {isLoadingMore && <Loader size={26} style={{ height: '100%' }} />}
          </div>
          <hr className="hr2" />
          <Text type="body2" color="g50" style={{ marginTop: 24 }}>
            {t('coaching_session_section_title_session_start_time', {
              timeZone:
                Intl?.DateTimeFormat().resolvedOptions().timeZone || null,
            })}
          </Text>
          <div className="row justify-center">
            <div className="time-container row">
              {selectedDate &&
                sortedTimeSlots &&
                sortedTimeSlots[selectedDate] &&
                Object.keys(sortedTimeSlots[selectedDate]).map((time) => (
                  <div
                    className="time col align-center justify-center"
                    key={time}
                    onClick={() => {
                      if (!isLoading) {
                        setTime(time);
                      }
                    }}>
                    <Text type="body" color="g100">
                      {time}
                    </Text>
                  </div>
                ))}
              <img
                src="/static/images/coachingSession/mobile-timing-slots.png"
                alt="aura"
                className="background-slots"
              />
            </div>
          </div>
        </div>
      </div>
      <CleanLoginModal
        ref={loginModalRef}
        isCoachingSession
        coach={coach}
        onSubmit={onSubmitSignup}
        loading={authLoading}
      />
      <style jsx>{styles}</style>
    </>
  );
}
