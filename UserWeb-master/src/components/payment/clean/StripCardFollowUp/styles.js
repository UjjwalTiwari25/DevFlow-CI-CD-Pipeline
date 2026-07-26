import css from 'styled-jsx/css';

export default css`
  .background {
    opacity: 0.5;
  }
  .card-new {
    background: transparent;
    border: none;
    border-radius: 12px;
  }
  .card-body {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
  }
  #cards-image {
    object-fit: contain;
    width: 50%;
  }
  .error {
    border-color: #f227 !important;
    background-color: #f221;
    color: #f22 !important;
  }
  .padded-content {
    padding: 12px 0;
    display: grid;
  }
  .protection-icon {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
  .credit-protection {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  .protection-container {
    display: flex;
  }
  .card-without-border {
    border: none;
    border-radius: 6px;
    padding: 20px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .low-opacity {
    background: rgb(255, 255, 255, 0.1);
  }
  .powered-by-stripe {
    width: 116px;
    margin-right: 25px;
  }
  .secured-by-stripe {
    width: 84px;
  }
  .stripe-container {
    display: flex;
    align-items: center;
  }
  .invert {
    filter: invert(1);
  }
  .green-border {
    border: 1px solid #78eb32;
    border-radius: 16px;
    padding: 20px 0;
  }
  .top-border {
    width: 100%;
    padding: 0 20px;
    border: 1px solid #ffffff33;
  }
  .best-of-apple {
    width: 120px;
    object-fit: contain;
    margin-top: 20px;
    filter: saturate(0%) brightness(1000%);
  }
`;
