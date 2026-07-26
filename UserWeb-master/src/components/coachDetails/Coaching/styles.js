import css from 'styled-jsx/css';

export default css`
  .main {
    position: relative;
    z-index: 2;
    margin-bottom: 38px;
    margin-top: 38px;
  }
  .coach-booking {
    margin-top: 0;
    max-width: 318px;
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
    bottom: 0px;
    right: 0px;
  }
  .spots-container {
    position: relative;
  }
  .mobile-frame {
    position: relative;
    width: 424px;
  }
  .call-frame {
    position: absolute;
    left: 161px;
    bottom: 0px;
    z-index: 2;
  }
  .call-frame-3 {
    position: absolute;
    bottom: 0px;
    left: 161px;
    z-index: 2;
  }
  .call-frame-background {
    position: absolute;
    left: 79px;
    bottom: 0px;
    background: white;
    border-radius: 16px 16px 0px 0px;
  }
  .call-frame-2 {
    z-index: 2;
    position: relative;
    top: 4px;
  }
  .call-frame-background-2 {
    position: absolute;
    right: 13px;
    top: 88px;
    border-radius: 16px 16px 0px 0px;
    overflow: hidden;
  }
  .mobile-frame-container {
    position: relative;
    z-index: 6;
  }
  .coach-image {
    position: absolute;
    bottom: 0px;
    z-index: 1;
    height: 250px;
    width: auto;
    left: 50%;
    transform: translate(-50%, 0px);
  }
  .access-container {
    width: 100%;
    overflow: hidden;
  }
  .call-person {
    border-radius: 6px;
    z-index: 6;
    position: absolute;
    background: #4e545f;
    top: 110px;
    right: 25px;
    display: flex;
    flex-direction: column;
    width: 60px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .call-person-icon {
    width: 50px;
    height: 46px;
  }
  .coach-detail {
    position: absolute;
    z-index: 8;
    top: 47px;
    left: 93px;
    width: 152px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .coach-image-small {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    margin-bottom: 6px;
  }
  .coach-icon-smaller {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .chat-box-white {
    border-radius: 7px;
    padding: 6px 8px;
    max-width: 115px;
    background: #fff;
  }
  .user-left {
    background: linear-gradient(95.34deg, #3eeae4 -30.9%, #03a9f4 116.53%);
    border-radius: 7px;
    padding: 6px 8px;
    max-width: 115px;
    margin-top: 8px;
  }
  .right-container {
    justify-content: flex-end;
  }
  .graph-box {
    border-radius: 7px;
    width: 100%;
    background: #fff;
  }
  .graph-cir {
    width: 64px;
    height: 64px;
    margin-top: 5px;
    margin-right: 10px;
    margin-left: 5px;
  }
  .margin-10 {
    margin-top: 8px;
    width: 100%;
  }
  .hr {
    width: 80%;
    margin-top: 0px;
    margin-bottom: 0px;
    border: none;
    height: 1px;
    background: #9092a3;
    opacity: 0.2;
  }
  .hr-mobile {
    display: none;
  }
  .membership {
    margin-top: 62px;
  }
  .spots-large {
    background: linear-gradient(
      89.96deg,
      #ff4c4c 0.03%,
      #ff00b8 99.97%,
      #fc323e 99.97%,
      #fc323e 99.97%
    );
    opacity: 0.6;
    border-radius: 999px;
    padding: 7px 12px;
    position: relative;
    z-index: 2;
    height: 20px;
  }
  .margin-top-line {
    margin-top: 54px;
  }
  .coaching-bottom {
    margin-top: 89px;
    margin-bottom: 40px;
  }
  .info-main {
    position: relative;
  }
  .coaching-session-heading {
    display: none;
  }
  .coaching-shadow {
    position: absolute;
    width: 100vw;
    height: 600px;
    top: -100px;
  }
  .footer {
    margin-top: 114px;
  }
  .mobile-background {
    display: none;
  }
  .speciality-wrapper {
    display: none;
  }
  .mobile-frame-wrapper {
    display: none;
  }
  .mobile-spots-wrapper {
    display: none;
  }
  .membership-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .coaching-sessions-mobile {
    display: none;
  }
  @media screen and (max-width: 1024px) {
    .coaching-shadow {
      width: 100vw;
    }
  }
  @media screen and (max-width: 576px) {
    .coaching-session-heading {
      display: block;
    }
    .coaching-sessions-mobile {
      display: block;
    }
    .info-main {
      display: none;
    }
    .membership-wrapper {
      display: none;
    }
    .booking-coach {
      display: none;
    }
    .hr {
      display: none;
    }
    .hr-mobile {
      width: 80%;
      margin-top: 0px;
      margin-bottom: 0px;
      border: none;
      height: 1px;
      background: #9092a3;
      opacity: 0.2;
    }
    .mobile-spots-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .access-container {
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 16px;
      position: relative;
      padding: 16px;
    }
    .mobile-frame-wrapper {
      overflow: hidden;
      margin-left: 0px;
      width: 310px;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .wrapper-mobile-background {
      width: 110px;
    }
    .mobile-frame {
      display: none;
    }
    .coach-detail {
      left: 55px;
      top: 35px;
      width: 106px;
    }
    .coach-booking {
      margin-top: 20px;
    }
    .main {
      padding: 29px;
      position: relative;
      margin-top: 0px;
      margin-bottom: 0px;
      align-items: flex-start;
    }
    .call-frame-background {
      width: 129px;
      left: 42px;
      bottom: -20px;
    }
    .chat-box-white {
      max-width: 75px;
    }
    .user-left {
      max-width: 66px;
      margin-top: 2px;
    }
    .graph-cir {
      width: 30px;
      height: 30px;
    }
    .margin-10 {
      margin-top: 2px;
      margin-top: 2px;
    }
    .coach-image-small {
      margin-bottom: 2px;
    }
    .coach-icon-smaller {
      margin-right: 2px;
      width: 12px;
      height: 12px;
    }
    .call-frame {
      width: 172px;
      left: 108px;
    }
    .call-frame-2 {
      width: 184px;
    }
    .call-frame-background-2 {
      right: 45px;
      top: 58px;
    }
    .coach-image {
      height: 161px;
      width: auto;
    }
    .call-person {
      width: 36px;
      height: 49px;
      top: 80px;
      right: 50px;
    }
    .call-person-icon {
      width: 33px;
      height: 31px;
    }
    .mobile-background {
      display: flex;
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
    }
    .speciality {
      background: #fff;
      border: 1px solid rgba(144, 146, 163, 0.2);
      border-radius: 8px;
      padding: 10px;
      margin-top: 4px;
      margin-right: 4px;
    }
    .speciality-container {
      flex-wrap: wrap;
      margin-bottom: 34px;
      position: relative;
    }
    .spots-container {
      margin-top: 12px;
    }
    .footer {
      margin-top: 30px;
    }
    .heading {
      display: none;
    }
    .speciality-wrapper {
      display: block;
    }
  }
`;
