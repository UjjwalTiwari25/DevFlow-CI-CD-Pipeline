import css from 'styled-jsx/css';

export default css`
  .main {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 300px;
    padding: 0px 45px;
  }
  .coach-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .coach-image-small {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .chat-box-white {
    padding: 7px 10px 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    max-width: 160px;
    margin-left: 6px;
  }
  .chat-box-blue {
    padding: 7px 10px 8px;
    background: linear-gradient(95.34deg, #3eeae4 -30.9%, #03a9f4 116.53%);
    opacity: 0.4;
    border-radius: 8px;
    max-width: 160px;
    margin-left: 6px;
  }
  .chat-wrapper {
    margin-top: 8px;
  }
  .right-row {
    justify-content: flex-end;
    margin-top: 6px;
  }
  .coach-image-play {
    width: 87px;
    height: 78px;
    opacity: 0.4;
    margin-left: 6px;
    margin-top: 6px;
  }
  .polygone-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.4);
  }
  .polygone {
    width: 13px;
    height: 13px;
  }
`;
