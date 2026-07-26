import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { format, isToday, isTomorrow } from 'date-fns';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PhoneInput from 'react-phone-number-input/input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import classNames from 'classnames';
import { getCoachName, getCoachPhoto } from '../../../../../models/coach';
import { setUserPhoneNumber } from '../../../../../models/user';
import Text from '../../../../app/Text';
import styles from './styles';
import {
  createAppointmentAction,
  setAppointmentType,
} from '../../../../../store/slices/coaching';
import config from '../../../../../config';
import {
  checkoutSubscription,
  handleProcessSubscription,
} from '../../../../../store/slices/payment';
import useToastMessage from '../../../../../hooks/toastMessage';
import AuraButton from '../../../../app/AuraButton';
import AuraRingClean from '../../../../app/AuraRingClean';
import useAuthUser from '../../../../../hooks/authUser';
import Analytics from '../../../../../services/Analytics';
import IPLookup from '../../../../../services/IPLookup';
import AddToCalendarButton from './AddToCalendarButton';

export default function BookCoachCall({
  coach,
  setCoachingSubscriptionDetails,
  setHideBackButton,
  data,
  onNext,
  timeSelected,
  experiments,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [callBooked, setCallBooked] = useState(false);
  const [userNumber, setUserNumber] = useState(null);
  const [phoneError, setPhoneError] = useState(false);
  const { user } = useAuthUser();
  const [userLocation, setUserLocation] = useState(null);
  const gmailReg = '[a-zA-Z0-9]{0,}([.]?[a-zA-Z0-9]{1,})[@](gmail.com)';
  const patt = new RegExp(gmailReg);
  const isGmailAcc = patt.test(user?.email);

  const { showError } = useToastMessage();
  useEffect(() => {
    async function getUserLocation() {
      const location = await IPLookup.getUserGeoLocation();
      if (location) {
        setUserLocation(location);
      }
    }
    if (!userLocation) {
      getUserLocation();
    }
  }, [userLocation]);

  useEffect(() => {
    if (user) {
      Analytics.track('Onboarding Coaching Book Call Page Viewed', {
        UserId: user.id,
        isNewCoachingFlow: true,
      });
    }
  }, [user]);

  async function createSubscriptionAndBookAppointment() {
    if (loading) return;
    setLoading(true);
    setHideBackButton(true);
    await dispatch(setAppointmentType('free-discovery'));
    await dispatch(checkoutSubscription());
    const response = await dispatch(
      handleProcessSubscription({ isCoachingFreeTrial: true })
    ).unwrap();
    if (response && !response.error) {
      Analytics.track('Onboarding Coaching Subscribed', {
        UserId: user.id,
        coachId: coach?.id,
        isNewCoachingFlow: true,
      });
      await setCoachingSubscriptionDetails({
        coachId: coach?.id,
        isCoachingFreeTrial: true,
        type: 'coaching',
      });
      const appointmentInformation = {
        ...data,
        coachId: coach?.id,
        start: timeSelected.start,
        requiresCoachingSubscription: false,
        preventAutoConfirm: false,
      };
      const res = await dispatch(
        createAppointmentAction({ time: timeSelected, appointmentInformation })
      ).unwrap();
      if (res && !res.error) {
        Analytics.track('Onboarding Coaching Trial Call Booked', {
          UserId: user.id,
          coachId: coach?.id,
          isNewCoachingFlow: true,
        });
        Analytics.track('Onboarding Call Scheduled', {
          CoachId: coach?.id,
          coachingSubscribedBeforeBooking: true,
          appointmentId: res.id,
          appointmentType: 'initial',
          'Scheduled Date': timeSelected.start,
        });
        setCallBooked(true);
        setTimeout(async () => {
          setLoading(false);
          const isUsLocation = userLocation?.countryCode === 'US';
          if (
            (experiments.webCoachingAddToCalendar !== 'a' || !isGmailAcc) &&
            !isUsLocation
          ) {
            onNext();
          } else if (isUsLocation) {
            setShowPhoneInput(true);
          }
        }, 4000);
      } else {
        showError('Failed to book call');
        setLoading(false);
        setCallBooked(false);
        setHideBackButton(false);
      }
    } else {
      showError('Failed to process subscription. Please try again');
      setLoading(false);
      setHideBackButton(false);
    }
  }

  function handlePhoneNumberChange(e) {
    if (phoneError) {
      setPhoneError(false);
    }
    setUserNumber(e);
  }
  function handleKeyPress(key) {
    if (key.keyCode === 13) handlePhoneNumberSubmit();
  }
  async function handlePhoneNumberSubmit() {
    if (isValidPhoneNumber(userNumber)) {
      const updatedPhoneNumber = userNumber.replace('+', '');
      await setUserPhoneNumber(user.id, updatedPhoneNumber);
      Analytics.track('Onboarding Coaching User Phone Added', {
        UserId: user.id,
        userNumber,
        isNewCoachingFlow: true,
      });
      onNext();
    } else {
      setPhoneError(true);
    }
  }

  return (
    <>
      <div className="coach-row-info col align-center">
        {experiments.webCoachingAddToCalendar === 'a' &&
          callBooked &&
          !loading &&
          isGmailAcc && (
            <div className="col align-center">
              <Text type="h4" color="b100" align="center">
                Your call has been booked!
                <br />
                One last step..
              </Text>
              <div className="add-calendar-card">
                <div className="book-info-row">
                  <div className="coach-image-wrapper">
                    <img
                      src={getCoachPhoto(coach)}
                      alt="coach"
                      className="coach-image"
                    />
                    <span className="camera-icon">
                      <img src="/static/svgs/camera.svg" alt="camera icon" />
                    </span>
                  </div>
                  <div className="book-info-container">
                    <Text
                      color="b100"
                      weight="regular"
                      style={{ fontSize: 13, opacity: 0.8 }}>
                      Upcoming meeting
                    </Text>
                    <Text type="body" color="b100" weight="semibold">
                      1-on-1 Onboarding Call
                    </Text>
                    <Text type="body2" color="b100" style={{ marginTop: 11 }}>
                      {format(new Date(timeSelected.start), 'MMM dd')},{' '}
                      {format(new Date(timeSelected.start), 'hh:mm')}-
                      {format(new Date(timeSelected.end), 'hh:mm')}{' '}
                      {format(new Date(timeSelected.end), 'aaa')}
                    </Text>
                    <Text type="body2" color="b100" style={{ marginTop: 2 }}>
                      Zoom
                    </Text>
                    <Text
                      type="body2"
                      color="b100"
                      style={{ marginTop: 10, opacity: 0.7 }}>
                      {getCoachName(coach)}
                    </Text>
                  </div>
                </div>

                <GoogleOAuthProvider
                  clientId={config.googleOAuth.calendarClientId}>
                  <AddToCalendarButton
                    onNext={onNext}
                    showPhoneInput={showPhoneInput}
                  />
                </GoogleOAuthProvider>
              </div>
            </div>
          )}
        {(experiments.webCoachingAddToCalendar !== 'a' ||
          !callBooked ||
          loading) && (
          <div className="col align-center">
            <img
              src={getCoachPhoto(coach)}
              alt="coach"
              className="coach-image"
            />
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
              {timeSelected && (
                <>
                  <Text type="body2" color="b64" style={{ marginTop: 32 }}>
                    Session Date
                  </Text>
                  <Text
                    type="body"
                    color="b100"
                    align="center"
                    style={{ marginTop: 3 }}>
                    {format(new Date(timeSelected.start), 'MMM dd')}{' '}
                    {isToday(new Date(timeSelected.start)) ? 'Today' : ''}
                    {isTomorrow(new Date(timeSelected.start)) ? 'Tomorrow' : ''}
                  </Text>
                  <Text type="body2" color="b64" style={{ marginTop: 34 }}>
                    Session Start Time
                  </Text>
                  <Text
                    type="body"
                    color="b100"
                    align="center"
                    style={{ marginTop: 3 }}>
                    {format(new Date(timeSelected.start), 'h:mm a')} (
                    {Intl?.DateTimeFormat().resolvedOptions().timeZone || null})
                  </Text>
                  {!showPhoneInput && (
                    <>
                      <Text type="body2" color="b64" style={{ marginTop: 30 }}>
                        Aura Premium Offer
                      </Text>
                      <Text
                        type="body"
                        color="b100"
                        align="center"
                        style={{ marginTop: 3, maxWidth: '240px' }}>
                        Free onboarding call & 7-day trial. After trial: $149/mo
                      </Text>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {loading && (
          <div className="loaders">
            {!callBooked && (
              <div className="w-100 col align-center">
                <div className="rotating">
                  <AuraRingClean size={60} />
                </div>
                <Text type="cta" color="b100">
                  Booking ...
                </Text>
              </div>
            )}
            {callBooked && (
              <div className="col align-center">
                <img
                  src="/static/images/newCoachingFlow/call-booked.png"
                  alt="aura"
                  className="call-booked-ring"
                />
                <Text type="cta" color="b100">
                  Booked!
                </Text>
              </div>
            )}
          </div>
        )}
        {!loading && !callBooked && (
          <div className="button-wrapper col align-center">
            <div className={'button-container'}>
              {!showPhoneInput && (
                <>
                  <div className="row">
                    <img
                      src="/static/images/newCoachingFlow/lock.png"
                      alt="aura"
                      className="lock-image"
                    />
                    <div>
                      <Text
                        type="body2"
                        color="b100"
                        style={{
                          fontSize: '13px',
                          lineHeight: '17px',
                          maxWidth: 220,
                        }}>
                        This call is completely secured and private, and can be
                        done video or audio only.
                      </Text>
                      <Text
                        type="body2"
                        color="b100"
                        style={{
                          fontSize: '13px',
                          lineHeight: '17px',
                          maxWidth: 200,
                          marginTop: 14,
                        }}>
                        If you are not satisfied with your coach, you can choose
                        another coach.
                      </Text>
                    </div>
                  </div>
                </>
              )}
            </div>
            {(!showPhoneInput ||
              experiments.webCoachingAddToCalendar !== 'a') && (
              <>
                <AuraButton
                  cleanStyle={true}
                  withShadow
                  title="Book Call"
                  textWeight="bold"
                  disabled={loading}
                  onClick={() => {
                    createSubscriptionAndBookAppointment();
                  }}
                  style={{ width: '90%', marginTop: 30 }}
                  experiments={experiments}
                />
              </>
            )}
          </div>
        )}
        {showPhoneInput && (
          <div className="button-wrapper col align-center">
            <div className={'button-container'}>
              <div className="col align-center">
                <div className="row justify-center align-center phone-input-container">
                  <img
                    src="/static/images/newCoachingFlow/phone-input.png"
                    alt="aura"
                    className="phone-input"
                  />
                </div>
                <Text
                  color="b100"
                  type="body"
                  align="center"
                  style={{ lineHeight: '16px', marginBottom: 28 }}>
                  Receive text reminders for your onboarding call
                </Text>
                <div
                  className={classNames('phone-container', {
                    'red-border': phoneError,
                  })}>
                  <img
                    src="/static/images/newCoachingFlow/usa.png"
                    alt="aura flag"
                    className="flag"
                  />
                  <PhoneInput
                    style={{
                      color: '#fff',
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      width: '100%',
                    }}
                    placeholder="Receive Phone Text Reminders"
                    country="US"
                    onChange={(e) => {
                      handlePhoneNumberChange(e);
                    }}
                    className="phone-input-field"
                    onKeyDown={handleKeyPress}
                  />
                </div>
                {phoneError && (
                  <Text type="body2" style={{ color: '#FF3B30', marginTop: 4 }}>
                    Please enter a valid phone number
                  </Text>
                )}
                <AuraButton
                  cleanStyle
                  withShadow
                  title="Add my number"
                  textWeight="bold"
                  style={{ width: '100%', marginTop: 22 }}
                  onClick={() => {
                    handlePhoneNumberSubmit();
                  }}
                />
                {experiments.webCoachingTextRemindersNoSkip !== 'a' && (
                  <div
                    className="clickable skip-button"
                    onClick={() => {
                      Analytics.track(
                        'Onboarding Coaching User Add Phone Skipped',
                        {
                          UserId: user.id,
                          isNewCoachingFlow: true,
                        }
                      );
                      onNext();
                    }}>
                    <Text
                      type="body2"
                      color="b100"
                      align="center"
                      style={{ textDecoration: 'underline' }}>
                      Skip (not recomended)
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
