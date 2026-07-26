import css from 'styled-jsx/css';

export default css`
  .main {
    margin-top: 38px;
    padding: 0px 11px;
  }
  .coach-background {
    width: 418px;
    height: 225px;
  }
  .coach-image-wrapper {
    position: relative;
    overflow: hidden;
    height: 225px;
  }
  .coach-image {
    position: absolute;
    width: 233px;
    top: 20px;
    left: 50%;
    transform: translate(-50%, 0%);
  }
  .live-button {
    margin-top: 45px;
    width: 80px;
    height: 32px;
    background: #ffffff;
    opacity: 0.95;
    border-radius: 7.71429px;
    position: relative;
    z-index: 2;
  }
  .background-gradient {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 100%;
    height: 100%;
  }
  .coach-thumbnail {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .coach-container {
    margin-top: 42px;
  }
  @media screen and (max-width: 576px) {
    .coach-image-wrapper {
      height: 185px;
    }
    .coach-background {
      width: 100vw;
      height: auto;
    }
    .coach-image {
      width: 190px;
      top: 10px;
    }
    .live-button {
      width: 63px;
      height: 25px;
      margin-top: 22px;
    }
    .hr {
      height: 1px;
      background: rgba(0, 0, 0, 0.2);
      border: none;
      width: 80vw;
      margin-top: 14px;
    }
    .coach-container {
      margin-top: 16px;
    }
    .main {
      margin-top: 8px;
    }
  }
`;
