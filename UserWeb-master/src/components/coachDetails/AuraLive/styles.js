import css from 'styled-jsx/css';

export default css`
  .wrapper {
    overflow: hidden;
  }
  .live-session-container {
    margin-top: 58px;
    margin-bottom: 17px;
  }
  .gradient-background {
    position: relative;
    margin-top: 34px;
    z-index: 1;
    width: -webkit-fill-available;
    max-width: 692px;
  }
  .background-live {
    width: 692px;
    position: absolute;
    height: 100%;
  }
  .live-details {
    z-index: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-height: 392px;
    width: 100%;
  }
  .info-wrapper {
    display: flex;
    position: relative;
    width: 100%;
    flex-direction: row;
    align-items: center;
  }

  .live-badge {
    background: #ffffff;
    opacity: 0.95;
    border-radius: 4.25641px;
    padding: 6px 10px;
    width: fit-content;
    margin-top: 15px;
  }
  .info-live {
    z-index: 2;
    margin-top: 12px;
  }
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
    min-width: 208px;
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
  .spots-image {
    width: 76px;
    height: 34px;
    margin-left: 14px;
  }
  .coach-image {
    margin-top: 52px;
    margin-left: 0px;
    width: 340px;
  }
  .live-container-wrapper {
    width: 692px;
    position: relative;
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
    padding: 15px 23px;
    width: 100%;
    position: relative;
    z-index: 2;
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 25px;
  }
  .coach-image-schedual {
    height: 64px;
    width: 56px;
    object-fit: cover;
  }
  .free-webinar-container {
    margin-left: 10px;
    max-width: 115px;
  }
  .free-webinar {
    background: rgba(144, 146, 163, 0.12);
    padding: 2px 5px;
    border-radius: 3px;
    width: fit-content;
    margin-bottom: 5px;
  }
  .live-background-2 {
    position: absolute;
    top: -150px;
    height: 130%;
    width: 120%;
    filter: blur(150px);
  }
  .live-background-bigger-height {
    height: 200%;
  }
  .live-time-details {
    margin-left: 25px;
    width: 240px;
    margin-top: 40px;
  }
  .coach-image-wrapper {
    display: flex;
    align-items: flex-end;
    height: 100%;
    z-index: -1;
    width: 100%;
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
  }
  .count {
    right: 0px;
    z-index: 1;
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
  .coach-info-block {
    padding-left: 69px;
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
    .info-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: static;
      padding: 0px 0px;
    }
    .info-wrapper:active {
      opacity: 0.8;
    }
    .reserve-spots {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .coach-image-wrapper {
      height: 220px;
      overflow: hidden;
      position: static;
      justify-content: center;
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
    .live-time-details {
      max-width: 150px;
      margin-left: 10px;
      margin-top: 3px;
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
      width: 40px;
      height: 40px;
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
    .live-container-wrapper {
      display: none;
    }
    .live-container {
      width: 100%;
      max-width: 692px;
      position: relative;
      display: flex;
      margin-bottom: 30px;
      overflow: hidden;
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
  }
`;
