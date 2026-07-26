import css from 'styled-jsx/css';

export default css`
  .main-wrapper {
    position: relative;
    z-index: 1;
    overflow: hidden;
  }
  .aura-background {
    position: absolute;
    width: 100%;
    top: 0px;
  }
  .main {
    max-width: 420px;
    padding: 50px 24px 50px 18px;
    position: relative;
    overflow: hidden;
    width: 100%;
    margin-bottom: 160px;
  }
  .skip-button {
    width: 70px;
    height: 24px;
    border-radius: 99px;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .aura-recommend {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 16px 13px;
    width: 100%;
    margin-top: 15px;
  }
  .aura-premium-button {
    background: linear-gradient(90deg, #79eb33 0%, #0bf066 104%);
    border: 1px solid #ffffff;
    box-shadow: inset 0px -1px 0px rgba(255, 255, 255, 0.7);
    border-radius: 146.136px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 12px;
    margin-top: 10px;
    margin-bottom: 19px;
  }
  .lower-button {
    backdrop-filter: blur(60px);
    position: fixed;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.2);
    padding-top: 20px;
    padding-bottom: 30px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px 20px 0 0;
    max-width: 386px;
    z-index: 2;
  }
  .meet-coach {
    margin-top: 17px;
    position: relative;
    width: 300px;
  }
  .mobile-frame {
    margin-left: -12px;
    margin-bottom: -4px;
    z-index: 2;
    position: relative;
    width: 320px;
  }
  .mobile-frame-coach {
    position: absolute;
    top: 32px;
    left: 52px;
    width: 223px;
  }
  .mobile-frame-header {
    position: absolute;
    top: 32px;
    left: 52px;
    width: 223px;
    z-index: 1;
    height: 44px;
    background: black;
    display: flex;
    align-items: flex-end;
  }
  .mobile-frame-header-image {
    width: 100%;
  }
  .black-background {
    width: 46px;
    position: absolute;
    height: 30px;
    right: 13px;
    background: black;
  }
  .user-block {
    width: 82px;
    height: 108px;
    border-radius: 8px;
    position: absolute;
    background: #000;
    top: 81px;
    right: 32px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .user-avatar {
    width: 68px;
    height: 60px;
  }
  .weekly-recomendation {
    margin-top: 28px;
  }
  .coach-image {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }
  .chat-box-right {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 14px;
    width: 220px;
    padding: 12px 20px;
  }
  .chat-box-left {
    background: linear-gradient(95.34deg, #3eeae4 -30.9%, #03a9f4 116.53%);
    border-radius: 14px;
    width: 220px;
    padding: 12px 20px;
    margin-top: 12px;
  }
  .margin-above {
    margin-top: 12px;
  }
  .recomendation-container {
    margin-top: 28px;
    position: relative;
  }
  .aura-track {
    width: 138px;
    height: 158px;
    background-image: url('/static/images/newCoachingFlow/track-background.png');
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
  }
  .article {
    width: 138px;
    height: 158px;
  }
  .fix-height {
    height: 308px;
  }
  .absolute {
    position: absolute;
  }
  .position {
    bottom: 12px;
    left: 8px;
  }
  .coach-image-small {
    border-radius: 50%;
    width: 26px;
    height: 26px;
    margin-right: 10px;
  }
  .tracking {
    margin-top: 12px;
  }
  .tracking-image {
    width: 100%;
  }
  .journal-container {
    margin-top: 24px;
    margin-left: 22px;
  }
  .journal-info {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .coach-chat {
    margin-left: 10px;
  }
  @media screen and (max-width: 576px) {
    .lower-button {
      max-width: 100%;
    }
  }
`;
