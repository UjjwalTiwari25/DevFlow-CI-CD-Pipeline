import css from 'styled-jsx/css';

export default css`
  .page-content {
    display: flex;
    flex-direction: column;
    padding: 32px 64px;
    align-items: center;
  }
  .section-container {
    width: 100%;
    max-width: 926px;
    margin-top: 48px;
  }
  .section-card {
    background: rgb(255, 255, 255);
    border: 1px solid rgb(236, 236, 236);
    box-shadow: 0px 24px 40px 0px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    padding: 16px 16px;
    margin: 12px 0px;
  }
  .rewards-container {
    background-image: url('/static/images/webBackground.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .input-container {
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
  .input-container:focus,
  .input-container:active {
    outline: none !important;
    border-color: rgb(151, 151, 151);
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }
  @media (max-width: 767px) {
    .page-content {
      width: 100%;
      padding: 24px 12px 96px 12px;
    }
    .section-card {
      background: rgb(255, 255, 255);
      border: 1px solid rgb(236, 236, 236);
      box-shadow: 0px 24px 40px 0px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      padding: 12px 8px;
      margin: 12px 0px;
    }
    .section-container {
      margin-top: 40px;
    }
  }
`;
