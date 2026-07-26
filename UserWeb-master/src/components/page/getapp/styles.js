import css from 'styled-jsx/css';

export default css`
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    position: relative;
    padding-right: 24px;
    padding-left: 24px;
    z-index: 3;
  }
  a {
    color: white;
    text-decoration: none;
  }
  .get-app-button {
    display: flex;
    align-items: center;
  }
  .logo-container {
    background: #fff;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 7px;
  }
  .play-store-logo {
    width: 16px;
    height: 16px;
    margin-left: 4px;
  }
  .apple-store-logo {
    width: 16px;
    height: 16px;
    margin-bottom: 2px;
  }

  .live-previewWrapper {
    position: relative;
    margin-left: 47px;
  }

  .coach-profile {
    position: absolute;
    left: 20px;
    bottom: 29px;
    background-image: url('/static/images/coachingLive/liveMobileFrameBg.png');
    height: 252px;
    border-radius: 20px;
    width: 112px;
  }
  .aura-logo-wrapper {
    padding: 35px 100px 0;
    display: flex;
    align-items: center;
    width: 100%;
    gap: 12px;
  }

  .app {
    width: 135px;
    height: 40px;
  }

  @media only screen and (max-width: 768px) {
    .aura-logo-wrapper {
      padding: 30px 30px 0;
    }
  }

  @media only screen and (max-width: 576px) {
    .container {
      min-height: 80vh;
    }
    .aura-logo-wrapper {
      padding: 20px 20px 10px;
    }
  }
`;
