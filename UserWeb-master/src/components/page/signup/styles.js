import css from 'styled-jsx/css';

export default css`
  .container {
    display: flex;
    width: 100vw;
    justify-content: center;
    min-height: 100vh;
  }
  .content {
    display: flex;
    width: 100%;
    max-width: 440px;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }

  .content-clean {
    display: flex;
    width: 100%;
    max-width: 420px;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
  }
  .full-screen {
    max-width: unset;
    padding: 0;
  }

  #bar {
    background: #03a9f4;
    height: 4px;
    left: 0;
    position: fixed;
    top: 0;
    z-index: 4;
    width: 100%;
    animation-name: progressBar;
    animation-duration: 16s;
  }
  .celebrity-onboarding-content {
    height: calc(100vh - 145px);
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .celebrity-onboarding-content::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
  @keyframes progressBar {
    from {
      width: 0%;
    }
    to {
      width: 96%;
    }
  }
`;
