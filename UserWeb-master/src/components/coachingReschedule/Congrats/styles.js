import css from 'styled-jsx/css';

export default css`
  .coach-row-info {
    padding-top: 42px;
    position: relative;
    z-index: 2;
    margin-bottom: 30px;
  }
  .frame {
    position: absolute;
    top: 0px;
  }
  .frame-container {
    position: relative;
    height: 350px;
    margin-left: 72px;
  }
  .info-container {
    position: absolute;
    top: 56px;
    left: -148px;
  }
  .coach-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .meeting {
    width: 229px;
    height: 124px;
    position: relative;
    box-shadow: 0px 12.3944px 77.4648px rgba(43, 42, 107, 0.05);
    border-radius: 12.3944px;
    background: #fff;
    padding: 17px 0px;
    margin-top: 24px;
  }
  .green-check {
    position: absolute;
    bottom: -31px;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 52px;
    height: 52px;
  }
  .hr {
    width: 100%;
    margin-top: 0px;
    margin-bottom: 0px;
    border: none;
    height: 1px;
    background: #9092a3;
    opacity: 0.2;
  }
  .sms-button-container {
    margin-top: 33px;
  }
  .qr-margin {
    margin-top: 20px;
  }
  @media screen and (max-width: 576px) {
    .coach-row-info {
      margin-top: 0px;
    }
    .frame {
      width: 300px;
    }
    .frame-container {
      height: 274px;
    }
    .meeting {
      width: 180px;
      margin-top: 6px;
    }
    .info-container {
      top: 34px;
      left: -116px;
    }
  }
`;
