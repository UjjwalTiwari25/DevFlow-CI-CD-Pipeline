import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import Analytics from '../../../../../../services/Analytics';
import Text from '../../../../../app/Text';
import { setCalendar } from '../../../../../../models/user';
import Logger from '../../../../../../services/Logger';
import useToastMessage from '../../../../../../hooks/toastMessage';
import useAuthUser from '../../../../../../hooks/authUser';
import styles from './styles';

const SCOPES =
  'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events';

function AddToCalendarButton({ showPhoneInput, onNext }) {
  const { user } = useAuthUser();
  const { showError, showSuccess } = useToastMessage();

  const googleSignInSuccess = async (response) => {
    const { code } = response;
    if (code) {
      const result = await setCalendar({
        calendarType: 'google',
        calendarToken: code,
      });

      if (result) {
        Analytics.track('User Add To Calendar Successful', { Type: 'google' });
        showSuccess('Successfully added to the calendar');
        if (!showPhoneInput && onNext) {
          onNext();
        }
      }
    }
  };

  const googleSignInError = (error) => {
    Analytics.track('User Add To Calendar Error', { Type: 'google' });
    showError('Unable to authenticate with your calendar account.');
    Logger.error('Error in google calendar authentication', {
      error,
    });
  };

  const addToCalendar = useGoogleLogin({
    flow: 'auth-code',
    onError: googleSignInError,
    onSuccess: googleSignInSuccess,
    scope: SCOPES,
  });

  return (
    <div
      className="submit-button clickable"
      onClick={() => {
        addToCalendar();
        Analytics.track('Add To My Calendar CTA Tapped', {
          UserId: user.id,
        });
      }}>
      <Text type="body" weight="semibold">
        Add to my calendar
      </Text>
      <style jsx>{styles}</style>
    </div>
  );
}

export default AddToCalendarButton;
