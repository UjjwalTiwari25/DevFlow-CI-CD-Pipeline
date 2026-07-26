import React from 'react';
import { FaApple } from 'react-icons/fa';
import Auth from '../../services/Auth';
import useToastMessage from '../../hooks/toastMessage';
import Text from '../app/Text';

export default function AppleLoginBtn({
  btnText,
  style,
  iconStyle,
  textStyle,
  showErrorToasts = true,
  logoOnly,
  useWhiteTheme,
}) {
  const Toast = useToastMessage();

  async function onClickBtn() {
    Auth.AppleProvider.addScope('email, name');
    try {
      await Auth.signInWithPopup(
        Auth.instance,
        Auth.AppleProvider,
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
            src="/static/images/coachingSession/apple-logo.png"
            alt="aura"
            className="logo"
          />
        </div>
      ) : (
        <div
          id="apple-btn"
          className="clickable"
          style={style}
          onClick={onClickBtn}>
          {!useWhiteTheme ? (
            <div className="apple-icon">
              <FaApple style={iconStyle} />
            </div>
          ) : (
            <img
              src="/static/images/coachingSession/darkAppleLogo.png"
              alt="aura"
              className="logo"
              style={iconStyle}
            />
          )}
          <Text
            type="subtitle"
            color="w100"
            weight="regular"
            align="center"
            style={{
              flexGrow: 0.6,
              ...textStyle,
            }}>
            {btnText || 'Continue with Apple'}
          </Text>
        </div>
      )}
      <style jsx>{`
        #apple-btn {
          width: 100%;
          height: 40px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0);
          background-color: rgba(0, 0, 0);
          border: 1px solid #4267b2;
          border-radius: 20px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
          white-space: nowrap;
          overflow: hidden;
          background-clip: padding-box;
        }
        .apple-icon {
          margin-top: 2px;
          font-size: 20px;
          color: white;
        }
        .logo {
          width: 20px;
          height: 25px;
        }
        .logo-background {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.1);
          background: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </>
  );
}
