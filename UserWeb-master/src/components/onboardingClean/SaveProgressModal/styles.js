import css from 'styled-jsx/css';

export default css`
  .show-offer-modal {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 16px;
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .item-container {
    position: relative;
    background: #11191e;
    background-image: url('/static/images/saveProgressModalBackground.png');
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 14px 10px;
    max-width: 335px;
    max-height: 700px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
  }
  .web-postion {
    left: 19px;
  }

  .close-button {
    position: absolute;
    filter: invert(1);
    right: 10px;
    top: 12px;
  }
  .stripe-container {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    margin-top: 20px;
    filter: brightness(0.7);
  }
  .powered-by-stripe {
    width: 115px;
    margin-right: 15px;
  }
  .secured-by-stripe {
    width: 72px;
  }
`;
