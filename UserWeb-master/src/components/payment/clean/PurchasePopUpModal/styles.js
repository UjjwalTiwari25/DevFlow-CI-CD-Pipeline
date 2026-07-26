import css from 'styled-jsx/css';

export default css`
  .popup-container {
    background-image: url('/static/images/PurchasePopup/background.png');
    display: flex;
    justify-content: space-between;
    padding: 15px;
    background-color: #fff;
    border-radius: 16px;
    background-position: 50% 50%;
    background-size: cover;
    position: relative;
  }
  .heart-image {
    position: absolute;
    left: 1px;
    top: 6px;
    width: 56px;
    height: 56px;
  }
  .image-container {
    position: relative;
    background: #fff;
    min-width: 57px;
    height: 57px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .purchase-popup-modal {
    position: fixed;
    top: 20px;
    left: 20px;
    right: 20px;
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .cross-icon {
    color: rgba(0, 0, 0, 0.5);
    margin-left: 10px;
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .text-container {
    max-width: 96%;
  }
  @media screen and (min-width: 576px) {
    .popup-container {
      align-items: center;
    }
  }
`;
