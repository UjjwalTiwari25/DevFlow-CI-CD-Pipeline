import css from 'styled-jsx/css';

export default css`
  a {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.64);
  }
  .background {
    opacity: 0.5;
  }
  .card-new {
    background: transparent;
    border: none;
    border-radius: 12px;
  }
  .lock-icon {
    color: rgba(0, 0, 0, 0.64);
  }
  .card-body {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
  }
  .card-title {
    display: flex;
    flex-direction: column;
    align-items: center;
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
  .payment-request-btn {
    color: white;
    border-radius: 40px;
    background-color: #000;
    border: 0;
    width: 100%;
    padding: 20px;
    cursor: pointer;
    box-shadow: 0px 0px 16px #000;
    margin-top: 16px;
  }
  .payment-request-btn-content {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .cc-payment-method {
    border: 1px solid #03a9f4;
    border-radius: 8px;
    background-color: white;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 48%;
    height: 38px;
  }
  .invoice-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  #ssl-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
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
    width: 100%;
    background: rgb(255, 255, 255);
    border: none;
    border-radius: 6px;
    padding: 20px;
    overflow: hidden;
    margin-top: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .checkout-text {
    min-width: 303px;
    margin-top: 34px;
    padding: 0 14px;
  }
  .review-image-container {
    display: 'flex';
    margin-top: 10px;
  }
  .apple-reviews {
    margin-right: 40px;
    width: 100px;
  }
  .google-paly-reviews {
    width: 100px;
  }
  .due-today {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .refund {
    display: flex;
    justify-content: center;
  }
  .discount-text {
    width: 303px;
    margin-top: 30px;
  }
  .icon-image {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    cursor: pointer;
  }
  input[type='checkbox'] {
    position: relative;
    cursor: pointer;
    margin-top: -2px;
  }
  input[type='checkbox']:before {
    content: '';
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    border: 1px solid #4e545f;
    border-radius: 0px;
    background-color: white;
  }
  input[type='checkbox']:checked:after {
    content: '';
    display: block;
    width: 4px;
    height: 8px;
    border: solid black;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    top: 3px;
    left: 6px;
  }
  .people {
    width: 84px;
    margin-right: 10px;
  }
  .low-opacity {
    background: rgb(255, 255, 255, 0.1);
  }
  .invert-image {
    filter: invert(1);
  }
  .risk-free-image {
    width: 100%;
  }
  .flex-row {
    display: flex;
    align-items: center;
    margin-top: 16px;
  }
  .border {
    border: 1px solid rgba(81, 105, 167, 0.4);
  }
  .powered-by-stripe {
    width: 116px;
    margin-right: 25px;
  }
  .powered-by-stripe-exp {
    width: 115px;
    margin-right: 15px;
  }
  .secured-by-stripe {
    width: 84px;
  }
  .secured-by-stripe-exp {
    width: 73px;
  }
  .stripe-container {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    margin-top: 20px;
  }
  .stripe-container-exp {
    display: flex;
    align-items: center;
    margin-bottom: 0px;
    margin-top: 24px;
  }
  .invert {
    filter: invert(1);
  }
  .w-50 {
    width: 50%;
  }
  .password-input {
    font-weight: 900;
    color: #fff;
    margin-top: 12px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-radius: 6px;
    min-height: 40px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    position: relative;
    padding: 12px 30px;
    outline: none;
  }
  .password-input::placeholder {
    color: rgba(255, 255, 255, 0.64);
    font-weight: 400;
  }
  .remove-margin {
    margin-top: -20px;
  }
  .stripe-offer {
    display: flex;
    margin-bottom: 14px;
    cursor: pointer;
  }
  .explanation-card-without-border {
    width: 100%;
    border-radius: 6px;
    padding: 16px 9px 16px 9px;
    margin-bottom: 25px;
  }
  .total-price-no-sku {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .card-with-less-top-margin {
    margin-top: 16px;
  }
  .card-with-no-top-margin {
    margin-top: 0;
  }
  .total-price-no-sku-pricing {
    display: flex;
    gap: 4px;
  }
  .payment-providers-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .separator {
    flex: 1;
    height: 1px;
    border: 0;
    background: rgba(255, 255, 255, 0.16);
  }
  .separator-container {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 12px 0;
  }
  .card-with-more-padding {
    padding: 24px;
  }
  @media only screen and (max-width: 576px) {
    .checkout-text {
      padding: 0px 0px;
    }
    .width {
      max-width: 303px;
    }
  }
  @media screen and (max-width: 320px) {
    .discount-text {
      width: 260px;
    }
  }
`;
