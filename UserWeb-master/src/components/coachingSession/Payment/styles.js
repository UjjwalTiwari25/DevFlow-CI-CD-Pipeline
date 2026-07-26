import css from 'styled-jsx/css';

export default css`
  .coach-row-info {
    margin-top: 30px;
    position: relative;
    z-index: 2;
  }
  .coach-photo {
    width: 72px;
    height: 72px;
    border-radius: 50%;
  }
  .payment-options-container {
    position: relative;
  }
  .payment-options {
    position: relative;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    margin-top: 14px;
    padding: 14px 0px;
    width: 318px;
  }
  .green-check {
    width: 32px;
    height: 32px;
  }
  .payment-background {
    position: absolute;
    bottom: 0px;
    height: 100%;
    bottom: -170px;
  }
  .error-container {
    border: 1px solid rgba(255, 97, 97, 0.5);
    background: rgba(255, 240, 240, 0.5);
  }
  .apple-check {
    width: 246px;
    margin-top: 10px;
  }
  .credit-btn {
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 0.81%,
        #f4f5ff 28.06%,
        #ecf8ff 69%,
        #eefffc 100%
      );
    box-shadow: 0px 12px 50px rgba(43, 42, 107, 0.05);
    border-radius: 99px;
    margin-top: 12px;
    width: 246px;
    height: 45px;
  }
  .secure-check {
    width: 200px;
    margin-top: 16px;
  }
  .input-container {
    position: relative;
    width: 100%;
    padding: 0px 18px;
  }
  .existing-card-container {
    margin-top: 16px;
  }
  .change-card {
    color: #000;
    cursor: pointer;
  }
  .payment-background-2 {
    display: none;
  }
  @media screen and (min-width: 577px) {
    .payment-background-2 {
      display: none;
    }
  }
  @media screen and (max-width: 576px) {
    .payment-background {
      display: none;
    }
    .coach-row-info {
      margin-top: 0px;
    }
    .payment-background-2 {
      display: block;
      width: 100vw;
      position: absolute;
      height: 100%;
      bottom: -175px;
    }
    .payment-background {
      display: none;
    }
  }
`;
