import css from 'styled-jsx/css';

export default css`
  .apple-pay-button {
    border-radius: 100px;
    border: 0px solid #000;
    background: #fff;
    display: flex;
    height: 56px;
    padding: 8px 16px;
    justify-content: center;
    align-items: center;
    color: #000;
    gap: 3px;
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    margin-bottom: 8px;
  }

  .apple-pay-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .apple-pay-button-title {
    margin-right: 4px;
  }

  .apple-pay-button-title-exp {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
