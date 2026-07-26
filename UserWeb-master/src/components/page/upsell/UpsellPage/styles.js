import css from 'styled-jsx/css';

export default css`
  .page {
    min-height: 100vh;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 420px;
    min-width: 320px;
    margin-bottom: 30px;
    overflow: hidden;
  }
  .dark-background {
    background: #11191e;
  }

  .light-background {
    background: #ffffff;
  }
  .logo {
    width: 180px;
    height: 170px;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translate(-50%, 0%);
  }
  .text-container {
    margin-top: 60px;
    position: relative;
  }
  .pricing-container {
    margin-top: 11px;
    position: relative;
  }
  .pricing-background {
    position: absolute;
    top: 0px;
    width: 400px;
    left: 50%;
    transform: translate(-50%, 0px);
  }
  .low-background {
    opacity: 0.7;
  }
  .pricing {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0px 7px 40px rgba(125, 153, 128, 0.25);
    border-radius: 8px;
    min-width: 297px;
    padding: 6px 24px;
    margin-top: 8px;
    position: relative;
  }
  .best-value {
    background: linear-gradient(90deg, #79eb33 0%, #0bf066 104%);
    border-radius: 146.136px;
    padding: 0px 10px;
    display: flex;
    align-items: center;
    margin-left: 6px;
    box-shadow: 0px 1px 4px #79eb33;
    max-height: 21px;
  }
  .transparent-border {
    border: 1px solid transparent;
  }
  .green-border {
    border: 1px solid #79eb33;
  }
  .stripe-container {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .powered-by-stripe {
    width: 116px;
    margin-right: 25px;
  }
  .secured-by-stripe {
    width: 84px;
  }
  .invert {
    filter: invert(1);
  }
  .increase-padding {
    padding: 12px 24px;
  }
  .timer-exp-padding {
    padding: 8px 24px 12px 24px;
  }
  .less-padding {
    padding: 0px 0px;
  }
  .low-shadow {
    box-shadow: 0px 1px 4px rgba(121, 235, 51, 0.5);
  }
  .exist-cta-margin {
    margin-bottom: 24px;
  }
  .button-width {
    margin-top: 25px;
    width: 90%;
  }
  .stars {
    width: 96px;
    margin-top: 15px;
  }
  .social-proof-container {
  }
  .bestOfApple {
    margin-top: 25px;
    margin-bottom: 10px;
    width: 113px;
  }
  .obviuos-price-container {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    border-radius: 8px;
    padding: 10px 11px 10px 18px;
    margin-top: 17px;
  }
  .gradient-line {
    border: none;
    margin-top: 0;
    margin-bottom: 0;
    height: 1px;
    background: linear-gradient(to right, #1df5ed, #4ccaff);
    opacity: 0.3;
  }
  .no-box {
    background: transparent;
    box-shadow: none;
    margin-top: 38px;
    margin-bottom: 38px;
  }
  .best-value-center {
    height: 21px;
    width: fit-content;
    margin-bottom: 11px;
  }
  .best-value {
    background: linear-gradient(90deg, #79eb33 0%, #0bf066 104%);
    border-radius: 146.136px;
    padding: 4px 10px;
    display: flex;
    align-items: center;
    margin-left: 6px;
    max-height: 21px;
  }
  .increased-padding {
    padding: 16px 20px;
  }
`;
