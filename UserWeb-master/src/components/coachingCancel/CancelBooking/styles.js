import css from 'styled-jsx/css';

export default css`
  .container {
    padding-top: 48px;
    position: relative;
    height: 100%;
  }
  .coach-image {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    z-index: 1;
  }
  .cancel-container {
    width: 100%;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid #ffffff;
    border-radius: 16px;
    padding: 24px;
    margin-top: 44px;
    position: relative;
  }
  .bg-call-cancel {
    display: none;
  }
  .cancel-info-icon {
    width: 26px;
    height: 26px;
  }
  .cancel-button {
    position: absolute;
    bottom: 15px;
    width: 100%;
  }
  .coach-container {
    width: 131px;
    height: 131px;
  }
  .rainbow {
    position: absolute;
    width: 60%;
  }
  @media screen and (max-height: 650px) {
    .cancel-button {
      position: relative;
      bottom: 0;
      width: 100%;
    }
  }
  @media screen and (max-width: 576px) {
    .bg-call-cancel {
      display: block;
      position: absolute;
      width: 100vw;
      height: 410px;
      left: -12%;
    }
  }
  @media screen and (max-width: 425px) {
    .bg-call-cancel {
      left: 13%;
    }
  }
  @media screen and (max-width: 375px) {
    .bg-call-cancel {
      left: -10%;
    }
  }
  @media screen and (max-width: 320px) {
    .bg-call-cancel {
      left: 0%;
    }
  }
`;
