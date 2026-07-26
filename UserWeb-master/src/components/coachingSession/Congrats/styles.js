import css from 'styled-jsx/css';

export default css`
  .coach-row-info {
    margin-top: 10px;
    position: relative;
    z-index: 2;
    margin-bottom: 10px;
  }
  .frame {
    position: absolute;
    top: 0px;
    height: 250px;
    width: 300px;
  }
  .frame-container {
    position: relative;
    height: 250px;
    margin-left: 72px;
  }
  .info-container {
    position: absolute;
    top: 45px;
    left: -126px;
  }
  .coach-image {
    width: 65px;
    height: 65px;
    border-radius: 50%;
  }
  .meeting {
    width: 200px;
    position: relative;
    box-shadow: 0px 12.3944px 77.4648px rgba(43, 42, 107, 0.05);
    border-radius: 12.3944px;
    background: #fff;
    padding: 15px 5px;
    margin-top: 15px;
  }
  .green-check {
    position: absolute;
    bottom: -26px;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 42px;
    height: 42px;
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
    margin-top: 23px;
  }
  @media screen and (min-height: 700px) {
    .frame {
      width: 340px;
      height: auto;
    }
    .frame-container {
      height: 310px;
    }
    .meeting {
      width: 220px;
    }
    .info-container {
      left: -140px;
    }
  }
  @media screen and (max-width: 576px) {
    .coach-row-info {
      margin-top: 0px;
    }
    .frame {
      width: 340px;
      height: auto;
    }
    .frame-container {
      height: 310px;
    }
    .meeting {
      width: 220px;
      margin-top: 16px;
    }
    .info-container {
      top: 50px;
      left: -140px;
    }
  }
`;
