import React from 'react';
import { isValidEmail } from '../../utils/validators';
import Input from '../app/Input';
import AuraButton from '../app/AuraButton';
import Text from '../app/Text';
import useEmailLogin from '../../hooks/emailLogin';

export default function EmailLoginForm({
  isSignUp,
  onSubmit,
  loginOnExistingUserSignUp,
  btnStyle,
  btnText,
  showForgotPassword = true,
  showErrorToasts = true,
  useWhiteTheme,
}) {
  const {
    onChangeEmail,
    onChangeName,
    onChangePassword,
    handleSubmit,
    handleForgotPassword,
    email,
    givenName,
  } = useEmailLogin({
    showErrorToasts,
    isSignUp,
    isValidEmail,
    onSubmit,
    loginOnExistingUserSignUp,
  });

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {isSignUp && (
        <Input
          type="text"
          fontType="body"
          style={
            useWhiteTheme
              ? { marginBottom: 8, width: '100%' }
              : { marginBottom: 12, color: 'rgba(47,50,55,1)' }
          }
          onChange={onChangeName}
          value={givenName}
          placeholder="First Name"
          useWhiteTheme={useWhiteTheme}
        />
      )}
      <Input
        type="text"
        fontType="body"
        style={
          useWhiteTheme
            ? { marginBottom: 8, width: '100%' }
            : { marginBottom: 12, color: 'rgba(47,50,55,1)' }
        }
        onChange={onChangeEmail}
        value={email}
        placeholder="Email"
        useWhiteTheme={useWhiteTheme}
      />
      <Input
        type="password"
        fontType="body"
        style={
          useWhiteTheme
            ? { marginBottom: 8, width: '100%' }
            : { marginBottom: 12, color: 'rgba(47,50,55,1)' }
        }
        onChange={onChangePassword}
        placeholder="Password"
        useWhiteTheme={useWhiteTheme}
      />
      <AuraButton
        type="submit"
        textType="cta"
        style={
          useWhiteTheme
            ? {
                width: '100%',
                background:
                  'linear-gradient(270deg, rgb(29, 245, 237) -3.23%, rgb(76, 202, 255) 95.81%)',
                boxShadow: 'rgb(76, 202, 255) 0px 10px 25px -2px',
                marginTop: 12,
                fontSize: 18,
                fontWeight: 700,
                textShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 9px',
                height: '60px',
                border: '1px',
                borderRadius: '30px',
                ...btnStyle,
              }
            : {
                height: 40,
                width: '100%',
                ...btnStyle,
              }
        }
        title={btnText || 'Log In'}
        onClick={handleSubmit}
      />
      {showForgotPassword && !isSignUp && (
        <Text
          style={{
            cursor: 'pointer',
            marginTop: 16,
            color: 'rgba(47,50,55,0.64)',
            fontSize: 16,
            lineHeight: '24px',
            fontWeight: 400,
          }}
          type="body"
          align="center"
          onClick={handleForgotPassword}>
          Forgot your password?
        </Text>
      )}
      <style jsx>
        {`
          .form-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </form>
  );
}
