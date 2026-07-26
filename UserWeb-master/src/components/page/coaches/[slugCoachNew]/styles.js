import css from 'styled-jsx/css';

export default css`
  .outer-wrap {
    display: flex;
    justify-content: center;
    margin: 0px 150px;
    padding-top: 40px;
  }
  .main {
    position: relative;
    background: #f7fbfc;
    min-height: 100vh;
  }
  .nav {
    max-width: 1170px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .aura-logo {
    position: relative;
    z-index: 1;
  }
  .optical-background {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100%;
  }
  .coach-info {
    margin-top: 10px;
    margin-left: 30px;
    position: relative;
    z-index: 2;
    max-width: 769px;
  }
  .info-container {
    margin-left: 56px;
  }
  .booking-coach {
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 0.81%,
        #f4f5ff 28.06%,
        #ecf8ff 69%,
        #eefffc 100%
      );
    box-shadow: 0px 8px 40px rgba(43, 42, 107, 0.1);
    border-radius: 99px;
    padding: 8px 10px 8px 22px;
    margin-top: 23px;
    width: fit-content;
  }
  .spots {
    background: linear-gradient(
      89.96deg,
      #ff4c4c 0.03%,
      #ff00b8 99.97%,
      #fc323e 99.97%,
      #fc323e 99.97%
    );
    opacity: 0.6;
    border-radius: 999px;
    padding: 3px 9px;
    margin-left: 18px;
    position: relative;
    z-index: 2;
  }
  .shadow {
    background: linear-gradient(
      89.96deg,
      #ff4c4c 0.03%,
      #ff00b8 99.97%,
      #fc323e 99.97%,
      #fc323e 99.97%
    );
    opacity: 0.5;
    filter: blur(9px);
    border-radius: 999px;
    width: 69px;
    position: absolute;
    height: 15px;
    bottom: -1px;
    left: 58%;
    transform: translate(-50%, 0%);
  }
  .spots-container {
    position: relative;
  }
  .statistics {
    margin-top: 34px;
  }
  .stats {
    margin-right: 29px;
  }
  .stats-mobile {
    margin-top: 2px;
  }
  .country-row {
    margin-top: 4px;
  }
  .hr {
    width: 100%;
    margin-top: 0px;
    margin-bottom: 0px;
    border: none;
    height: 1px;
    background: #9092a3;
    opacity: 0.2;
  }
  .tab {
    margin-top: 22px;
    padding-bottom: 22px;
    margin-right: 72px;
    position: relative;
  }
  .tabs-container {
    position: relative;
    z-index: 2;
  }
  .tabs-container-fixed {
    position: fixed;
    top: 0px;
    z-index: 3;
    width: 100%;
    background: #fff;
  }
  .underline-black {
    background: #2f3237;
    height: 3px;
    border-radius: 99px;
    width: 100%;
    position: absolute;
    bottom: 0px;
  }
  .coach-image {
    height: 300px;
    width: 300px;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    overflow: hidden;
  }
  .nav-coach {
    margin-right: 50px;
  }
  .signin-button {
    display: flex;
    justify-content: flex-end;
    position: relative;
    z-index: 2;
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }
  @media screen and (max-width: 1024px) {
    .outer-wrap {
      margin: 0px 50px;
    }
  }
  @media screen and (max-width: 768px) {
    .booking-coach {
      flex-direction: column;
      align-items: center;
      padding: 11px 22px 11px 22px;
    }
    .spots-container {
      width: 100%;
    }
    .spots {
      margin-left: 0px;
      margin-top: 6px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .background-live {
      max-width: 444px;
    }
    .tab {
      margin-right: 30px;
    }
    .outer-wrap {
      margin: 0px 20px;
    }
    .coach-info {
      flex-direction: column;
      align-items: center;
      margin-left: 0px;
    }
    .coach-image {
      width: 200px;
      height: 200px;
    }
    .info-container {
      margin-left: 0px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  @media screen and (max-width: 576px) {
    .tabs {
      overflow: auto;
    }
    .coach-mobile-view {
      width: 223px;
      height: 223px;
      border-radius: 50%;
      overflow: hidden;
    }
    .booking-coach {
      flex-direction: row;
      align-items: center;
      padding: 11px 22px 11px 22px;
      width: 100%;
      justify-content: space-between;
    }
    .spots-container {
      width: fit-content;
      margin-top: -8px;
    }
    .tab {
      margin-right: 26px;
    }
    .outer-wrap {
      padding-top: 10px;
      margin: 0px 32px;
    }
    .statistics {
      margin-top: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .stats {
      margin-left: 14px;
      margin-right: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .nav-coach {
      margin-right: 0px;
      margin-left: 10px;
    }
    .nav-coach-photo {
      margin-left: 16px;
    }
    .tabs {
      padding-left: 32px;
    }
    .zero-padding {
      padding-left: 0px;
    }
  }
`;
