import css from 'styled-jsx/css';

export default css`
  #login-modal {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .modal-background {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100%;
  }
  .modal-content {
    z-index: 2;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .close-icon {
    right: 0px;
    top: 0px;
    font-size: 24px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    position: absolute;
  }
  .pricing {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0px 7px 40px rgba(125, 153, 128, 0.25);
    border-radius: 8px;
    min-width: 297px;
    padding: 12px 24px;
    margin-top: 24px;
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
  .content-container {
    margin-top: -24px;
  }
  .close {
    width: 16px;
    height: 16px;
  }
  .modalbackground {
    position: absolute;
    width: 100%;
    top: 0px;
    left: 0px;
  }
  .container {
    margin-top: -10px;
  }
  .container {
    padding: 0px 34px;
  }
  .secure-check {
    width: 100%;
    margin-top: 30px;
  }
  .input-container {
    position: relative;
    width: 100%;
  }
  @media screen and (min-width: 577px) {
    .modal-container {
      min-width: 420px;
      max-width: 420px;
      background: #242c32;
      height: 450px;
      position: absolute;
      bottom: 0px;
      border-radius: 16px 16px 0px 0px;
      padding: 23px 20px 0px 20px;
      overflow-y: scroll;
    }
    .modal-container-light {
      min-width: 420px;
      max-width: 420px;
      background: #fff;
      height: 360px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 30px;
      padding: 23px 20px 0px 20px;
      overflow-y: scroll;
    }
    .modal-container::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    .modal-container-light::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    .input-container {
      position: relative;
    }
    .cc-background {
      position: absolute;
      width: 138%;
      top: -70px;
    }
  }
  @media screen and (max-width: 576px) {
    .cc-background {
      display: none;
    }
    .modal-container {
      min-width: 100%;
      max-width: 100%;
      background: #242c32;
      height: 450px;
      position: absolute;
      bottom: 0px;
      border-radius: 16px 16px 0px 0px;
      padding: 23px 20px 0px 20px;
      overflow-y: scroll;
    }
    .modal-container-light {
      min-width: 100%;
      max-width: 100%;
      background: #fff;
      height: 350px;
      position: absolute;
      bottom: 0px;
      border-radius: 16px 16px 0px 0px;
      padding: 23px 20px 0px 20px;
      overflow-y: scroll;
    }
    .modal-container::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    .modal-container-light::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;
