import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { MdClose } from 'react-icons/md';
import useCheckWebView from '@/hooks/useCheckWebView';
import useTranslations from '@/hooks/translations';
import GoogleLoginBtn from './GoogleLoginBtn';
import FacebookLoginBtn from './FacebookLoginBtn';
import EmailLoginForm from './EmailLoginForm';
import Text from '../app/Text';
import AppleLoginBtn from './AppleLoginBtn';

export default function LoginCard({
  header,
  onSubmit,
  disableLogin,
  disableSignup,
  disableSocial,
  hideCard,
  buttonText,
  onClose,
  style,
  useWhiteTheme,
}) {
  const [isLogin, setIsLogin] = useState(disableSignup);
  const [isWebView] = useCheckWebView();
  const { t } = useTranslations();

  const whiteSocialButtonTextStyle = {
    fontSize: 14,
    color: 'rgb(47, 50, 55)',
    fontWeight: 600,
    flexGrow: 'unset',
    height: 'auto',
    letterSpacing: 'unset',
    textTransform: 'unset',
    marginLeft: '8px',
  };

  const whiteSocialButtonStyle = {
    marginBottom: '12px',
    height: '50px',
    boxShadow: 'rgba(43, 42, 107, 0.1) 0px 8px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgb(255, 255, 255)',
    color: 'grey',
    width: '100%',
    border: 'thin solid rgb(239, 239, 239)',
    overflow: 'hidden',
    borderRadius: '30px',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      className={classNames(
        `${!hideCard && 'card component-shadow'} login-card w-100`,
        {
          'white-theme-login-card': useWhiteTheme,
        }
      )}
      style={style}>
      {onClose && (
        <div className="close-icon clickable" onClick={onClose}>
          <MdClose />
        </div>
      )}
      <div
        className="col align-center justify-center white-theme-content"
        style={
          useWhiteTheme ? { width: '100%', minWidth: 250 } : { minWidth: 250 }
        }>
        {header && (
          <Text
            type="h4"
            align="center"
            style={
              useWhiteTheme
                ? {
                    fontSize: 20,
                    color: 'rgb(47, 50, 55)',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    paddingBottom: '1rem',
                  }
                : { marginBottom: 24, color: 'rgba(47, 50, 55, 1)' }
            }>
            {isLogin ? header : `Let's create your account`}
          </Text>
        )}
        {!disableSocial && (
          <Fragment>
            {!isWebView && (
              <GoogleLoginBtn
                style={
                  useWhiteTheme ? whiteSocialButtonStyle : { marginBottom: 12 }
                }
                textStyle={
                  useWhiteTheme
                    ? whiteSocialButtonTextStyle
                    : { color: 'rgba(47,50,55,.64)' }
                }
                iconStyle={useWhiteTheme && { height: 20, width: 'auto' }}
              />
            )}
            <FacebookLoginBtn
              style={
                useWhiteTheme ? whiteSocialButtonStyle : { marginBottom: 12 }
              }
              iconStyle={useWhiteTheme && { height: 20, width: 'auto' }}
              textStyle={
                useWhiteTheme
                  ? whiteSocialButtonTextStyle
                  : { color: 'rgba(255,255,255,1)' }
              }
              useWhiteTheme={useWhiteTheme}
            />
            <AppleLoginBtn
              style={
                useWhiteTheme
                  ? { ...whiteSocialButtonStyle, marginBottom: 0 }
                  : {}
              }
              textStyle={
                useWhiteTheme
                  ? whiteSocialButtonTextStyle
                  : { color: 'rgba(255,255,255,1)' }
              }
              iconStyle={useWhiteTheme && { height: 20, width: 'auto' }}
              useWhiteTheme={useWhiteTheme}
            />
            <Text
              type="body"
              align="center"
              style={
                useWhiteTheme
                  ? {
                      marginTop: 25,
                      marginBottom: 15,
                      color: 'rgba(47, 50, 55, 0.6)',
                      fontWeight: 400,
                      fontSize: '1rem',
                    }
                  : { margin: 16, color: 'rgba(47, 50, 55, 0.24)' }
              }>
              {useWhiteTheme &&
                (isLogin ? 'Or Log In With Email' : `Or Sign Up With Email`)}
              {!useWhiteTheme && 'OR'}
            </Text>
          </Fragment>
        )}
        <EmailLoginForm
          inputContainerStyle={{ marginBottom: 8 }}
          inputStyle={{
            backgroundColor: '#EEF2F3',
            borderColor: '#EEF2F3',
          }}
          onSubmit={onSubmit}
          isSignUp={!isLogin}
          btnText={buttonText || (isLogin ? 'Sign In' : 'Sign Up')}
          showForgotPassword
          useWhiteTheme={useWhiteTheme}
        />
        {!disableLogin && !disableSignup && (
          <Text
            type="body2"
            align="center"
            style={{
              marginTop: 16,
              cursor: 'pointer',
              color: 'rgba(47, 50, 55, 0.64)',
            }}
            onClick={() => {
              setIsLogin(!isLogin);
            }}>
            {isLogin ? `Don't have an account? ` : 'Already have an account? '}
            <span style={{ color: '#03a9f4' }}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </span>
          </Text>
        )}
        {isWebView && (
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
      </div>
      {!isLogin && (
        <Text
          type="footnote"
          align="center"
          style={{
            marginTop: disableLogin ? 20 : 12,
            cursor: 'pointer',
            color: 'rgba(47, 50, 55, 0.64)',
          }}>
          By continuing, you agree to our{' '}
          <a
            href="https://www.aurahealth.io/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#03a9f4', fontWeight: 900 }}>
            privacy policy
          </a>{' '}
          and{' '}
          <a
            href="https://www.aurahealth.io/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#03a9f4', fontWeight: 900 }}>
            terms
          </a>
        </Text>
      )}
      <style jsx>{`
        .login-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-width: 340px;
          max-width: 430px;
        }
        .white-theme-login-card {
          max-width: 380px;
          padding: 1.5rem;
        }
        .white-theme-content {
          text-align: center !important;
          padding-right: 15px;
          padding-left: 15px;
        }
        .close-icon {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 26px;
          text-align: right;
          align-self: flex-end;
          color: rgba(0, 0, 0, 0.6);
        }
        @media only screen and (max-width: 576px) {
          .login-card {
            min-width: 0px;
            max-width: 430px;
          }
        }
      `}</style>
    </div>
  );
}
