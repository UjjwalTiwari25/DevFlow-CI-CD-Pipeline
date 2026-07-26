import css from 'styled-jsx/css';

export default css`
  .container {
    display: flex;
    width: 100vw;
    justify-content: center;
    position: relative;
    padding: 10px 20px;
    height: 100vh;
  }
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    flex-direction: column;
    margin-top: 20px;
    position: relative;
    max-width: 420px !important;
    overflow: hidden;
  }
  .background-image {
    position: absolute;
    top: 0;
    width: 100vw;
  }
  .chat-coach-pic {
    width: 40px !important;
    height: 40px;
    border-radius: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    margin-right: 11px;
  }
  .chat-coach-pic-small {
    width: 24px !important;
    height: 24px;
    border-radius: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    margin-right: 8px;
  }
  .chat-row-left {
    display: flex;
  }
  .chat-box {
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.85);
    padding: 14px 20px 19px;
    width: 90% !important;
  }
  .large-box {
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.85);
    padding: 14px 20px 19px;
    width: 100%;
    margin-bottom: 10px;
  }
  .text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .lock-icon {
    width: 14px !important;
    height: 19px;
    margin-right: 10px;
  }
  @media screen and (max-width: 360px) {
    .text-container {
      position: relative;
      bottom: 0px;
    }
  }

  @media screen and (max-width: 320px) {
    .item-container {
      margin-top: 0px;
      margin-bottom: 150px;
    }
  }
`;
