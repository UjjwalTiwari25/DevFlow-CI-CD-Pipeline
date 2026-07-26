import React, { useState } from 'react';
import classNames from 'classnames';
import useCheckWebView from '@/hooks/useCheckWebView';
import { getCommunityLogo } from '@/models/community';
import { Icon } from '@aurahealth/web-design-system';
import FacebookLoginBtn from '../FacebookLoginBtn';
import Text from '../../app/Text';
import AppleLoginBtn from '../AppleLoginBtn';
import styles from './styles';
import useThemeListener from '../../../hooks/themeListener';
import { getCoachPhoto } from '../../../models/coach';
import GoogleLoginBtn from '../clean/GoogleLoginBtn';
import EmailLoginForm from '../clean/EmailLoginForm';

export default function CoachingLoginCard({
  onSubmit,
  disableLogin,
  buttonText,
  onClose,
  style,
  loading,
  coach,
  showLoginForm,
  community,
}) {
  const [isLogin, setIsLogin] = useState(showLoginForm);
  const [isExistingUserSignUpError, setIsExistingUserSignUpError] =
    useState(false);
  const { isDark } = useThemeListener();
  const [isWebView] = useCheckWebView();

  const handleExistingUserSignUpError = () => {
    setIsExistingUserSignUpError(true);
    setIsLogin(true);
  };

  return (
    <div
      className="login-card w-100 component-shadow login-card-session"
      style={style}>
      <div className="coach-container">
        <img
          src={community ? getCommunityLogo(community) : getCoachPhoto(coach)}
          alt="aura coach"
          className="coach-image"
        />
        <Text
          type={isLogin ? 'h4-large' : 'h4'}
          weight="semibold"
          color="b100"
          style={{
            marginTop: 12,
            lineHeight: isLogin ? '23px' : '25px',
            marginBottom: isLogin ? 4 : 0,
          }}>
          {!isLogin ? 'Create Your Account' : 'Log in to Your account'}
        </Text>

        <Text
          type="body2"
          color="b64"
          style={{ color: '#5B657A', lineHeight: '18px' }}>
          Join millions of members on Aura
        </Text>
      </div>
      {isExistingUserSignUpError && isLogin && (
        <div className="existing-user-error-wrapper">
          <div className="existing-user-error-icon">
            <Icon name={Icon.LIST.BulletAllert} className="error-icon" />
          </div>
          <Text type="footnote" style={{ fontSize: 13, lineHeight: '17px' }}>
            An account with this email already exists. Please log in to continue
            or use a different email to sign up.
          </Text>
        </div>
      )}
      {onClose && (
        <div className="close-icon clickable" onClick={onClose}>
          <Icon name={Icon.LIST.ActionClose} size={Icon.SIZES.extra} />
        </div>
      )}

      <div className="align-center justify-center w-100">
        <div
          className={classNames('col login-signup-card', {
            'low-opacity': isDark,
            'dark-background': !isDark,
          })}>
          <EmailLoginForm
            inputContainerStyle={{ marginBottom: 12, width: '100%' }}
            onSubmit={onSubmit}
            isSignUp={!isLogin}
            btnText={buttonText || (isLogin ? 'Log In' : 'Create Account')}
            showForgotPassword
            loading={loading}
            isCoachingSession
            loginOnExistingUserSignUp
            onExistingUserSignUpError={handleExistingUserSignUpError}
            isNoBackgroundFullWidth
            buttonStyle={{
              width: '100%',
              height: 56,
              borderRadius: '9999px',
              background: 'linear-gradient(46deg, #4CCAFF 0%, #1DF5ED 102.13%)',
              boxShadow: '0px 24px 40px 6px rgba(56, 218, 247, 0.30)',
            }}
            buttonTextStyle={{
              fontSize: 16,
              fontWeight: 700,
              lineHeight: '22px',
              textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
            }}
          />
          <Text
            type="body2"
            color={isDark ? 'b100' : 'b100'}
            align="center"
            style={{
              marginTop: 16,
              cursor: 'pointer',
              width: isLogin ? '187px' : '100%',
              lineHeight: '18px',
            }}
            onClick={() => {
              setIsLogin(!isLogin);
            }}>
            {isLogin
              ? `Would you like to create a new account instead? `
              : 'Already have an account? '}
            <span
              style={{
                color: isDark
                  ? 'rgba(255, 255, 255, 1)'
                  : 'rgba(47, 50, 55, 1);',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </span>
          </Text>
        </div>
      </div>

      <div className="logo-container">
        <Text
          type="body2"
          color="b64"
          style={{
            marginTop: 16,
            marginBottom: 12,
            color: '#9092A3',
            fontSize: 13,
            letterSpacing: '0.1px',
          }}>
          or
        </Text>
        <div className="row" style={{ gap: 21 }}>
          {!isWebView && <GoogleLoginBtn logoOnly />}
          <FacebookLoginBtn logoOnly />
          <AppleLoginBtn logoOnly />
        </div>
      </div>

      <Text
        type="body2"
        color={isDark ? 'b64' : 'g50'}
        align="center"
        style={{
          marginTop: disableLogin ? 20 : 16,
          cursor: 'pointer',
          color: !isDark && '#9092A3',
        }}>
        By continuing, you agree to our{' '}
        <a
          href="https://www.aurahealth.io/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: isDark ? 'rgba(255,255,255,0.64)' : 'rgba(78, 84, 95, 0.5)',
            textDecoration: 'underline',
          }}>
          privacy policy
        </a>{' '}
        and{' '}
        <a
          href="https://www.aurahealth.io/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: isDark ? 'rgba(255,255,255,0.64)' : 'rgba(78, 84, 95, 0.5)',
            textDecoration: 'underline',
          }}>
          terms
        </a>
      </Text>

      <style jsx>{styles}</style>
    </div>
  );
}
