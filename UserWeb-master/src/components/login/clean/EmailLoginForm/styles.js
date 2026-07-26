import css from 'styled-jsx/css';

export default css`
  .form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 310px;
    height: 320px;
    background: rgba(255, 255, 255, 0.75);
    border-radius: 6px;
  }
  .increase-height {
    height: 400px;
  }
  .low-opacity {
    background: rgba(255, 255, 255, 0);
  }
  .top-padding {
    padding-top: 16px;
    height: auto;
  }
  .webacc-privacy-copy {
    display: flex;
    align-items: center;
    width: 283px;
    margin-bottom: 19px;
    margin-top: 5px;
  }
  .lock {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    filter: invert(1) brightness(2);
    opacity: 0.8;
  }
  .merge-scrs-padding {
    padding-top: 20px;
    padding-bottom: 8px;
  }
  .form-container-no-background {
    width: 100%;
    height: fit-content;
    background: unset;
    height: 100%;
  }
`;
