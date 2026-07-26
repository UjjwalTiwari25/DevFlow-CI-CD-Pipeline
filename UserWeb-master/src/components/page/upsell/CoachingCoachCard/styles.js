import css from 'styled-jsx/css';

export default css`
  .container {
    border-radius: 16px;
    margin-right: 20px;
    background: rgba(255, 255, 255, 0.1);
    min-height: 553px;
    width: 300px;
  }
  .decrease-height {
    min-height: 535px;
  }
  .coach-container {
    padding: 13px 28px 28px 28px;
  }
  .coach-image {
    object-fit: cover;
    width: 100px;
    height: 100px;
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
  .country-flag {
    width: 20px;
    height: 16px;
    margin-right: 7px;
  }
  .country-flag-small {
    width: 12px;
    height: 8px;
    margin-right: 4px;
  }
  .flag-container {
    margin-top: 5px;
  }
  .stats {
    margin-top: 18px;
    justify-content: space-between;
    width: 100%;
  }
  .coaches {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .all-container {
    padding: 28px;
    width: 300px;
    margin-top: 60px;
  }
  .container-small {
    margin-top: 29px;
  }
  .coach-photo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
  }
  .subs-icon {
    width: 14px;
    height: 12px;
    margin-left: 15px;
    margin-right: 4px;
  }
  .all-container-small {
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    margin-top: 35px;
    margin-bottom: 35px;
    min-height: 100%;
  }
  .coaches2 {
    width: 100%;
    margin-top: 15px;
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
    position: absolute;
    right: 14px;
  }
  .spots-header {
    background: linear-gradient(
      89.96deg,
      #ff4c4c 0.03%,
      #ff00b8 99.97%,
      #fc323e 99.97%,
      #fc323e 99.97%
    );
    border-radius: 999px;
    padding: 2px 8px;
    position: absolute;
    right: 14px;
    box-shadow: 1px 1px 7px #ff4c4c;
    opacity: 0.8;
  }
  .star {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  .star-container {
    margin-top: 30px;
    margin-bottom: 15px;
  }
  .disabled {
    opacity: 0.7;
  }
`;
