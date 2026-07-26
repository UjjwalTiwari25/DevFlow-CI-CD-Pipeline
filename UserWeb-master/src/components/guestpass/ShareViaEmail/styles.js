import css from 'styled-jsx/css';

export default css`
  .email-body-container {
    display: flex;
    flex-grow: 1;
    min-height: 48px;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(151, 151, 151);
    border-radius: 8px;
    align-items: center;
    padding: 0 12px;
    margin: 0 0 12px 0;
    font-size: 16px;
    font-family: SF-Pro;
  }
  .email-body-container:focus,
  .email-body-container:active {
    outline: none !important;
    border-color: rgb(151, 151, 151);
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }
`;
