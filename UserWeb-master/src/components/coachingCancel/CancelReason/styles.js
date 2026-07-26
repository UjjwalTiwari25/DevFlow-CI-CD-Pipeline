import css from 'styled-jsx/css';

export default css`
  .container {
    padding-top: 48px;
    position: relative;
    width: 100%;
  }
  #btn-card {
    height: 68px;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 12px;
    padding: 0px 24px;
  }
  .button-shadow {
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.1);
  }
  .coach-image {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    z-index: 1;
  }
  .question-container {
    margin-top: 30px;
  }
  .other-reason-container {
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid #ffffff;
    border-radius: 16px;
    width: 100%;
    padding: 24px;
  }
  .bg-call-cancel {
    display: none;
  }
  .cancel-container {
    width: 100%;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid #ffffff;
    border-radius: 16px;
    padding: 24px;
    margin-top: 44px;
    position: relative;
  }
  .text-area {
    border: 1px solid rgba(47, 50, 55, 0.15);
    border-radius: 8px;
    width: 100%;
    outline: none;
    padding: 10px;
    resize: none;
    font-family: Proxima;
    margin-top: 35px;
  }
  .coach-container {
    width: 131px;
    height: 131px;
  }
  .rainbow {
    position: absolute;
    width: 60%;
  }
  @media screen and (max-width: 576px) {
    .bg-call-cancel {
      display: block;
      position: absolute;
      width: 100vw;
      height: 410px;
      left: -12%;
      top: -33px;
    }
  }
  @media screen and (max-width: 425px) {
    .bg-call-cancel {
      left: 13%;
    }
  }
  @media screen and (max-width: 375px) {
    .bg-call-cancel {
      left: -8%;
    }
  }
  @media screen and (max-width: 320px) {
    .bg-call-cancel {
      left: 0%;
    }
  }
`;
