import React from 'react';
import { FaFacebookF } from 'react-icons/fa';
import Auth from '../../services/Auth';
import useToastMessage from '../../hooks/toastMessage';
import Text from '../app/Text';

export default function FacebookLoginBtn({
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
    Auth.FacebookProvider.addScope('public_profile, email');
    try {
      await Auth.signInWithPopup(
        Auth.instance,
        Auth.FacebookProvider,
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
            src="/static/images/coachingSession/fb-logo.png"
            alt="aura"
            className="logo"
          />
        </div>
      ) : (
        <div
          id="facebook-btn"
          className="clickable"
          style={style}
          onClick={onClickBtn}>
          {!useWhiteTheme ? (
            <div className="facebook-icon">
              <FaFacebookF style={iconStyle} />
            </div>
          ) : (
            <img
              src="/static/images/coachingSession/fb-logo.png"
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
            {btnText || 'Continue with Facebook'}
          </Text>
        </div>
      )}
      <style jsx>{`
        #facebook-btn {
          width: 100%;
          height: 40px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          background: #3b5998;
          background-color: #3b5998;
          border: 1px solid #4267b2;
          border-radius: 20px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
          white-space: nowrap;
          overflow: hidden;
          background-clip: padding-box;
        }
        .facebook-icon {
          font-size: 18px;
          color: white;
          margin-top: 6px;
          margin-left: 6px;
        }
        .logo {
          width: 25px;
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
