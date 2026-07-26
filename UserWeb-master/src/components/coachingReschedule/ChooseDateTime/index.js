import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
// import Analytics from '../../../services/Analytics';
import { setDate, setTimeAction } from '../../../store/slices/coaching';
import { dateFormat } from '../../../utils';
import Loader from '../../app/Loader';
import Text from '../../app/Text';
import AppointmentCoachDetail from '../AppointmentCoachDetail';
import styles from './styles';

export default function ChooseDateTime(props) {
  const { onNext, setIsReachEnd, coach, appointmentDetails } = props;
  const { duration } = appointmentDetails;
  const {
    sortedTimeSlots,
    selectedDuration,
    selectedDate,
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
    // Analytics.track('Onboarding Appointment Date Time Selected', {
    //   CoachId: coach?.id,
    //   CoachName: getCoachName(coach),
    //   SelectedDate: selectedDate,
    //   SelectedDuration: selectedDuration,
    //   SelectedTime: selectedTime,
    //   isNewCoachingFlow: true,
    // });
    const appointmentData = sortedTimeSlots[selectedDate][time];
    // setTimeSelected(appointmentData);
    dispatch(setTimeAction(appointmentData));
    setLoading(false);
    onNext();
  }

  return (
    <>
      <div className="coach-row-info col align-center">
        <div className="col align-center">
          <AppointmentCoachDetail
            coach={coach}
            appointmentDetails={appointmentDetails}
          />
          <Text type="body" color="b100" weight="regular">
            {duration} min
          </Text>
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
                    // Analytics.track(
                    //   'Onboarding Coaching Session Date Selected',
                    //   {
                    //     CoachId: coach?.id,
                    //     CoachName: getCoachName(coach),
                    //     SelectedDate: date,
                    //     SelectedDuration: selectedDuration,
                    //     SelectedTime: selectedTime,
                    //     isNewCoachingFlow: true,
                    //   }
                    // );
                    dispatch(setDate(date));
                  }}>
                  <Text
                    type="body2"
                    color={selectedDate === date ? 'b100' : 'b100'}>
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
