import css from 'styled-jsx/css';

export default css`
  .coach-row-info {
    padding-top: 42px;
    margin-left: 0px;
    position: relative;
    z-index: 1;
    padding-bottom: 20px;
    min-height: 100vh;
    max-width: 420px;
    width: 100%;
  }
  .hr {
    width: 100%;
    margin-top: 17px;
    margin-bottom: 0px;
    border: none;
    height: 1px;
    background: #9092a3;
    opacity: 0.2;
  }
  .hr2 {
    width: 100%;
    margin-top: 0px;
    margin-bottom: 0px;
    border: none;
    height: 1px;
    background: #9092a3;
    opacity: 0.2;
  }
  .coach-image {
    width: 71px;
    height: 71px;
    border-radius: 50%;
  }
  .session-info {
    margin-top: 14px;
    align-items: center;
  }
  .button-wrapper {
    width: 80%;
    margin-top: 15px;
    max-width: 375px;
  }
  .button-container {
    background: rgba(255, 255, 255, 0.1);
    padding: 23px 14px;
    border-radius: 16px;
  }
  .loaders {
    position: absolute;
    bottom: 100px;
    transform: translate(-50%, 0);
    left: 50%;
  }
  .lock-image {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  .call-booked-ring {
    width: 60px;
    height: 60px;
    margin-bottom: 6px;
  }
  .phone-input-container {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    margin-bottom: 12px;
  }
  .phone-input {
    width: 16px;
    height: 28px;
  }
  .phone-container {
    height: 45px;
    width: 100%;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    display: flex;
    align-items: center;
  }
  .phone-input-field::placeholder {
    color: rgba(255, 255, 255, 0);
  }
  .flag {
    width: 20px;
    height: 20px;
    margin-left: 12px;
    margin-right: 12px;
  }
  .skip-button {
    margin-top: 12px;
  }
  .red-border {
    border: 1px solid rgba(252, 146, 141, 0.6);
  }
  .rotating {
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-animation: rotating 2s linear infinite;
    -moz-animation: rotating 2s linear infinite;
    -ms-animation: rotating 2s linear infinite;
    -o-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite;
  }
  .add-calendar-card {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 15px;
    width: 100%;
    margin-top: 40px;
  }
  .book-info-row {
    width: 100%;
    display: flex;
    align-items: flex-start;
  }
  .coach-image-wrapper {
    position: relative;
  }
  .coach-image-wrapper .coach-image {
    width: 55px;
    height: 55px;
  }
  .camera-icon {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    background-color: #f7fbfc;
    bottom: 0;
    right: -5px;
  }
  .book-info-container {
    margin-left: 20px;
  }
  @-webkit-keyframes rotating /* Safari and Chrome */ {
    from {
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes rotating {
    from {
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -ms-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;
