import css from 'styled-jsx/css';

export default css`
  .login-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 340px;
    max-width: 430px;
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
  .col {
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.1);
  }
  .login-signup-card {
    width: 310px;
    border-radius: 6px;
    position: relative;
  }
  .social-container {
    width: 310px;
  }
  .dark-background {
    background: rgba(255, 255, 255, 1);
  }
  .social-proof-container {
    margin-top: 32px;
    display: flex;
    justify-content: center;
  }
  .social-proof {
    filter: brightness(0.8);
  }
  @media only screen and (max-width: 576px) {
    .login-card {
      min-width: 0px;
      max-width: 430px;
    }
  }
`;
