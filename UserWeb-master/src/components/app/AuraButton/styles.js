import css from 'styled-jsx/css';

export default css`
  .aura-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 180px;
    cursor: pointer;
    height: 54px;
    border-radius: 27px;
    padding: 0 32px;
    background: linear-gradient(180deg, #48f2f4, #04aaf4 74%);
    border: 0px;
    outline: none;
  }
  .btn-disabled {
    background: grey;
  }
  .btn-shadow {
    box-shadow: 0 0 14px 0 #48f2f4;
  }
  .new-btn-shadow {
    background: linear-gradient(277.58deg, #4ec8ff 5.87%, #1df4ed 94.13%);
    box-shadow: 0 24px 40px 6px rgba(56, 218, 247, 0.3);
  }
  .button-container {
    width: 100%;
    position: relative;
    z-index: 1;
  }
  .clean-style {
    background: linear-gradient(277.58deg, #4ec8ff 5.87%, #1df4ed 94.13%);
    box-shadow: rgb(4 210 244 / 62%) 0px 29px 33px -12px;
  }
  .horizontal-gradient {
    background: linear-gradient(46deg, #4ccaff 0%, #1df5ed 102.13%);
  }
  .upgrade-cta {
    min-width: 144px;
    height: 37px;
    margin-left: 6px;
  }
  .btn-disabled-low-opacity {
    opacity: 0.5;
  }
  .green-btn {
    background: linear-gradient(
      30deg,
      rgba(84, 240, 184, 1),
      rgba(161, 243, 27, 1) 74%
    );
    box-shadow: rgb(84 240 184 1/ 62%) 0px 9px 30px -12px;
  }
  .green-btn-exp {
    background: linear-gradient(45deg, #08f057 0%, #b1ff74 100%);
    box-shadow: 0px 8px 40px 2px #38daf74d;
  }
  .white-btn {
    background: #fff;
    min-width: 335px;
  }
  @media screen and (max-width: 576px) {
    .upgrade-cta {
      min-width: 120px;
      max-width: 120px;
      padding: 0 16px;
      margin-left: 2px;
    }
  }
  .btn-text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .aura-btn-blinking:active {
    animation: blink-animation 0.3s linear;
  }
  .blinking {
    animation: blink-animation 0.3s linear;
  }
  @keyframes blink-animation {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;
