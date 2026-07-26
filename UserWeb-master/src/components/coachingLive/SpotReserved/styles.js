import css from 'styled-jsx/css';

export default css`
  .main {
    margin-top: 38px;
    padding: 0px 11px;
    width: 520px;
  }
  .info-container {
    position: absolute;
    top: 45px;
    left: 64px;
    width: 156px;
    z-index: 3;
  }
  .frame-shadow {
    position: absolute;
    left: 59px;
    top: 25px;
  }
  .frame {
    z-index: 2;
    position: relative;
    margin-right: -16px;
  }
  .live-count-wrapper {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 42.4749px;
    padding: 2px 6px 2px 2px;
    width: max-content;
  }
  .live-button {
    background: linear-gradient(277.58deg, #ff3acd 5.87%, #ff3a46 94.13%);
    border-radius: 49.1815px;
    padding: 2px 5px;
    margin-right: 6px;
  }
  .coach-pic {
    position: absolute;
    top: 12px;
    width: 157px;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
  .coach-photo {
    height: 290px;
  }
  .hr {
    width: 100%;
    margin-top: -4px;
    border: none;
    height: 1px;
    background: rgba(0, 0, 0, 0.2);
  }
  .comments-container {
    position: absolute;
    bottom: 10px;
    left: 5px;
  }
  .comment-author {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 3px;
  }
  .comment-box {
    margin-bottom: 6px;
  }
  .input {
    background: #000000;
    border: 0.42904px solid rgba(255, 255, 255, 0.5);
    box-sizing: border-box;
    border-radius: 42.4749px;
    padding: 5px 8px;
    width: 120px;
  }
  .heart {
    width: 10px;
    height: 10px;
  }
  .heart-container {
    border: 0.42904px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    padding: 5px;
    margin-left: 6px;
    background: #000;
  }
  .sms-button-container {
    margin-top: 33px;
  }
  @media screen and (max-width: 576px) {
    .main {
      width: 100%;
      margin-top: 0px;
    }
    .hr {
      width: 100vw;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0px);
    }
  }
`;
