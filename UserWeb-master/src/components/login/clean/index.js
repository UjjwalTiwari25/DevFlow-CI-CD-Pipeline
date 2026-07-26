import React, { Fragment, useState } from 'react';
import { MdClose } from 'react-icons/md';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import { Trans } from 'react-i18next';
import { getLocaleImage } from '@/models/locale';
import useCheckWebView from '@/hooks/useCheckWebView';
import FacebookLoginBtn from '../FacebookLoginBtn';
import EmailLoginForm from './EmailLoginForm';
import Text from '../../app/Text';
import AppleLoginBtn from '../AppleLoginBtn';
import styles from './styles';
import GoogleLoginBtn from './GoogleLoginBtn';
import useThemeListener from '../../../hooks/themeListener';

export default function LoginCard({
  header,
  onSubmit,
  disableLogin,
  disableSignup,
  showGoogleLogin,
  hideCard,
  buttonText,
  onClose,
  style,
  disableSocial,
  isModalSignup,
  hide,
  user,
}) {
  const [isLogin, setIsLogin] = useState(disableSignup);
  const [showDetails, setShowDetails] = useState(false);
  const { isDark } = useThemeListener();
  const { t, currentLocale } = useTranslations();
  const [isWebView] = useCheckWebView();
  const canShowGoogleLogin = showGoogleLogin && !isWebView && !disableSocial;

  return (
    <div
      className={classNames('login-card w-100', {
        'card component-shadow': !hideCard,
      })}
      style={style}>
      {onClose && (
        <div className="close-icon clickable" onClick={onClose}>
          <MdClose />
        </div>
      )}
      <div className="social-container">
        {canShowGoogleLogin && <GoogleLoginBtn />}
        {!disableSocial && (
          <Fragment>
            <FacebookLoginBtn style={{ marginBottom: 12 }} />
            <AppleLoginBtn />
          </Fragment>
        )}
        {canShowGoogleLogin && (
          <>
            <Text
              color="b24"
              type="body"
              align="center"
              style={{
                margin: '16px 16px 6px 16px',
              }}>
              {t('onboarding_signup_form_text_or')}
            </Text>
            <Text
              color="b64"
              type="body"
              align="center"
              style={{ marginBottom: 16 }}>
              {isLogin
                ? t('onboarding_signup_form_log_in_account')
                : t('onboarding_signup_form_create_account')}
            </Text>
          </>
        )}
      </div>
      <div
        className="col align-center justify-center"
        style={{ minWidth: 250 }}>
        {header && (
          <Text
            type="h4"
            color="b100"
            align="center"
            style={{ marginBottom: 24 }}>
            {header}
          </Text>
        )}
        <div
          className={classNames('login-signup-card', {
            'low-opacity': isDark,
            'dark-background': !isDark,
          })}
          style={disableLogin ? { paddingBottom: 16 } : {}}>
          <div className="background" />
          <EmailLoginForm
            inputContainerStyle={{ marginBottom: 8 }}
            onSubmit={onSubmit}
            isSignUp={!isLogin}
            btnText={buttonText || (isLogin ? 'Sign In' : 'Sign Up')}
            showForgotPassword
            showAccPrivacy={true}
            isStepByStepSignup={true}
            setShowDetails={setShowDetails}
            isModalSignup={isModalSignup}
            hide={hide}
            user={user}
          />
          {showGoogleLogin && isWebView && !disableSocial && (
            <Text
              type="footnote-small"
              color={'b100'}
              align="center"
              style={{
                marginTop: 12,
                maxWidth: 170,
              }}>
              {t('text_open_browser_to_login')}
            </Text>
          )}
          {!disableLogin && !disableSignup && showDetails && (
            <Text
              type="body"
              color={isDark ? 'b100' : 'g100'}
              align="center"
              style={{
                marginBottom: 16,
                cursor: 'pointer',
              }}
              onClick={() => {
                setIsLogin(!isLogin);
              }}>
              {isLogin
                ? t('onboarding_signup_form_dont_have_account')
                : t('onboarding_signup_form_already_have_account')}
              <span
                style={{
                  color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(78,84,95,1)',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}>
                {isLogin ? t('button_sign_up') : t('button_log_in')}
              </span>
            </Text>
          )}
        </div>
      </div>
      {!isLogin && showDetails && (
        <Text
          type="body"
          color={isDark ? 'b64' : 'g50'}
          align="center"
          style={{
            marginTop: disableLogin ? 20 : 12,
            cursor: 'pointer',
            width: 270,
            fontSize: isModalSignup && '13px',
            lineHeight: isModalSignup && '16px',
          }}>
          <Trans
            ns="signup"
            i18nKey="onboarding_signup_form_policy_and_terms"
            components={[
              <a
                key="privacy-policy"
                href={t('privacy_policy_link')}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: isDark
                    ? 'rgba(255,255,255,0.64)'
                    : 'rgba(78, 84, 95, 0.5)',
                  textDecoration: 'underline',
                }}></a>,
              <a
                key="terms"
                href={t('terms_of_service_link')}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: isDark
                    ? 'rgba(255,255,255,0.64)'
                    : 'rgba(78, 84, 95, 0.5)',
                  textDecoration: 'underline',
                }}></a>,
            ]}
          />
        </Text>
      )}
      {!isModalSignup && (
        <div className="social-proof-container">
          <img
            src={getLocaleImage(
              '/static/images/signUpSocialProofs/best-of-apps-winner.png',
              currentLocale
            )}
            alt="best of apps"
            style={{ width: '94px', height: '69px', marginRight: '16px' }}
            className="social-proof"
          />
          <img
            src={getLocaleImage(
              '/static/images/signUpSocialProofs/award-2023-winner.png',
              currentLocale
            )}
            alt="award winner"
            style={{ width: '100px', height: '67px' }}
            className="social-proof"
          />
        </div>
      )}

      <style jsx>{styles}</style>
    </div>
  );
}
