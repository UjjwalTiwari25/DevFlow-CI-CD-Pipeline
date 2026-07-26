import css from 'styled-jsx/css';

export default css`
  .page {
    min-height: 100vh;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 420px;
    margin-bottom: 30px;
    padding: 0px 44px;
  }
  .form {
    width: 100%;
    margin-top: 12px;
    position: relative;
    overflow: hidden;
    margin-bottom: 72px;
  }
  .form-background {
    background: rgba(255, 255, 255, 0.7);
    margin-top: 8px;
    border-radius: 8px;
    padding: 16px;
    width: 100%;
    position: relative;
  }
  .checkbox {
    width: 17px;
    height: 17px;
    border-radius: 4px;
    position: relative;
    background: #c5c6ce;
    box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.25);
  }
  .check-icon {
    width: 8px;
    height: 6px;
  }
  .gradient-background {
    background: linear-gradient(277.58deg, #4ec8ff 5.87%, #1df4ed 94.13%);
    border: none;
    box-shadow: 0px 0px 10px #4ec8ff;
  }
  .background-gradient {
    position: absolute;
    width: 100%;
  }
  @media screen and (max-width: 576px) {
    .page {
      min-width: 100%;
    }
  }
`;
