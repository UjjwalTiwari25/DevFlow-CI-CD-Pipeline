import React, { useState } from 'react';
import Router from 'next/router';
import InputClean from '@/components/app/InputClean';
import { isValidEmail } from '@/utils/validators';
import AuraButton from '@/components/app/AuraButton';
import useToastMessage from '@/hooks/toastMessage';
import { notifyHandledError } from '@/services/ErrorMonitoring';
import useEmailLogin from '@/hooks/emailLogin';
import { getUserByEmail } from '@/models/user';
import routeConstants from '@/utils/constants/routes';
import usePageQuery from '@/hooks/pageQuery';
import { generateQueryPath } from '@/utils';
import Analytics from '@/services/Analytics';
import referralConstants from '@/utils/constants/referral';
import useTranslations from '@/hooks/translations';

const InputStyle = {
  background: '#fff',
  boxShadow: '0px 4px 20px 0px rgba(0, 4, 45, 0.07)',
  height: 45,
};

const FORM_STATUS = {
  DEFAULT: 'default',
  LOGIN: 'login',
  SIGNUP: 'signup',
};

function ReferralSignup({
  isInfluencerReferral,
  onSubmit,
  experiments,
  referralCode,
  referralType,
  referrer,
  utm_campaign,
  utm_medium,
  utm_source,
  channel,
  playlist,
  playlistOwnerId,
}) {
  const isNameOptional = experiments?.removeNameReferralSignup === 'a';
  const { showError } = useToastMessage();
  const { challengeId, trackId, liveEventId } = usePageQuery();
  const [currentFormStatus, setCurrentFormStatus] = useState(
    FORM_STATUS.DEFAULT
  );
  const { t } = useTranslations();

  const {
    onChangeEmail,
    onChangeName,
    onChangePassword,
    handleSubmit: handleLoginOrSignUp,
    email,
    givenName,
  } = useEmailLogin({
    showErrorToasts: true,
    isSignUp: currentFormStatus === FORM_STATUS.SIGNUP,
    isValidEmail,
    onSubmit,
    isNameOptional,
  });

  const handleUserCheck = async () => {
    try {
      if (!isValidEmail(email)) {
        showError(t('referral_error_enter_valid_email'));
        return;
      }
      Analytics.track('Share Referral LP Email Entered', {
        ChallengeId: challengeId,
        TrackId: trackId,
        LiveEventId: liveEventId,
        ReferralCode: referralCode,
        ReferralType: referralType,
        ReferrerID: referrer?.id,
        ReferralPlaylist: playlist?.name,
        Medium: utm_medium,
        Campaign: utm_campaign,
        Channel: channel,
      });
      const userResponse = await getUserByEmail(email);
      if (!userResponse) {
        setCurrentFormStatus(FORM_STATUS.SIGNUP);
      } else {
        Analytics.identifyUser(userResponse, false);
        if (!userResponse?.premium) {
          setCurrentFormStatus(FORM_STATUS.LOGIN);
        } else {
          const redirectLink = generateQueryPath(routeConstants.PAGE_GET_APP, {
            userId: userResponse && userResponse.id,
            source: routeConstants.PAGE_SUBSCRIBE,
            utm_campaign,
            utm_source,
            noTemporaryHold: true,
            challengeId,
            trackId,
            liveEventId,
            playlistId: playlist?.id,
            playlistOwnerId,
            referralCode:
              referralCode !== referralConstants.REFER_CODE_AURA_SOCIAL
                ? referralCode
                : null,
            referralType:
              referralCode !== referralConstants.REFER_CODE_AURA_SOCIAL
                ? referralType
                : null,
          });
          Router.push(redirectLink);
        }
      }
    } catch (error) {
      notifyHandledError(error, { message: 'Error checking user by email' });
    }
  };

  const handleButtonClick = () => {
    if (currentFormStatus === FORM_STATUS.DEFAULT) handleUserCheck();
    else handleLoginOrSignUp();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleButtonClick();
    }
  };

  return (
    <div>
      <InputClean
        type="text"
        fontType="body"
        color="b100"
        placeholder={t('referral_placeholder_enter_email')}
        inputStyle={InputStyle}
        style={{ width: '100%', marginBottom: 10, marginTop: 25 }}
        value={email}
        onChange={onChangeEmail}
        onKeyDown={handleKeyPress}
      />
      {(currentFormStatus === FORM_STATUS.LOGIN ||
        currentFormStatus === FORM_STATUS.SIGNUP) && (
        <InputClean
          type="password"
          fontType="body"
          color="b100"
          placeholder={t('email_login_form_placeholder_text_password')}
          inputStyle={InputStyle}
          style={{ width: '100%', marginBottom: 10 }}
          onChange={onChangePassword}
          onKeyDown={handleKeyPress}
        />
      )}
      {currentFormStatus === FORM_STATUS.SIGNUP && !isNameOptional && (
        <InputClean
          type="text"
          fontType="body"
          color="b100"
          placeholder={t('referral_placeholder_name')}
          inputStyle={InputStyle}
          style={{ width: '100%', marginBottom: 15 }}
          onChange={onChangeName}
          value={givenName}
          onKeyDown={handleKeyPress}
        />
      )}

      <AuraButton
        title={
          isInfluencerReferral
            ? t('button_try_aura_for_free')
            : t('referral_button_claim_today')
        }
        withShadow
        style={{
          height: 54,
          width: '100%',
          ...(!isInfluencerReferral && {
            background:
              'linear-gradient(278deg, #98DFFF 5.87%, #41F4FF 94.13%)',
          }),
        }}
        textStyle={{
          textShadow:
            '0px 5.156963348388672px 18.04937171936035px rgba(0, 0, 0, 0.15)',
          fontSize: 16,
          fontWeight: 700,
        }}
        horizontalGradient={isInfluencerReferral}
        cleanStyle={isInfluencerReferral}
        onClick={handleButtonClick}
      />
    </div>
  );
}

export default ReferralSignup;
