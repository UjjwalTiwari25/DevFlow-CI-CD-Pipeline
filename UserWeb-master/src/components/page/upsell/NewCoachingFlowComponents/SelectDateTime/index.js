import React, { useEffect, useRef, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { getCoachName, getCoachPhoto } from '../../../../../models/coach';
import Text from '../../../../app/Text';
import styles from './styles';
import { dateFormat } from '../../../../../utils';
import { setDate, setTimeAction } from '../../../../../store/slices/coaching';
import useShallowEqualSelector from '../../../../../hooks/shallowEqualSelector';
import Analytics from '../../../../../services/Analytics';
import Loader from '../../../../app/Loader';

export default function SelectDateTime({
  coach,
  setIsReachEnd,
  setTimeSelected,
  user,
}) {
  const {
    sortedTimeSlots,
    selectedDuration,
    selectedDate,
    selectedTime,
    isLoading,
    isLoadingMore,
  } = useShallowEqualSelector(({ coaching }) => coaching);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
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
    if (sortedTimeSlots) {
      dispatch(setDate(Object.keys(sortedTimeSlots)[0]));
    }
  }, [dispatch, sortedTimeSlots]);
  useEffect(() => {
    if (user) {
      Analytics.track('Onboarding Appointment Select Date Time Page Viewed', {
        UserId: user.id,
        isNewCoachingFlow: true,
      });
    }
  }, [user]);
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

  async function setTime(time) {
    setLoading(true);
    Analytics.track('Onboarding Appointment Date Time Selected', {
      CoachId: coach?.id,
      CoachName: getCoachName(coach),
      SelectedDate: selectedDate,
      SelectedDuration: selectedDuration,
      SelectedTime: selectedTime,
      isNewCoachingFlow: true,
    });
    const appointmentData = sortedTimeSlots[selectedDate][time];
    setTimeSelected(appointmentData);
    dispatch(setTimeAction(appointmentData));
    setLoading(false);
  }

  return (
    <>
      <div className="coach-row-info col align-center">
        <div className="col align-center">
          <img src={getCoachPhoto(coach)} alt="coach" className="coach-image" />
          <div className="col session-info">
            <Text type="cta" color="b100" weight="semibold">
              1-on-1 Onboarding Call
            </Text>
            <Text
              type="body"
              color="b100"
              weight="regular"
              style={{ marginTop: 2, marginBottom: 18 }}>
              with {getCoachName(coach)}
            </Text>
            <Text type="body" color="b100" weight="regular">
              30 min
            </Text>
          </div>
        </div>
        <div className="timing-slots-container col align-center">
          <Text type="body2" color="b64">
            Session Date
          </Text>
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
                    Analytics.track(
                      'Onboarding Coaching Session Date Selected',
                      {
                        CoachId: coach?.id,
                        CoachName: getCoachName(coach),
                        SelectedDate: date,
                        SelectedDuration: selectedDuration,
                        SelectedTime: selectedTime,
                        isNewCoachingFlow: true,
                      }
                    );
                    dispatch(setDate(date));
                  }}>
                  <Text
                    type="body2"
                    color={selectedDate === date ? 'w100' : 'b100'}>
                    {dateFormat(date)}
                  </Text>
                </div>
              ))}
            {isLoadingMore && <Loader size={26} style={{ height: '100%' }} />}
          </div>
          <hr className="hr2" />
          <Text type="body2" color="b64" style={{ marginTop: 24 }}>
            Session Start Time (
            {Intl?.DateTimeFormat().resolvedOptions().timeZone || null})
          </Text>
          <div className="row justify-center">
            {loading && (
              <div className="w-100 row justify-center">
                <Loader size={40} style={{ height: '100%' }} />
              </div>
            )}
            {!loading && (
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
                      <Text type="body" color="b100">
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
            )}
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
