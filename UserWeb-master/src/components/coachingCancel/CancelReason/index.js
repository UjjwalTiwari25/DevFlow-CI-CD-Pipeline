import React, { useState } from 'react';
import useAuthUser from '../../../hooks/authUser';
import useBrowserHistory from '../../../hooks/browserHistory';
import useToastMessage from '../../../hooks/toastMessage';
import { cancelAppointment } from '../../../models/service';
import Analytics from '../../../services/Analytics';
import AuraButtonSecondary from '../../app/AuraButtonSecondary';
import Text from '../../app/Text';

import styles from './styles';
import AppointmentCoachDetail from '../../coachingReschedule/AppointmentCoachDetail';

const CANCEL_OPTIONS = [
  {
    title: `Times don’t work for me`,
    itemKey: `time_does_not_work`,
    valid: ['free-discovery', 'paid-service-individual', 'paid-coaching'],
  },
  {
    title: `I dont want a video call`,
    itemKey: `dont_want_video_call`,
    valid: ['free-discovery'],
  },
  {
    title: `I don't want 1-1 coaching`,
    itemKey: `dont_want_coaching`,
    valid: ['free-discovery'],
  },
  {
    title: `It's too expensive`,
    itemKey: `too_expensive`,
    valid: ['paid-service-individual', 'paid-coaching'],
  },
  {
    title: `Other`,
    itemKey: `other`,
    valid: ['free-discovery', 'paid-service-individual', 'paid-coaching'],
  },
];

export default function CancelReason({
  onNext,
  onBack,
  coach,
  appointmentDetails,
}) {
  useBrowserHistory('cancelReason', true, onBack, onNext);
  const [showInput, setShowInput] = useState(false);
  const { id, sessionTypeId } = appointmentDetails;
  const [otherReason, setOtherReason] = useState(null);
  const [loading, setLoading] = useState(false);
  const Toast = useToastMessage();
  const { user } = useAuthUser();
  async function handleSubmit(item) {
    setLoading(true);
    if (!item) {
      if (otherReason) {
        const res = await cancelAppointment({
          appointmentId: id,
          reason: otherReason,
        });
        if (res && !res.error) {
          Analytics.track('Appointment Canceled', {
            userId: user?.id,
            appointmentId: res.id,
            coachId: coach?.id,
            reason: otherReason,
          });
          setLoading(false);
          onNext();
        }
      } else {
        Toast.showError(`Reason Can't be empty`);
        setLoading(false);
      }
      setLoading(false);
      return;
    }
    if (item.itemKey === 'other') {
      if (!showInput) {
        setShowInput(true);
        setLoading(false);
      }
      setLoading(false);
      return;
    }
    const res = await cancelAppointment({
      appointmentId: id,
      reason: item.itemKey,
    });
    if (res && !res.error) {
      Analytics.track('Appointment Canceled', {
        userId: user?.id,
        appointmentId: res.id,
        coachId: coach?.id,
        reason: item.title,
      });
      setLoading(false);
      onNext();
    } else {
      Toast.showError(`Coacing Cancel Failed`);
      setLoading(false);
    }
  }
  return (
    <div className="col align-center container">
      <AppointmentCoachDetail
        coach={coach}
        appointmentDetails={appointmentDetails}
      />
      <Text type="h3" color="g100" style={{ marginTop: 46 }}>
        Why are you cancelling?
      </Text>
      <Text type="body2" color="g64" style={{ marginTop: 9 }}>
        Help us make your experience better
      </Text>
      <div className="w-100 question-container">
        {!showInput &&
          CANCEL_OPTIONS.map((item) => (
            <>
              {item.valid.includes(sessionTypeId) && (
                <div
                  id="btn-card"
                  className="button-shadow clickable"
                  onClick={() => {
                    handleSubmit(item);
                  }}
                  key={item.itemKey}>
                  <Text
                    type="body"
                    align="center"
                    weight="regular"
                    color={'g100'}
                    style={{ maxWidth: '90%' }}>
                    {item.title}
                  </Text>
                </div>
              )}
            </>
          ))}
        {showInput && (
          <div className="relative">
            <img
              src="/static/images/reschedule/call-cancel-bg.png"
              alt="aura bg"
              className="bg-call-cancel"
            />
            <div className="cancel-container col align-center">
              <Text
                type="body"
                color="g100"
                align="center"
                style={{ maxWidth: 261, lineHeight: '16px' }}>
                {`Why do you want to cancel this booking? Explain the reason to your coach.`}
              </Text>
              <textarea
                className="text-area"
                rows="6"
                resize={false}
                onChange={(e) => {
                  setOtherReason(e.target.value);
                }}></textarea>
              <AuraButtonSecondary
                hideShadow
                title="Send"
                style={{
                  width: '100%',
                  marginTop: 14,
                  boxShadow: '0px 12px 50px rgba(43, 42, 107, 0.1)',
                }}
                disabled={loading}
                onClick={() => {
                  handleSubmit();
                }}
              />
            </div>
          </div>
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
