import css from 'styled-jsx/css';

export default css`
  .wrapper {
    position: relative;
    z-index: 1;
  }
  .hr {
    border: none;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
    width: 100%;
    margin-top: 9px;
  }
  .spot-button {
    background: linear-gradient(
      89.96deg,
      rgba(255, 76, 76, 0.6) 0.03%,
      rgba(255, 0, 184, 0.6) 99.97%,
      rgba(252, 50, 62, 0.6) 99.97%,
      rgba(252, 50, 62, 0.6) 99.97%
    );
    width: 106px;
    height: 21px;
    border-radius: 99px;
    margin-top: 15px;
    margin-bottom: 12px;
    box-shadow: 0px 3px 12px rgba(252, 50, 62, 0.4);
  }
  .box {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
  }
  .topics-container {
    margin-top: 13px;
    padding: 0 13px;
    margin-bottom: 35px;
  }
  .topic {
    width: 31%;
    height: 42px;
    border-radius: 6px;
    position: relative;
  }
  .topics-wrapper {
    margin-bottom: 19px;
    justify-content: space-between;
  }
  .topic-shadow {
    width: 100%;
    height: 42px;
    position: absolute;
    top: 0px;
    z-index: -1;
    filter: blur(20px);
  }
  .cross {
    position: absolute;
    right: 2px;
    top: 2px;
    width: 12px;
    height: 12px;
  }
  .value-box {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px 21px 16px 12px;
    width: 100%;
    margin-top: 8px;
  }
  .index {
    background: linear-gradient(277.58deg, #bdd6d5 5.87%, #bdc7cd 94.13%);
    border-radius: 99px;
    width: 30px;
    height: 30px;
    margin-right: 15px;
  }
  .index-shadow {
    background: linear-gradient(277.58deg, #bdd6d5 5.87%, #bdc7cd 94.13%);
    border-radius: 99px;
    width: 20px;
    height: 20px;
    margin-right: 15px;
    z-index: -1;
    top: 22px;
    filter: blur(8px);
    left: 19px;
  }
  .position-index {
    position: absolute;
  }
  .graph {
    width: 100%;
    margin-bottom: 7px;
  }
  .graph-container {
    padding: 22px;
  }
  .row-main {
    margin-top: 20px;
    align-items: center;
  }
  .value-icon {
    width: 20px;
    height: 20px;
    margin-right: 17px;
    object-fit: contain;
  }
  .row-wrapper {
    padding: 5px 19px 28px 24px;
  }
  .hr-2 {
    border: none;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
    width: 100%;
    margin-top: 0;
    margin-bottom: 0;
  }
  .hr-container {
    padding: 0 20px;
    width: 100%;
    margin-bottom: 8px;
  }
  .text-container {
    padding: 16px 20px;
  }
  .lower-button {
    backdrop-filter: blur(10px);
    position: fixed;
    bottom: 0px;
    background: rgba(255, 255, 255, 0.1);
    padding-top: 16px;
    padding-bottom: 36px;
    border: 1px solid (255, 255, 255, 0.1);
    border-radius: 20px 20px 0 0;
    max-width: 386px;
    z-index: 2;
  }
  .green-check {
    width: 40px;
    height: 40px;
    margin-top: 9px;
  }
  .coaches-container {
    max-width: 368px;
  }
  .green-border {
    border: 1px solid #79eb33;
  }
  .pricing {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0px 7px 40px rgba(125, 153, 128, 0.25);
    border-radius: 8px;
    max-width: 311px;
    padding: 6px 24px;
    margin-top: 8px;
    position: relative;
  }
  .increase-padding {
    padding: 12px 24px;
  }
  @media screen and (max-width: 576px) {
    .lower-button {
      max-width: 100%;
    }
    .coaches-container {
      max-width: 340px;
    }
  }
`;
