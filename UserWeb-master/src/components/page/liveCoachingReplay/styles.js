import css from 'styled-jsx/css';

export default css`
  .outer-wrap {
    margin: 0px 150px;
    padding-top: 40px;
    z-index: 1;
  }
  .main {
    position: relative;
    background: #f7fbfc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .nav {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .optical-background {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
  }
  .signin-button {
    display: flex;
    justify-content: flex-end;
    position: relative;
    z-index: 2;
  }
  .background-congrats {
    position: fixed;
    height: 100vh;
  }
  .arrow {
    width: 7px;
    height: 13px;
    margin-top: 5px;
  }
  .row-container {
    position: absolute;
    bottom: -50px;
    left: 10px;
    z-index: 3;
  }
  .aura {
    position: relative;
    display: flex;
    flex-direction: column;
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
  .card-container {
    margin-top: 38px;
    padding: 0px 11px;
  }
  .qr-code {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  @media screen and (max-width: 1024px) {
    .outer-wrap {
      margin: 0px 50px;
    }
  }
  @media screen and (max-width: 768px) {
    .outer-wrap {
      margin: 0px 20px;
    }
  }
  @media screen and (max-width: 576px) {
    .outer-wrap {
      padding-top: 10px;
    }
    .aura {
      flex-direction: row;
      align-items: center;
    }
    .row-container {
      position: relative;
      margin-left: 20px;
      bottom: 0px;
      left: 0px;
    }
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
    .card-container {
      margin-top: 8px;
    }
  }
`;
