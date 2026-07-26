import css from 'styled-jsx/css';

export default css`
  .player-items-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }
  .lock-icon {
    color: rgb(255, 255, 255, 0.8);
    font-size: 30px;
    justify-content: center;
    display: flex;
  }
  .player-icon {
    color: rgb(255, 255, 255, 0.8);
    font-size: 50px;
    justify-content: center;
    display: flex;
  }
  .player-controls {
    position: absolute;
    height: 126px;
    bottom: 74px;
    left: 0;
    right: 0;
  }
  .player-container {
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, cover;
    -webkit-background-size: cover, cover;
    -moz-background-size: cover, cover;
    -o-background-size: cover, cover;
    height: 200px;
    border-radius: 0;
    max-width: 120vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .container-holder {
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    height: 130px;
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
  }
  .play-pause-button .holder {
    display: flex;
  }
  .play-pause-button {
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }
  .fa-play {
    max-width: 94px;
    max-height: 94px;
    width: auto;
    height: auto;
    margin: 0 auto 20px;
  }
  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    .container-holder {
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .header-holder {
    flex: 1;
    display: flex;
  }
  @media (min-width: 480px) {
    .player-container {
      height: 400px;
    }
    .player-controls {
      height: 400px;
    }
  }
  @media (min-width: 767px) {
    .player-container {
      border-radius: 16px;
      height: 420px;
    }
    .player-controls {
      border-radius: 16px;
      height: 346px;
    }
    .meditation-container {
      margin: 0 32px;
    }
  }
  @media (min-width: 1025px) {
    .player-container {
      height: 66vh;
    }
    .player-controls {
      height: 54vh;
    }
  }
`;
