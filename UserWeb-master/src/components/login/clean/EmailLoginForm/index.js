import React from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import useAuthUser from '@/hooks/authUser';
import { isValidEmail } from '../../../../utils/validators';
import AuraButton from '../../../app/AuraButton';
import Text from '../../../app/Text';
import styles from './styles';
import InputClean from '../../../app/InputClean';
import useEmailLogin from '../../../../hooks/emailLogin';
import useThemeListener from '../../../../hooks/themeListener';

export default function EmailLoginForm({
  isSignUp,
  onSubmit,
  loginOnExistingUserSignUp,
  btnText,
  showForgotPassword = true,
  showErrorToasts = true,
  setShowDetails,
  showAccPrivacy = false,
  isStepByStepSignup = false,
  profile,
  isModalSignup,
  hide,
  user,
  onExistingUserSignUpError,
  isNoBackgroundFullWidth,
  inputContainerStyle = {},
  buttonStyle = {},
  buttonTextStyle = {},
}) {
  const {
    onChangeEmail,
    onChangeName,
    onChangePassword,
    handleSubmit,
    handleForgotPassword,
    email,
    givenName,
    handleUserEmailValidation,
    invalidEmailError,
    password,
    showEmailInput,
    showPasswordInput,
    showCTA,
  } = useEmailLogin({
    showErrorToasts,
    isSignUp,
    isValidEmail,
    onSubmit,
    loginOnExistingUserSignUp,
    setShowDetails,
    isStepByStepSignup,
    userInformation: profile,
    isModalSignup,
    hide,
    userName: user && user.givenName && user.givenName,
    onExistingUserSignUpError,
  });
  const { authLoading } = useAuthUser();
  const { isDark } = useThemeListener();
  const { t } = useTranslations();
  const textStyle = {
    fontWeight: 600,
    fontSize: 18,
  };
  const cleanStyle = {
    boxShadow: '0px 29px 33px -12px rgb(4 210 244 / 62%)',
    borderRadius: 99,
    background: 'linear-gradient(277.58deg, #4EC8FF 5.87%, #1DF4ED 94.13%)',
  };

  return (
    <form
      className={classNames('form-container', {
        'low-opacity': isDark,
        'increase-height': showAccPrivacy,
        'top-padding': isStepByStepSignup,
        'merge-scrs-padding': isModalSignup,
        'form-container-no-background': isNoBackgroundFullWidth,
      })}
      onSubmit={handleSubmit}>
      {!isStepByStepSignup && (
        <>
          {isSignUp && (
            <InputClean
              type="text"
              fontType="body"
              color="b100"
              style={{ marginBottom: 12, ...inputContainerStyle }}
              onChange={onChangeName}
              value={givenName}
              placeholder={t('email_login_form_placeholder_text_first_name')}
            />
          )}
          <InputClean
            error={invalidEmailError}
            type="text"
            fontType="body"
            color="b100"
            style={{ marginBottom: 12, ...inputContainerStyle }}
            onChange={onChangeEmail}
            value={email}
            placeholder={t('email_login_form_placeholder_text_email')}
            onBlur={handleUserEmailValidation}
          />
          <InputClean
            type="password"
            fontType="body"
            color="b100"
            style={{ marginBottom: 12, ...inputContainerStyle }}
            onChange={onChangePassword}
            placeholder={t('email_login_form_placeholder_text_password')}
          />
          {showAccPrivacy && (
            <div
              className="webacc-privacy-copy"
              style={{ padding: isModalSignup && '0 10px' }}>
              {!isModalSignup && (
                <img
                  src="/static/images/webAccPrivacyCopy/lock.png"
                  alt="lock-image"
                  className="lock"
                />
              )}
              <Text type="footnote-small" color="b80">
                {t('email_login_form_never_sell_info')}
              </Text>
            </div>
          )}
          <AuraButton
            type="submit"
            style={{ height: 72, width: 280, ...buttonStyle }}
            title={btnText || t('button_log_in')}
            onClick={handleSubmit}
            textStyle={buttonTextStyle || textStyle}
            cleanStyle={cleanStyle}
            disabled={authLoading}
            disableLowOpacity={authLoading}
          />
        </>
      )}
      {isStepByStepSignup && (
        <>
          {isSignUp && user && !user.givenName && (
            <InputClean
              type="text"
              fontType="body"
              color="b100"
              style={{ marginBottom: 12, ...inputContainerStyle }}
              onChange={onChangeName}
              value={givenName}
              placeholder={t('email_login_form_placeholder_text_first_name')}
              showCheck={givenName !== ''}
            />
          )}
          {showEmailInput && (
            <InputClean
              error={invalidEmailError}
              type="text"
              fontType="body"
              color="b100"
              style={{ marginBottom: 12, ...inputContainerStyle }}
              onChange={onChangeEmail}
              value={email}
              placeholder={t('email_login_form_placeholder_text_email')}
              onBlur={handleUserEmailValidation}
              isTextWhite={true}
              showCheck={email !== '' && isValidEmail(email)}
            />
          )}
          {showPasswordInput && isValidEmail(email) && (
            <>
              <InputClean
                type="password"
                fontType="body"
                color="b100"
                style={{ marginBottom: 12, ...inputContainerStyle }}
                onChange={onChangePassword}
                placeholder={t('email_login_form_placeholder_text_password')}
                showCheck={password !== '' && password.length > 6}
              />
            </>
          )}

          {(showCTA || showPasswordInput) && (
            <>
              {showAccPrivacy && (
                <div
                  className="webacc-privacy-copy"
                  style={{ padding: isModalSignup && '0 10px' }}>
                  {!isModalSignup && (
                    <img
                      src="/static/images/webAccPrivacyCopy/lock.png"
                      alt="lock-image"
                      className="lock"
                    />
                  )}
                  <Text
                    type="footnote-small"
                    color="b80"
                    style={{ width: '100%' }}>
                    {t('email_login_form_never_sell_info')}
                  </Text>
                </div>
              )}
              <AuraButton
                type="submit"
                style={{
                  height: 72,
                  width: 280,
                  marginBottom: isModalSignup && '20px',
                }}
                title={btnText || t('button_log_in')}
                onClick={handleSubmit}
                textStyle={buttonTextStyle || textStyle}
                cleanStyle={cleanStyle}
                loading={isModalSignup && authLoading}
                disabled={authLoading}
                disableLowOpacity={!isModalSignup && authLoading}
              />
            </>
          )}
        </>
      )}
      {showForgotPassword && !isSignUp && (
        <Text
          style={
            isNoBackgroundFullWidth
              ? {
                  cursor: 'pointer',
                  color: '#5B657A',
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 400,
                  lineHeight: '17px',
                  textDecorationLine: 'underline',
                  textDecorationStyle: 'solid',
                  textDecorationSkipInk: 'none',
                  textUnderlinePosition: 'from-font',
                  marginTop: 16,
                }
              : { cursor: 'pointer', marginTop: 16 }
          }
          type="body"
          color="b64"
          align="center"
          onClick={handleForgotPassword}>
          {t('email_login_form_forgot_password')}
        </Text>
      )}
      <style jsx>{styles}</style>
    </form>
  );
}
