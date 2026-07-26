import React from 'react';
import { useDispatch } from 'react-redux';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar } from '@/utils';
import { getCoachName } from '../../../models/coach';
import Text from '../../app/Text';
import styles from './styles';
import useBrowserHistory from '../../../hooks/browserHistory';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import { setSelectedDuration } from '../../../store/slices/coaching';
import Analytics from '../../../services/Analytics';

export default function SelectPlan({ coach, onNext, onBack }) {
  const { t } = useTranslations();
  useBrowserHistory('coachingSessionSelectPlan', true, onBack, onNext);
  const { coachService, selectedDate, selectedTime } = useShallowEqualSelector(
    ({ coaching }) => coaching
  );
  const { id: serviceId, title } = coachService || {};
  const dispatch = useDispatch();
  async function setPlan(plan) {
    dispatch(setSelectedDuration(plan));
    onNext();
  }
  return (
    <>
      <div className="coach-row-info col align-center">
        <div className="col align-center">
          <div className="coach-image-container">
            <img
              src={coach && coach.profileBgRemovedPicture}
              alt="coach"
              className="coach-image"
            />
          </div>
          <hr className="hr" />
          <div className="col session-info">
            <Text type="h2-smaller" color="b100" weight="semibold">
              {coachService && coachService.title}
            </Text>
            <Text
              type="cta"
              color="b100"
              weight="regular"
              style={{ marginTop: 4 }}>
              {t('coaching_session_by_coach', {
                coachName: getCoachName(coach),
              })}
            </Text>
          </div>
        </div>
        <div className="timing-slots-container col align-center">
          <Text type="body2" color="g50" style={{ marginBottom: 4 }}>
            {t('coaching_session_section_title_session_duration')}
          </Text>
          <img
            src="/static/images/coachingSession/mobile-timing-slots.png"
            alt="aura"
            className="background-slots"
          />
          {coachService &&
            coachService.pricing &&
            coachService.pricing.map((price) => (
              <div
                className="timing row"
                key={price.duration}
                onClick={() => {
                  setPlan(price.duration);
                  Analytics.track('Coaching Session Duration Selected', {
                    CoachId: coach?.id,
                    CoachName: getCoachName(coach),
                    ServiceId: serviceId,
                    ServiceName: title,
                    SelectedDuration: price.duration,
                    SelectedTime: selectedTime,
                    SelectedDate: selectedDate,
                    Price: price.price / 100,
                  });
                }}>
                <Text type="body" color="g100" weight="semibold">
                  {t('coaching_session_section_duration_item_minutes', {
                    duration: price.duration,
                  })}
                </Text>
                <Text type="body" color="g100" weight="regular">
                  {I18NFormatter.formatCurrency(convertToDollar(price.price))}$
                </Text>
              </div>
            ))}
        </div>
      </div>

      <style jsx>{styles}</style>
    </>
  );
}
