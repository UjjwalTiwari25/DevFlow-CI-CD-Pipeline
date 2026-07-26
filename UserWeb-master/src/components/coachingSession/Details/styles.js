import css from 'styled-jsx/css';

export default css`
  .coach-row-info {
    margin-top: 30px;
    margin-left: 70px;
    position: relative;
    z-index: 1;
  }
  .coach-row-info-2 {
    margin-top: 30px;
    margin-left: 30px;
    position: relative;
    z-index: 2;
    max-width: 566px;
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
  .coach-image-container {
    width: 235px;
    height: 176px;
    overflow: hidden;
    margin-right: 50px;
  }
  .coach-image {
    width: 100%;
  }
  .star-container {
    margin-top: 20px;
    margin-left: -10px;
  }
  .star {
    width: 36px;
    height: 36px;
    margin-top: 4px;
    margin-right: -14px;
  }
  .single-star {
    width: 36px;
    height: 36px;
    margin-top: 3px;
    margin-right: -4px;
  }
  .session-info {
    margin-top: 20px;
  }
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .icon-container {
    margin-top: 20px;
  }
  .container {
    margin-left: 40px;
    margin-bottom: 40px;
  }
  .coach-container {
    margin-top: 14px;
  }
  .coach-info-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 17px;
    box-shadow:
      5px 13px 21px -5px rgba(48, 56, 72, 0.25),
      inset 0px -1px 1px #ffffff;
    object-fit: cover;
  }
  .review-container {
    margin-top: 60px;
  }
  .review-box {
    margin-top: 16px;
  }
  .rating-line {
    justify-content: space-between;
    margin-left: -10px;
  }
  .review-user-container {
    margin-top: 14px;
  }
  .user-info-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex: auto;
  }
  .user-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin-right: 15px;
    object-fit: cover;
  }
  .user-icon-text {
    align-items: center;
    justify-content: center;
    background-color: #c4c4c4;
    border-radius: 100%;
    display: flex;
    width: 44px;
    height: 44px;
    margin-right: 17px;
  }
  .timing-container {
    margin-left: 80px;
    width: 363px;
    position: relative;
    border-radius: 16px;
    padding-top: 22px;
    padding-bottom: 32px;
    background: rgba(255, 255, 255, 0.6);
    margin-top: 42px;
    background: transparent;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    height: max-content;
    border: 1px solid #ffffff;
  }
  .time-background {
    position: absolute;
    width: 100%;
    filter: blur(90px);
    top: 37px;
    height: 100%;
  }
  .time-slots-container {
    margin-top: 12px;
    position: relative;
    padding: 0px 20px;
    /* overflow: scroll; */
    width: 100%;
  }
  .session-slot-selected {
    background: #ffffff;
    border: 1px solid rgba(144, 146, 163, 0.5);
    border-radius: 8px;
    padding: 8px 12px;
    margin-right: 10px;
    min-width: 130px;
  }
  .session-slot-not-selected {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 8px 12px;
    margin-right: 10px;
    min-width: 130px;
  }
  .session-margin {
    margin-top: 12px;
  }
  .session-dates {
    overflow: scroll;
    position: relative;
    padding: 14px 28px;
    width: 100%;
  }
  .date-container-selected {
    padding: 6px 8px;
    background: #ffffff;
    border: 1px solid rgba(144, 146, 163, 0.5);
    box-sizing: border-box;
    border-radius: 8px;
    min-width: 110px;
    display: flex;
    justify-content: center;
  }
  .date-container-not-selected {
    min-width: 110px;
    padding: 6px 8px;
    display: flex;
    justify-content: center;
  }
  ::-webkit-scrollbar {
    display: none;
    background: transparent; /* Chrome/Safari/Webkit */
  }
  .time-container {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-gap: 10px;
    margin-top: 10px;
    position: relative;
  }
  .time {
    width: 98px;
    height: 50px;
    background: #fff;
    border-radius: 8px;
  }
  .time-booked {
    width: 98px;
    height: 50px;
    background: rgba(255, 255, 255, 0.64);
    border-radius: 8px;
    margin-right: 8px;
    margin-top: 8px;
  }
  .icon-wrapper {
    margin-top: 24px;
  }
  .review-desktop {
    display: block;
  }
  .session-wrapper {
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 100%;
  }
  @media screen and (max-width: 768px) {
    .timing-container {
      margin-left: 30px;
    }
  }
  @media screen and (min-width: 768px) {
    .review-mobile {
      display: none;
    }
    .hr-2 {
      display: none;
    }
    .mobile-only {
      display: none;
    }
  }
  @media screen and (max-width: 576px) {
    .session-wrapper {
      flex-direction: column-reverse;
    }
    .desktop-only {
      display: none;
    }
    .hr-2 {
      width: 100%;
      margin-top: 0px;
      margin-bottom: 0px;
      border: none;
      height: 1px;
      background: #9092a3;
      opacity: 0.2;
    }
    .hr {
      display: none;
    }
    .container {
      margin-bottom: 0px;
      padding-bottom: 20px;
    }
    .review-root {
      width: 312px;
      min-height: 206px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 16px;
      margin-right: 13px;
      padding: 6px 22px 22px;
    }
    .review-background {
      position: absolute;
      top: -80px;
      left: 50%;
      transform: translate(-50%, 0%);
      width: 100vw;
    }
    .stars-container {
      margin-left: -11px;
    }
    .review-mobile {
      margin-top: 17px;
      max-width: 90vw;
    }
    .review-container {
      margin-top: 40px;
      position: relative;
    }
    .review-desktop {
      display: none;
    }
    .coach-row-info-2 {
      margin-left: 0px;
      display: flex;
    }
    .coach-image-container {
      margin-right: 0px;
      width: 169px;
      height: 121px;
    }
    .container {
      margin-left: 0px;
    }
    .coach-row-info {
      margin-top: 0px;
      margin-left: 0px;
    }
    .session-info {
      align-items: center;
    }
    .star-container {
      margin-top: 6px;
      margin-left: -11px;
    }
    .coach-row-info-2 {
      margin-top: 0px;
    }
    .icon-wrapper {
      margin-top: 11px;
    }
    .icon-container {
      margin-top: 17px;
    }
    .button-container {
      background: rgba(255, 255, 255, 0.5);
      border-radius: 10px 10px 0px 0px;
      position: fixed;
      padding: 20px 28px;
      bottom: 0px;
      backdrop-filter: blur(60px);
      width: 100%;
      left: 50%;
      transform: translate(-50%, 0px);
    }
  }
  @media screen and (max-width: 576px) {
    .timing-container {
      display: none;
    }
  }
`;
