import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import Image from 'next/image';
import classNames from 'classnames';
import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar, dateFormat } from '@/utils';
import Loader from '@/components/app/Loader';
import Text from '@/components/app/Text';
import { getAvailableCoachingSpots, getCoachName } from '@/models/coach';
import AuraButton from '@/components/app/AuraButton';
import CustomHorizontalScrollView from '@/components/app/CustomHorizontalScroll';
import Analytics from '@/services/Analytics';
import useTranslations from '@/hooks/translations';
import schedulingConstants from '@/utils/constants/scheduling';
import {
  setSelectedDuration,
  setDate,
  setTimeAction,
} from '@/store/slices/coaching';
import styles from './styles';

function AvailabilityCard({
  coach,
  setIsReachEnd,
  onDateSelect,
  onTimeSelect,
  videoCoachingFlow,
  userSelectedTime,
  onContinue,
}) {
  const { t } = useTranslations();
  const dispatch = useDispatch();
  const {
    coachService,
    sortedTimeSlots,
    selectedDuration,
    selectedTime,
    selectedDate,
    isLoading,
    isLoadingMore,
  } = useShallowEqualSelector(({ coaching }) => coaching);

  const { id: serviceId, title, pricing, sessionTypeId } = coachService || {};

  const SessionTypeId = videoCoachingFlow
    ? schedulingConstants.SESSION_TYPES.FREE_DISCOVERY
    : sessionTypeId;

  async function setDuration(price) {
    Analytics.track('Appointment Duration Selected', {
      CoachId: coach?.id,
      CoachName: getCoachName(coach),
      ServiceId: serviceId,
      SessionTypeId,
      ServiceName: title,
      SelectedDuration: price.duration,
      SelectedTime: selectedTime,
      SelectedDate: selectedDate,
      Price: price.price / 100,
    });
    dispatch(setSelectedDuration(price.duration));
  }

  async function setSelectedDate(date) {
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
    if (onDateSelect && typeof onDateSelect === 'function') {
      onDateSelect();
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
    const appointmentData = sortedTimeSlots[selectedDate][time];
    dispatch(setTimeAction(appointmentData));

    if (onTimeSelect && typeof onTimeSelect === 'function') {
      onTimeSelect(time);
    }
  }

  const [showTimeSlotCount, setShowTimeSlotCount] = useState(12);

  const getDuration = useCallback((duration) => {
    const hours = duration / 60;
    if (Math.floor(hours) > 0) {
      return t('coaching_session_section_duration_item_hour', { hours });
    }
    return t('coaching_session_section_duration_item_min', { mins: duration });
  }, []);

  const showMoreTimeSlot = () => {
    setShowTimeSlotCount(sortedTimeSlots[selectedDate].length);
  };

  return (
    <>
      {sortedTimeSlots && Object.keys(sortedTimeSlots).length > 0 && (
        <div
          className={classNames(
            'timing-container desktop-only col align-center',
            {
              'timing-container-video-coaching': videoCoachingFlow,
            }
          )}>
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
          {!videoCoachingFlow && (
            <Text type="h3-small" color="b100" weight="semibold">
              {t('coaching_session_title_available_time')}
            </Text>
          )}
          {pricing && (
            <>
              <Text type="body2" color="g50" style={{ marginTop: 16 }}>
                {t('coaching_session_section_title_duration')}
              </Text>
              <div className="row time-slots-container">
                <CustomHorizontalScrollView
                  rightChevronStyles={{
                    right: '-23px',
                    top: '4px',
                    fontSize: 24,
                    width: 26,
                    height: 26,
                    color: '#4E545F',
                    boxShadow:
                      '0px 14.8459px 51.9608px rgba(43, 42, 107, 0.15)',
                    background:
                      'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                  }}
                  leftChevronStyles={{
                    left: '-23px',
                    top: '4px',
                    width: 26,
                    height: 26,
                    fontSize: 24,
                    color: '#4E545F',
                    boxShadow:
                      '0px 14.8459px 51.9608px rgba(43, 42, 107, 0.15)',
                    background:
                      'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                  }}
                  newCoachProfile
                  noFixedHeight
                  data={pricing}
                  renderItem={(price) => (
                    <div
                      className={classNames('row clickable justify-center', {
                        'session-slot-selected':
                          price.duration === selectedDuration,
                        'session-slot-not-selected':
                          price.duration !== selectedDuration,
                      })}
                      onClick={() => {
                        setDuration(price);
                      }}>
                      <Text type="body" style={{ minWidth: '70px' }}>
                        {getDuration(price.duration)}
                      </Text>
                      <Text
                        type="body"
                        color={
                          price.duration === selectedDuration ? 'w100' : 'b64'
                        }>
                        {I18NFormatter.formatCurrency(
                          convertToDollar(price.price)
                        )}
                      </Text>
                    </div>
                  )}
                />
              </div>
            </>
          )}

          <hr className="hr session-margin" />
          <div className="session-dates row grabbable">
            {sortedTimeSlots && selectedDuration && (
              <CustomHorizontalScrollView
                rightChevronStyles={{
                  right: '-23px',
                  top: '2px',
                  fontSize: 24,
                  width: 26,
                  height: 26,
                  color: '#4E545F',
                  boxShadow: '0px 14.8459px 51.9608px rgba(43, 42, 107, 0.15)',
                  background:
                    'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                }}
                leftChevronStyles={{
                  left: '-23px',
                  top: '0px',
                  width: 26,
                  height: 26,
                  fontSize: 24,
                  color: '#4E545F',
                  boxShadow: '0px 14.8459px 51.9608px rgba(43, 42, 107, 0.15)',
                  background:
                    'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                }}
                newCoachProfile
                noFixedHeight
                setIsReachEnd={setIsReachEnd}
                data={Object.keys(sortedTimeSlots)}
                renderItem={(date) => (
                  <div
                    key={date}
                    className={classNames({
                      'date-container-selected': selectedDate === date,
                      'date-container-not-selected': selectedDate !== date,
                    })}
                    onClick={() => {
                      if (!isLoading) {
                        setShowTimeSlotCount(12);
                        setSelectedDate(date);
                      }
                    }}>
                    <Text type="body">{dateFormat(date)}</Text>
                  </div>
                )}
              />
            )}
            {isLoadingMore && <Loader size={26} style={{ height: '100%' }} />}
          </div>
          <hr className="hr" />
          <Text type="body2" color="g50" style={{ marginTop: 24 }}>
            {t('coaching_session_section_title_session_start_time', {
              timeZone:
                Intl?.DateTimeFormat().resolvedOptions().timeZone || null,
            })}
          </Text>
          <div className="time-container">
            {selectedDate &&
              sortedTimeSlots &&
              sortedTimeSlots[selectedDate] &&
              Object.keys(sortedTimeSlots[selectedDate])
                .slice(0, showTimeSlotCount)
                .map((time) => (
                  <div
                    key={time}
                    className={classNames(
                      'col align-center justify-center time clickable',
                      {
                        'time-selected': time === userSelectedTime,
                      }
                    )}
                    onClick={() => {
                      if (!isLoading) {
                        setTime(time);
                      }
                    }}>
                    <Text type="body">{time}</Text>
                  </div>
                ))}
          </div>
          {showTimeSlotCount === 12 &&
            selectedDate &&
            sortedTimeSlots &&
            sortedTimeSlots[selectedDate] &&
            Object.keys(sortedTimeSlots[selectedDate])?.length > 12 && (
              <div
                className="show-more-button clickable"
                onClick={showMoreTimeSlot}>
                <Image
                  src="/static/images/icons/cross.svg"
                  alt="Plus"
                  height={19}
                  width={19}
                />
                <Text
                  type="subtitle"
                  color="b100"
                  weight="semibold"
                  style={{ lineHeight: 'normal' }}>
                  {t('button_show_more')}
                </Text>
              </div>
            )}

          <AuraButton
            title={t('button_continue')}
            withShadow
            style={{
              width: 320,
              marginTop: 18,
            }}
            textStyle={{ fontSize: 18, fontWeight: 700 }}
            disabled={!userSelectedTime || !selectedTime}
            onClick={onContinue}
            horizontalGradient
          />
        </div>
      )}
      <style jsx>{styles}</style>
    </>
  );
}
export default AvailabilityCard;
