import css from 'styled-jsx/css';

export default css`
  .circleContainer {
    left: 94px;
    position: relative;
    top: -105px;
  }
  .circleDot1 {
    animation: Rotate1 1s infinite linear;
    background: #fff;
    border-radius: 50%;
    height: 6px;
    left: 50%;
    position: absolute;
    top: 2px;
    width: 6px;
    z-index: 10;
  }
  .circleDot2 {
    animation: Rotate2 1s infinite linear;
    background: #fff;
    border-radius: 50%;
    height: 5px;
    left: 73%;
    position: absolute;
    top: 8px;
    width: 5px;
    z-index: 10;
  }
  .circleDot3 {
    animation: Rotate3 1s infinite linear;
    background: #fff;
    border-radius: 50%;
    height: 4px;
    position: absolute;
    right: 3px;
    top: 20px;
    width: 4px;
    z-index: 10;
  }
  .circleDot4 {
    animation: Rotate4 1s infinite linear;
    background: #fff;
    border-radius: 50%;
    height: 4px;
    position: absolute;
    right: 5px;
    top: 33px;
    width: 4px;
    z-index: 10;
  }
  .circleDot5 {
    animation: Rotate5 1s infinite linear;
    background: #fff;
    border-radius: 50%;
    height: 4px;
    position: absolute;
    right: 14px;
    top: 40px;
    width: 4px;
    z-index: 10;
  }
  .circleDot6 {
    animation: Rotate6 1s infinite linear;
    background: #fff;
    border-radius: 50%;
    bottom: 0;
    height: 4px;
    left: 21px;
    position: absolute;
    top: 42px;
    width: 4px;
    z-index: 10;
  }
  .circleDot7 {
    animation: Rotate7 1s infinite linear;
    background: #fff;
    border-radius: 50%;
    height: 4px;
    left: 11px;
    position: absolute;
    top: 39px;
    width: 4px;
    z-index: 10;
  }
  .circleDot8 {
    animation: Rotate8 1s infinite linear;
    background: #fff;
    border-radius: 50%;
    bottom: 0;
    height: 5px;
    left: 5px;
    position: absolute;
    top: 28px;
    width: 5px;
    z-index: 10;
  }
  .circleDot9 {
    animation: Rotate8 1s infinite linear;
    background: #fff;
    border-radius: 50%;
    height: 5px;
    left: 5px;
    position: absolute;
    top: 17px;
    width: 5px;
    z-index: 10;
  }
  .circleDot10 {
    animation: Rotate8 1s infinite linear;
    background: #fff;
    border-radius: 50%;
    height: 5px;
    left: 11px;
    position: absolute;
    top: 5px;
    width: 5px;
    z-index: 10;
  }

  @keyframes Rotate1 {
    0% {
      opacity: 1;
    }

    94% {
      box-shadow: 0 0 1px 2px #fff;
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }
  @keyframes Rotate2 {
    0% {
      box-shadow: none;
    }

    10% {
      box-shadow: 0 0 1px 2px #fff;
      opacity: 1;
    }

    100% {
      opacity: 0.8;
    }
  }
  @keyframes Rotate3 {
    0% {
      box-shadow: none;
    }

    20% {
      box-shadow: 0 0 1px 2px #fff;
      opacity: 1;
    }

    100% {
      opacity: 0.8;
    }
  }
  @keyframes Rotate4 {
    0% {
      box-shadow: none;
    }

    30% {
      box-shadow: 0 0 1px 2px #fff;
      opacity: 1;
    }

    100% {
      opacity: 0.8;
    }
  }
  @keyframes Rotate5 {
    0% {
      box-shadow: none;
    }

    40% {
      box-shadow: 0 0 1px 2px #fff;
      opacity: 1;
    }

    100% {
      opacity: 0.8;
    }
  }
  @keyframes Rotate6 {
    0% {
      box-shadow: none;
    }

    50% {
      box-shadow: 0 0 1px 2px #fff;
      opacity: 1;
    }

    100% {
      opacity: 0.8;
    }
  }
  @keyframes Rotate7 {
    0% {
      box-shadow: none;
    }

    60% {
      box-shadow: 0 0 1px 2px #fff;
      opacity: 1;
    }

    100% {
      opacity: 0.8;
    }
  }
  @keyframes Rotate8 {
    0% {
      box-shadow: none;
    }

    70% {
      box-shadow: 0 0 1px 2px #fff;
      opacity: 1;
    }

    100% {
      opacity: 0.8;
    }
  }
  @keyframes Rotate9 {
    0% {
      box-shadow: none;
    }

    80% {
      box-shadow: 0 0 1px 2px #fff;
      opacity: 1;
    }

    100% {
      opacity: 0.8;
    }
  }
  @keyframes Rotate10 {
    0% {
      box-shadow: none;
    }

    90% {
      box-shadow: 0 0 1px 2px #fff;
      opacity: 1;
    }

    100% {
      opacity: 0.8;
    }
  }
`;
