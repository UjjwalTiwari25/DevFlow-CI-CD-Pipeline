import css from 'styled-jsx/css';

export default css`
  .login-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 340px;
    max-width: 430px;
    padding: 24px;
    background-color: #f7fbfc;
    border-radius: 16px;
    backdrop-filter: blur(30px);
  }
  .login-card-session {
    max-width: 375px;
  }
  .close-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    height: 20px;
    width: 20px;
  }
  .close-icon svg {
    height: 20px !important;
    width: 20px !important;
  }
  .col {
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.1);
  }
  .login-signup-card {
    width: 100%;
    border-radius: 16px;
    position: relative;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .social-container {
    width: 310px;
  }
  .dark-background {
    background: rgba(255, 255, 255, 1);
  }
  .coach-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-shadow:
      5px 13px 21px -5px rgba(48, 56, 72, 0.25),
      inset 0px -1px 1px #ffffff;
  }
  .coach-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
  }
  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .existing-user-error-wrapper {
    width: 100%;
    margin-bottom: 16px;
    border-radius: 12px;
    background: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
    display: flex;
    gap: 6px;
    padding: 8px;
  }
  .existing-user-error-icon {
    min-width: 20px;
    min-height: 20px;
  }
  .error-icon {
    width: 20px;
    height: 20px;
  }

  @media only screen and (max-width: 576px) {
    .login-card {
      min-width: 0px;
      max-width: 430px;
    }
  }
`;
