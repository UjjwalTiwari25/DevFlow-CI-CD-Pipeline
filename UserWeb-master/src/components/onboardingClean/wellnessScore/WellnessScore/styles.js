import css from 'styled-jsx/css';

export default css`
  @property --c-0 {
    syntax: '<number>';
    initial-value: 1;
    inherits: false;
  }
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    margin-top: 32px;
    position: relative;
  }
  .item-container-slider {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;
    margin-top: 6px;
    position: relative;
  }
  .graph {
    width: 100%;
  }
  .target-text-block-exp {
    position: absolute;
    right: 125px;
    top: 42px;
  }
  .slider {
    height: 293px;
    position: relative;
  }
  .wrapper {
    max-width: -webkit-fill-available;
    overflow: hidden;
  }
  .animation {
    animation: slidermove 14s;
    animation-fill-mode: forwards;
  }
  .higher-score {
    bottom: 51px;
  }
  .list-icon {
    width: 35px;
    height: 35px;
    margin-right: 14px;
  }
  .score-calculated {
    margin-top: 20px;
    margin-bottom: 80px;
  }
  .align-text {
    margin-left: 10px;
  }
  @keyframes slidermove {
    0% {
      left: 0%;
    }
    70% {
      left: -100%;
    }
    100% {
      left: 0%;
    }
  }
  @media screen and (max-width: 576px) {
    .line-graph-wrapper {
      width: 100vw;
    }
  }
  .list-container {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
  }
  .icon-container {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 8px;
  }
  .icon {
    padding: 10px 10px 6px;
  }
`;
