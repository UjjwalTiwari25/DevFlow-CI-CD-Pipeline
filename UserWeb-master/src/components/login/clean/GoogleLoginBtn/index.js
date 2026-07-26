import classNames from 'classnames';
import React from 'react';
import useThemeListener from '../../../../hooks/themeListener';
import useToastMessage from '../../../../hooks/toastMessage';
import Auth from '../../../../services/Auth';
import Text from '../../../app/Text';
import styles from './styles';

export default function GoogleLoginBtn({
  btnText,
  style,
  iconStyle,
  textStyle,
  showErrorToasts = true,
  isCoachingSession,
  logoOnly,
}) {
  const Toast = useToastMessage();
  const { isDark } = useThemeListener();
  async function onClickBtn() {
    Auth.GoogleProvider.addScope(
      'https://www.googleapis.com/auth/userinfo.email'
    );
    try {
      await Auth.signInWithPopup(
        Auth.instance,
        Auth.GoogleProvider,
        Auth.browserPopupRedirectResolver
      );
      // Successful login/signup will trigger the auth listener which handles the next steps
    } catch (error) {
      if (showErrorToasts) {
        Toast.showError(error.message);
      }
    }
  }

  return (
    <>
      {logoOnly ? (
        <div
          className="row align-center justify-center logo-background clickable"
          onClick={onClickBtn}>
          <img
            src="/static/images/coachingSession/google-logo.png"
            alt="aura"
            className="logo"
          />
        </div>
      ) : (
        <div
          className={classNames('clickable google-btn', {
            'low-opacity': isDark,
            'custom-google-btn': isCoachingSession,
          })}
          style={style}
          onClick={onClickBtn}>
          <img
            id="google-icon"
            src="/static/images/icons/google.png"
            alt="Google icon"
            style={iconStyle}
          />
          <Text
            type={isCoachingSession ? 'body2' : 'subtitle'}
            color={isDark ? 'b100' : 'b64'}
            weight="regular"
            align="center"
            style={{
              flexGrow: isCoachingSession ? 0.2 : 0.6,
              ...textStyle,
            }}>
            {btnText || 'Continue with Google'}
          </Text>
        </div>
      )}
      <style jsx>{styles}</style>
    </>
  );
}
