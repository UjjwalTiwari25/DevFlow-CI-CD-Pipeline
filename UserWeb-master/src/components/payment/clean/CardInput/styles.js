import css from 'styled-jsx/css';

export default css`
  .error {
    border-color: #f227 !important;
    background-color: #f221;
    color: #f22 !important;
  }
  .card-input {
    padding: 12px 30px;
    outline: none;
    font-weight: 900;
    color: #333;
    margin-top: 12px;
    background: rgba(61, 65, 103, 0.05);
    border: 1px solid rgba(81, 105, 167, 0.1);
    box-sizing: border-box;
    border-radius: 6px;
    min-height: 40px;
    display: flex;
    width: 100%;
    position: relative;
  }
  .card-input-dark {
    padding: 12px 30px;
    outline: none;
    font-weight: 900;
    color: #333;
    margin-top: 12px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-radius: 6px;
    min-height: 40px;
    display: flex;
    width: 100%;
    position: relative;
  }
  .card-input.single-line {
    padding: 12px 12px;
  }
  .card-input:focus,
  .card-input:active {
    outline: none !important;
    border-color: #cdcdcd;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }
  .card-input:active {
    outline: none !important;
    border-color: #cdcdcd;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }
  .card-details {
    display: flex;
    justify-content: space-between;
  }
  .card-detail-input {
    width: 48%;
  }
  .card-detail-input-exp {
    width: 49%;
  }
  .width100 {
    width: 100%;
  }
  .cc-image {
    margin-right: 14px;
    object-fit: contain;
    max-width: fit-content;
    width: 16px;
  }
  .cvc-image {
    object-fit: contain;
    position: absolute;
    width: 15px;
    top: 0;
    bottom: 0;
    right: 18px;
    margin: auto;
  }
  .error-container {
    background: #ff3b30;
    padding: 5px 10px;
    border-radius: 0 0 6px 6px;
  }
  .underline {
    text-decoration: underline;
    cursor: pointer;
  }
`;
