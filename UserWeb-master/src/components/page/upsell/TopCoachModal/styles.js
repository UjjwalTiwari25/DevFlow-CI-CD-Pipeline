import css from 'styled-jsx/css';

export default css`
  #coach-modal {
    position: fixed;
    z-index: 5;
    right: 0;
    bottom: 0;
    background-color: #11191e;
    justify-content: center;
    display: flex;
    height: 90%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px 16px 0px 0px;
    max-width: 350px;
    left: 50%;
    transform: translate(-50%, 0px);
    width: 100%;
  }
  .close-icon {
    color: #5b657a;
    position: absolute;
    right: 10px;
    top: 20px;
    font-size: 20px;
    z-index: 10;
  }
  .coach-image {
    object-fit: cover;
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .hr {
    margin-top: 0;
    margin-bottom: 0;
    border: none;
    height: 1px;
    background: rgba(144, 146, 163, 0.1);
    width: 100%;
  }
  .less-width {
    width: 90%;
  }
  .coach-container {
    width: 100%;
    overflow: scroll;
    padding-top: 20px;
    height: 100%;
  }
  .country-flag {
    width: 20px;
    height: 16px;
    margin-right: 7px;
  }
  .flag-container {
    margin-top: 5px;
    margin-bottom: 21px;
  }
  .coach-info {
    align-items: flex-start;
    padding: 0 38px;
    margin-top: 26px;
    height: 100%;
  }
  .specialities {
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .speciality {
    margin-top: 5px;
    margin-right: 5px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 10px;
  }
  .aura-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 180px;
    cursor: pointer;
    height: 54px;
    border-radius: 27px;
    padding: 0 32px;
    border: 0px;
    outline: none;
    margin-bottom: 40px;
    margin-top: 15px;
    width: 100%;
  }
  .btn-disabled {
    background: grey;
  }
  .btn-shadow {
    box-shadow: 0 0 14px 0 #48f2f4;
  }
  .clean-style {
    background: linear-gradient(277.58deg, #4ec8ff 5.87%, #1df4ed 94.13%);
    box-shadow: rgb(4 210 244 / 62%) 1px 0px 30px 3px;
  }
  .spots {
    background: linear-gradient(
      89.96deg,
      #ff4c4c 0.03%,
      #ff00b8 99.97%,
      #fc323e 99.97%,
      #fc323e 99.97%
    );
    border: 1px solid #ffffff;
    border-radius: 999px;
    padding: 2px 8px;
    margin-left: 10px;
  }
  .shadow {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
  }
  .disabled {
    opacity: 0.7;
  }
  .stats {
    margin-top: 12px;
    justify-content: space-between;
    width: 70%;
    margin-bottom: 18px;
  }
  .coach-image-bg-remove {
    object-fit: cover;
    height: 80px;
  }
  .full-height {
    height: 100%;
  }
  .button-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    width: 100%;
  }
  .coaching-subscription-ui {
    width: 100%;
    padding: 25px;
    height: 100%;
    overflow: scroll;
    position: relative;
    display: flex;
    flex-direction: column;
    padding-bottom: 120px;
  }
  .coach-info-row {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .subscription-coach-image {
    object-fit: cover;
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  .coach-details-container {
    margin-left: 16px;
  }
  .details-row {
    width: 100%;
    margin-top: 15px;
  }
  .specialty-item {
    padding: 6px 10px;
    border: 1px solid #ffffff;
    border-radius: 8px;
  }
  .education-item {
    display: flex;
    align-items: center;
    margin-top: 16px;
  }
  .icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
  }
  .subscription-button-container {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(60px);
    border-radius: 6px 6px 0 0;
    height: 96px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .video-wrapper {
    width: 100%;
    margin-top: 25px;
  }
  .list-container {
    margin: 0;
    color: #fff;
    padding: 0;
    list-style: none;
  }
  .list-item {
    display: flex;
    align-items: center;
  }
  .line-clamp {
    -webkit-line-clamp: 3;
  }
  .service-cards-row {
    display: flex;
    align-items: flex-start;
    overflow-x: scroll;
    width: 100%;
    min-height: 210px;
    margin-top: 13px;
  }
  .service-card {
    width: 312px;
    min-width: 312px;
    height: 180px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px 15px;
    margin-right: 9px;
  }
  @media screen and (max-width: 576px) {
    #coach-modal {
      max-width: 100%;
    }
  }
`;
