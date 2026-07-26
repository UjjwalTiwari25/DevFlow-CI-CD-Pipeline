import React from 'react';
import Auth from '../../services/Auth';
import useToastMessage from '../../hooks/toastMessage';
import Text from '../app/Text';

export default function GoogleLoginBtn({
  btnText,
  style,
  iconStyle,
  textStyle,
  showErrorToasts = true,
}) {
  const Toast = useToastMessage();
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
    <div
      id="google-btn"
      className="clickable"
      style={style}
      onClick={onClickBtn}>
      <img
        id="google-icon"
        src="/static/images/icons/google.png"
        alt="Google icon"
        style={iconStyle}
      />
      <Text
        type="subtitle"
        color="b64"
        weight="regular"
        align="center"
        style={{
          flexGrow: 0.6,
          ...textStyle,
        }}>
        {btnText || 'Continue with Google'}
      </Text>
      <style jsx>{`
        #google-btn {
          width: 100%;
          height: 40px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          background: rgb(255, 255, 255);
          border: 1px solid rgb(212, 212, 212);
          border-radius: 20px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
          white-space: nowrap;
          overflow: hidden;
          background-clip: padding-box;
        }
        #google-icon {
          width: 22px;
          height: 22px;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}
