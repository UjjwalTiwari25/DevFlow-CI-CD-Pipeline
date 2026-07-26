import css from 'styled-jsx/css';

export default css`
  .main {
    padding-top: 38px;
    position: relative;
  }
  .circle {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.15;
    max-height: 1500px;
    top: -50px;
    max-width: 1500px;
    left: 50%;
    transform: translate(-50%, 0%);
  }
  .hr {
    width: 1050px;
    margin-top: 0px;
    margin-bottom: 0px;
    border: none;
    height: 1px;
    background: #9092a3;
    opacity: 0.2;
  }
  .info-container {
    border-radius: 16.8571px;
    background: rgba(255, 255, 255, 0.75);
    padding: 22px 28px;
    width: 328px;
    margin-right: 15px;
    height: 236px;
    border: 1px solid rgba(255, 255, 255, 0);
  }
  .container {
    position: relative;
    z-index: 2;
  }
  .info-main {
    margin-top: 42px;
    max-width: 1030px;
  }
  .icon {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
  .icon-list {
    margin-top: 12px;
  }
  .coach-image-container {
    position: relative;
    width: 692px;
  }
  .selection-container {
    background: #ffffff;
    box-shadow: 0px 4px 20px rgba(43, 42, 107, 0.15);
    border-radius: 8px;
    padding: 10px;
    margin-right: 13px;
  }
  .dropdown {
    margin-top: 24px;
  }
  .live-session-container {
    margin-top: 58px;
    margin-bottom: 42px;
  }
  .live-session-container-2 {
    margin-top: 50px;
    margin-bottom: 42px;
    position: relative;
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
    padding: 3px 6px;
    margin-left: 18px;
    position: relative;
    z-index: 2;
    height: 19px;
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
    left: 50%;
    transform: translate(-50%, 0%);
  }
  .spots-container {
    position: relative;
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
    padding: 11px 10px 11px 22px;
    margin-top: 23px;
    width: fit-content;
  }
  .access-row {
    width: 712px;
  }
  .heading {
    display: block;
  }
  .heading-mobile {
    display: none;
  }
  @media screen and (min-width: 576px) {
    .live-session-background {
      display: none;
    }
  }
  @media screen and (max-width: 1024px) {
    .hr {
      width: 100%;
    }
  }
  @media screen and (max-width: 768px) {
    .info-live {
      align-items: center;
    }
    .access-row {
      width: 300px;
    }
  }
  @media screen and (max-width: 576px) {
    .access-row {
      display: none;
    }
    .heading {
      display: none;
    }
    .heading-mobile {
      display: block;
    }
    .main {
      padding-top: 30px;
    }
    .info-main {
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
      margin-top: 16px;
    }
    .coach-values {
      background-image: url('/static/images/newCoach/bookingBackground.png');
      background-repeat: no-repeat;
      background-size: cover;
      margin-left: 32px;
      margin-right: 32px;
      border: 1px solid #ffffff;
      border-radius: 8px;
      padding: 13px 9px;
    }
    .coach-mobile-image {
      width: 74px;
      height: 74px;
      border-radius: 50%;
      margin-left: 20px;
    }
    .coach-mobile-image-container {
      position: relative;
      margin-right: 12px;
    }
    .coach-value-graph {
      position: absolute;
      left: 11px;
      bottom: -7px;
    }
    .live-session-background {
      width: 100%;
      height: 400px;
      position: absolute;
    }
    .info-container {
      width: 288px;
      margin-right: 12px;
      margin-top: 10px;
      height: 230px;
      padding: 18px 23px;
    }
    .live-session-container {
      padding: 0px 32px;
      position: relative;
      z-index: 2;
      margin-top: 40px;
      margin-bottom: 0px;
    }
    .live-session-container-2 {
      position: relative;
      z-index: 2;
      margin-top: 42px;
      margin-bottom: 0px;
      align-items: flex-start;
      padding: 0px 32px;
    }
    .dropdown {
      margin-top: 12px;
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
    }
    .only-left-padding {
      padding: 0px;
      padding-left: 32px;
    }
    .circle {
      display: none;
    }
  }
`;
