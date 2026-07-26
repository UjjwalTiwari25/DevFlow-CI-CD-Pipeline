import css from 'styled-jsx/css';

export default css`
  .progress-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .vertical-align {
    flex-direction: column-reverse;
  }
  .progress-bar-container {
    width: 100%;
  }
  .progress-bar-container-hide-steps {
    margin-top: 15px;
  }
  .step-title-container {
    display: flex;
    align-items: center;
  }
  .small-step-title-container {
    display: flex;
    justify-content: space-between;
  }

  .vertical-align .step-title-container {
    margin-bottom: 5px;
  }
  .background-color {
    padding: 5px;
    border-radius: 99px;
    padding: 4px 7px 3px 7px;
  }
  .circle {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    min-height: 34px;
  }
  .static-step {
    background-color: white;
    border: 2px solid rgba(2, 207, 242, 1);
  }
  .circle-1 {
    background-color: white;
    border: 2px solid rgba(2, 207, 242, 1);
    position: absolute;
    top: -15px;
  }
  .relative {
    position: relative;
  }
  .transparent {
    background-color: transparent;
  }
  .gray-bar {
    z-index: 2;
    position: absolute;
    display: flex;
  }
  .bar-white-background {
    background: rgba(255, 255, 255, 0.2);
  }
  .bar {
    margin-top: 5px;
    height: 4px;
    border-radius: 24px;
    margin-right: 4px;
  }
  .goals-bar {
    width: 34%;
  }

  .mental-wellness-bar {
    width: 33%;
  }

  .sleep-bar {
    width: 32%;
  }

  .progress-bar {
    height: 4px;
    opacity: 1;
    border-radius: 24px;
  }
  .goals-progress-bar {
    width: 34%;
    background: linear-gradient(90deg, #a398ff 0%, #ff7c6b 67%);
  }

  .mental-wellness-progress-bar {
    width: 33%;
    background: linear-gradient(90deg, #ff7c6b 0%, #ffbb2d 67%);
  }

  .sleep-progress-bar {
    width: 32%;
    background: linear-gradient(
      90deg,
      #ffbb2d 0%,
      #e1d34d 64.13%,
      #a7ff8a 76.52%
    );
  }

  .content-progress-bar {
    width: 25%;
    background: linear-gradient(90deg, #a7ff8a 0%, #4ade80 67%);
    margin-right: 0px;
  }
  .content-progress-bar-exp {
    width: 25%;
    background: linear-gradient(90deg, #a7ff8a 0%, #4ade80 67%);
    margin-right: 0px;
  }

  .goals-progress-bar-full {
    width: 100%;
    background: linear-gradient(
      90deg,
      #a398ff 0%,
      #ff7c6b 22.93%,
      #ffbb2d 50.07%,
      #a7ff8a 78.06%
    );
    margin-right: 4px;
  }
  .colorful-animation-area-wrapper {
    height: 4px;
    margin-top: 4px;
  }
  .bar-gap {
    gap: 8px;
  }
`;

export function progressBarAnimation(
  showStepCounter,
  startColor,
  endColor,
  end,
  start
) {
  return css.resolve`
    div {
      position: relative;
      animation: load 1s normal forwards;
      border-radius: ${showStepCounter ? '3.5px' : '24px'};
      background: linear-gradient(${startColor}, ${endColor});
    }
    @keyframes load {
      0% {
        width: ${start}%;
      }
      100% {
        width: ${end}%;
      }
    }
  `;
}
export function dividedProgressBarAnimation(end, start) {
  return css.resolve`
    div {
      border-radius: 24px;
      background-color: transparent;
      z-index: 2;
      position: absolute;
      display: flex;
      flex-direction: row;
      height: 100%;
      animation: load 1s normal forwards;
      overflow: hidden;
    }
    @keyframes load {
      0% {
        width: ${start}%;
      }
      100% {
        width: ${end}%;
      }
    }
  `;
}
