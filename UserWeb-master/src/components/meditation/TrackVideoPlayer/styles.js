import css from 'styled-jsx/css';

export default css`
  .video-player-wrapper {
    width: 90%;
    height: auto;
  }

  .video-player {
    width: 100%;
    border-radius: 16px;
  }
  .fa-btn-2-minute {
    display: inline-flex;
    margin: 0 10px;
    color: #ffffff;
    font-size: 30px;
    line-height: 1;
    width: 20px;
    z-index: 5;
  }
  .button-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .button-container {
    width: 144px;
    background: rgb(0, 0, 0, 0.6);
    border-radius: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 37px;
  }
  @media screen and (min-width: 1440px) {
    .video-player-wrapper {
      width: 80%;
    }
  }
  @media screen and (min-width: 1920px) {
    .video-player-wrapper {
      width: 60%;
    }
  }
  @media screen and (max-width: 576px) {
    .button-container {
      width: 120px;
      margin-left: 2px;
    }
    .fa-btn-2-minute {
      margin: 0 1px 0px 7px;
    }
  }
  @media (max-width: 768px) {
    .video-player-wrapper {
      margin-left: auto;
      margin-right: auto;
    }
  }
`;
