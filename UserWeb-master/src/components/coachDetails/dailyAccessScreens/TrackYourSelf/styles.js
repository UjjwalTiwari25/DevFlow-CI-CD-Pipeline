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
    width: 212px;
    background: #fff;
  }
  .graph-box {
    border-radius: 10.3114px;
    width: 100%;
    background: #fff;
  }
  .mobile-background {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 90%;
  }
  .margin-10 {
    margin-top: 1px;
  }
  .graph-cir {
    width: 64px;
    height: 64px;
    margin-top: 5px;
    margin-right: 10px;
    margin-left: 5px;
  }
  .graph {
    width: 100%;
  }
  @media screen and (max-width: 768px) {
    .chat {
      margin-left: -76px;
    }
  }
`;
