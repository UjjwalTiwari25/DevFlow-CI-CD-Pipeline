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
  .coach-icon-large {
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
    padding: 14px;
    max-width: 163px;
    background: #fff;
  }
  .lock-container {
    border-radius: 10.3114px;
    padding: 14px;
    max-width: 100%;
    background: #fff;
  }
  .mobile-background {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 90%;
  }
  .lock-icon {
    width: 14px;
    height: 14px;
    margin-right: 11px;
  }
  .coach-icon {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    margin-right: 6px;
  }
  @media screen and (max-width: 768px) {
    .chat {
      margin-left: -76px;
    }
  }
`;
