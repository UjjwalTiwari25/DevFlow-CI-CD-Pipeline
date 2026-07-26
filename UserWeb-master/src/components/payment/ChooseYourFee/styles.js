import css from 'styled-jsx/css';

export default css`
  .wrapper {
    max-width: 420px;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px;
  }
  .wrapper-main {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
    min-height: 100vh;
    z-index: 2;
  }
  .value-wrapper {
    margin-top: 80px;
    display: flex;
  }
  .value {
    width: 90px;
    height: 75px;
    box-shadow: 0px 7px 40px rgba(125, 133, 153, 0.4);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .value-short {
    min-width: 72px;
    height: 72px;
    padding: 4px;
    box-shadow: 0px 7px 40px rgba(125, 133, 153, 0.4);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .border {
    border: 1px solid #0bf268;
  }
  .single-value-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 16px;
  }
  .most-popular {
    background: #38e146;
    border-radius: 10px;
    padding: 2px 5px;
    margin-top: 12px;
  }
  .background-white {
    background-color: #fff;
    margin-right: 0px;
    border-radius: 8px;
  }
  .choose-fee {
    margin-top: 20px;
    margin-bottom: 14px;
  }
  .background-grey {
    background: rgba(255, 255, 255, 0.4);
  }
  .button-wrapper {
    display: flex;
    flex-direction: column;
    gap: 28px;
    align-items: center;
    position: absolute;
    bottom: 50px;
  }
  .border-white {
    border: 1px solid #fff;
  }
  .value-wrapper-exp-trial-fee-screen {
    margin-top: 24px;
  }
  .wrapper-exp-trial-fee-screen {
    padding-top: 0;
  }

  @media screen and (max-height: 768px) {
    .button-wrapper {
      position: relative;
      margin-top: 24px;
      bottom: 0px;
    }
  }

  @media screen and (max-width: 576px) {
    .value-short {
      min-width: 64px;
      height: 64px;
      padding: 4px;
    }
    .value-wrapper-exp {
      flex-wrap: wrap;
      justify-content: center;
    }
    .single-value-container {
      margin-right: 10px;
      margin-top: 10px;
    }
  }
`;
