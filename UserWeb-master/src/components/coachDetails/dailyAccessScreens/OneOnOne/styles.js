import css from 'styled-jsx/css';

export default css`
  .chat {
    position: relative;
    overflow: hidden;
  }
  .mobile {
    width: 400px;
  }
  .detail-container {
    position: absolute;
    top: 66px;
    left: 124px;
    width: 228px;
  }
  .coach-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .margin-top {
    margin-top: 8px;
  }
  .chat-box-white {
    border-radius: 10.3114px;
    padding: 9px 3px 12px 14px;
    max-width: 163px;
    background: #fff;
  }
  .mobile-background {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 90%;
  }
  .user-left {
    background: linear-gradient(95.34deg, #3eeae4 -30.9%, #03a9f4 116.53%);
    border-radius: 10.3114px;
    padding: 9px 3px 12px 14px;
    max-width: 163px;
    margin-top: 8px;
  }
  .right-container {
    justify-content: flex-end;
  }
  .coach-image {
    border-radius: 10.3114px;
    width: 124px;
    height: 112px;
  }
  .coach-image-container {
    position: relative;
  }
  .play-background {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.7);
    position: absolute;
  }
  .polygone {
    width: 24px;
    height: 24px;
  }
  @media screen and (max-width: 768px) {
    .chat {
      margin-left: -76px;
    }
  }
`;
