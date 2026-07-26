import css from 'styled-jsx/css';

export default css`
  .google-pay-button {
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
    line-height: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .google-pay-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .google-pay-button img {
    height: 24px;
    width: auto;
  }
`;
