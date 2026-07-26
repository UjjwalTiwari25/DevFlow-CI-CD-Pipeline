import css from 'styled-jsx/css';

export default css`
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .bold {
    font-weight: bold;
  }
  .benefit-container {
    display: flex;
  }
  .icon {
    height: 24px;
    margin-right: 10px;
  }
  .welcome-text {
    margin-top: 20px;
  }
  .avatar {
    vertical-align: middle;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-top: 10px;
  }
  .best-of-apple {
    width: 120px;
    object-fit: contain;
    margin-bottom: 20px;
  }
  .benefit-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .benefits-no-trial {
    margin-bottom: 24px;
  }
  #benefits-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    margin: 20px 0px;
  }
  .benefit-item {
    max-width: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 16px 32px;
  }
  .close-button {
    font-size: 20px;
    position: absolute;
    right: 6px;
    top: 6px;
    color: black;
    width: 48px;
    height: 48px;
    border-radius: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
  }
  .close-button-fixed {
    position: fixed;
  }
  .benefit-item img {
    width: 16px;
    object-fit: contain;
    margin-right: 12px;
  }
  .trial-discount {
    margin-top: 20px;
    margin-bottom: 10px;
    max-width: 300px;
  }
  .coach-image {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  .background-image {
    width: 250px;
    position: absolute;
  }
  .coach {
    z-index: 1;
    border-radius: 50%;
    overflow: hidden;
    width: 148px;
    height: 148px;
  }
  .coach-name {
    display: flex;
  }
  .star {
    width: 21px;
    height: 21px;
    margin-left: 6px;
    margin-top: 6px;
  }
  .membership-price {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 16px;
  }
  .hr {
    background: rgba(144, 146, 163, 0.2);
    height: 1px;
    border: none;
    box-shadow: none;
    width: 100%;
    margin-top: 30px;
  }
  .hr2 {
    background: rgba(144, 146, 163, 0.2);
    height: 1px;
    border: none;
    box-shadow: none;
    width: 100%;
    margin-top: 30px;
    margin-bottom: 28px;
  }
  .membership-discount {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 30px;
  }
  .coach-thumb {
    object-fit: contain;
    width: 100%;
  }
  .off-label-contanier {
    width: 100%;
    max-width: 201px;
    background: linear-gradient(277.58deg, #4ec8ff 5.87%, #1df4ed 94.13%);
    border-radius: 99px;
    padding: 4px 18px 4px 14px;
    margin-top: 18px;
  }
  .best-of-apple-no-sku {
    width: 144px;
    height: auto;
    margin-bottom: 8px;
  }
  @media only screen and (max-width: 992px) {
    .benefit-item {
      margin: 8px;
    }
  }
`;
