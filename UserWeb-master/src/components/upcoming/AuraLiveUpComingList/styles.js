import css from 'styled-jsx/css';

export default css`
  .bg-gradient {
    margin-left: 25px;
    max-height: 64px;
    max-width: 56px;
    width: 100%;
    height: 100%;
    background-image: url('/static/images/newCoach/live-small-background.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: scroll;
    border-radius: 6px;
    overflow: hidden;
  }
  .reserve-spots {
    min-width: 266px;
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 0.81%,
        #f4f5ff 28.06%,
        #ecf8ff 69%,
        #eefffc 100%
      );
    box-shadow: 0px 12.7692px 42.5641px rgba(43, 42, 107, 0.2);
    border-radius: 105.346px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 23px;
    margin-top: 12px;
    z-index: 2;
    min-height: 54px;
  }
  .reserve-spots:hover {
    opacity: 0.6;
  }
  .reserve-spots-desktop {
    min-width: 150px;
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 0.81%,
        #f4f5ff 28.06%,
        #ecf8ff 69%,
        #eefffc 100%
      );
    box-shadow: 0px 12.7692px 42.5641px rgba(43, 42, 107, 0.2);
    border-radius: 105.346px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 23px;
    z-index: 2;
    min-height: 54px;
  }
  .reserve-spots-desktop:hover {
    opacity: 0.6;
  }
  .low-padding {
    padding: 10px 18px;
  }
  .coach-image {
    margin-top: 52px;
    margin-left: 0px;
    width: 340px;
  }
  .margin-bottom {
    margin-bottom: 60px;
  }
  .live-container {
    display: none;
  }
  .live-container-desktop {
    background: rgba(255, 255, 255, 0.75);
    border-radius: 16px;
    padding: 15px 12px;
    width: 100%;
    position: relative;
    z-index: 2;
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 8px;
  }
  .coach-image-schedual {
    height: 64px;
    width: 56px;
    object-fit: cover;
  }
  .free-webinar-container {
    margin-left: 10px;
    max-width: 181px;
  }
  .free-webinar {
    background: rgba(144, 146, 163, 0.12);
    padding: 2px 5px;
    border-radius: 3px;
    width: fit-content;
    margin-bottom: 5px;
  }
  .reservation-warpper {
    width: 76px;
    height: 34px;
  }
  .reservation-numbers {
    position: absolute;
    background: #f1efef;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border: 1px solid #fff;
  }
  .count {
    right: 0px;
    z-index: 1;
  }
  .user-image {
    width: 34px;
    height: 34px;
    border-radius: 50%;
  }
  .user-0 {
    right: 24px;
    z-index: 1;
  }
  .user-1 {
    right: 48px;
  }
  .low-opacity {
    opacity: 0.5;
  }
  .over-lay {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .position-center {
    display: flex;
    justify-content: center;
  }
  .live-container {
    display: none;
  }
  @media screen and (max-width: 768px) {
    .coach-info-block {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      padding-left: 0px;
    }
    .live-details {
      flex-direction: column;
      min-height: 0px;
    }
    .reserve-spots {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .coach-image {
      margin-left: 0px;
      width: 222px;
      height: auto;
    }
    .background-live {
      border-radius: 16px;
    }
    .live-container-desktop {
      grid-gap: 10px;
    }
  }
  @media screen and (max-width: 576px) {
    .live-container-desktop {
      display: none;
    }
    .live-session-container {
      padding: 0px 32px;
      position: relative;
      z-index: 2;
      margin-top: 40px;
      margin-bottom: 8px;
      align-items: flex-start;
    }
    .background-live {
      max-width: 100%;
      height: 100%;
    }
    .reserve-spots {
      top: 300px;
    }
    .add-button {
      background:
        linear-gradient (0deg, #ffffff, #ffffff),
        linear-gradient(
          90deg,
          #fff4fd 0.81%,
          #f4f5ff 28.06%,
          #ecf8ff 69%,
          #eefffc 100%
        );
      box-shadow: 0px 9.44px 47.2px rgba(43, 42, 107, 0.2);
      border-radius: 50%;
      min-width: 40px;
      min-height: 40px;
      display: flex;
      align-items: center;
      z-index: 2;
    }
    .add-button-svg {
      text-align: center;
      font-size: 18px;
      color: black;
      justify-content: center;
    }
    .add-icon {
      width: 12px;
      margin-left: 14px;
    }
    .schedule-margin {
      position: relative;
      margin-top: 20px;
    }
    .gradient-background {
      margin-top: 20px;
      width: 100%;
      z-index: 1;
    }
    .live-container {
      width: 100%;
      display: flex;
      margin-bottom: 30px;
      justify-content: space-between;
    }
    .heading-text {
      display: none;
    }
    .info-live {
      align-items: center;
    }
    .schedule-margin:active {
      opacity: 0.8;
    }
    .add-button:active {
      opacity: 0.6;
    }
    .live-time-details {
      max-width: 150px;
      margin-left: 10px;
      margin-top: 3px;
    }
    .over-lay {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .free-webinar {
      margin-top: 4px;
    }
  }
`;
