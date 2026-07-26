import css from 'styled-jsx/css';

export default css`
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    border-radius: 8px;
    position: relative;
    justify-content: center;
  }
  .loader {
    position: relative;
  }
  #main-loader {
    width: 300px;
    height: 150px;
    margin-top: 110px;
  }
  #shadow-loader {
    width: 300px;
    height: 150px;
    position: absolute;
    top: 110px;
    left: 0;
    opacity: 0.4;
    filter: blur(2px);
  }
  .first {
    stroke-dasharray: 540;
    stroke-dashoffset: 540;
    animation: dash 6s linear forwards;
  }
  .second {
    stroke-dasharray: 540;
    stroke-dashoffset: 540;
    animation: dash 6s linear forwards;
    animation-delay: 0.66s;
  }
  .third {
    stroke-dasharray: 540;
    stroke-dashoffset: 540;
    animation: dash 6s linear forwards;
    animation-delay: 1.32s;
  }
  .fourth {
    stroke-dasharray: 540;
    stroke-dashoffset: 540;
    animation: dash 6s linear forwards;
    animation-delay: 1.98s;
  }
  .fifth {
    stroke-dasharray: 540;
    stroke-dashoffset: 540;
    animation: dash 6s linear forwards;
    animation-delay: 2.64s;
  }
  .sixth {
    stroke-dasharray: 540;
    stroke-dashoffset: 540;
    animation: dash 6s linear forwards;
    animation-delay: 3.3s;
  }
  .loader-background {
    height: 124px;
    border-radius: 50%;
    width: 124px;
    position: absolute;
    top: 118px;
    right: 88px;
    border: 4px solid rgba(255, 255, 255, 0.16);
    z-index: -1;
  }

  .progress-ball {
    height: 124px;
    border-radius: 50%;
    width: 124px;
    position: absolute;
    top: 122px;
    right: 88px;
    z-index: 1;
  }

  .rotate {
    width: 124px;
    height: 116px;
    animation: circle 4.05s linear;
  }
  .inner {
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    left: 56px;
    top: -8px;
    display: block;
  }
  .percentage-container {
    display: flex;
    justify-content: center;
    text-align: center;
    position: relative;
    bottom: 98px;
  }

  .social-proof-container {
    margin-top: 200px;
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes circle {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(360deg);
    }
  }

  @media screen and (max-width: 479px) {
    .item-container {
      margin-top: 50px;
    }
  }
  @media screen and (max-height: 800px) {
    .social-proof-container {
      margin-top: 150px;
    }
  }
  @media screen and (max-height: 750px) {
    .social-proof-container {
      margin-top: 125px;
    }
  }
  @media screen and (max-height: 700px) {
    .item-container {
      margin-top: 10px;
    }
    .social-proof-container {
      margin-top: 100px;
    }
  }
  @media screen and (max-height: 650px) {
    .item-container {
      margin-top: 0px;
    }
    .social-proof-container {
      margin-top: 70px;
    }
  }
  @media screen and (max-height: 610px) {
    .social-proof-container {
      margin-top: 60px;
    }
  }
`;
