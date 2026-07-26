import css from 'styled-jsx/css';

export default css`
  .main {
    width: 100%;
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.75);
    border-radius: 8px;
    position: relative;
    margin-top: 8px;
  }
  .main-dark {
    background: rgba(255, 255, 255, 0.1);
  }
  .input-container {
    width: 100%;
    min-height: 40px;
    overflow: hidden;
    padding-left: 14px;
    background: rgba(61, 65, 103, 0.05);
    border: 1px solid rgba(81, 105, 167, 0.1);
    box-sizing: border-box;
    margin-top: 8px;
    border-radius: 6px;
  }
  .input-container {
    background: rgba(61, 65, 103, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .custom-input {
    width: 100%;
    height: 100%;
    display: block;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
  }
  .custom-input::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: rgba(0, 0, 0, 0.4);
    opacity: 1; /* Firefox */
  }
  .custom-input-dark {
    width: 100%;
    height: 100%;
    display: block;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
  }
  .custom-input-dark::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: rgba(255, 255, 255, 0.5);
    opacity: 1; /* Firefox */
  }

  .input-main {
    width: 100%;
  }
  .invite-icon {
    width: 19px;
    height: 18px;
    margin-left: 14px;
    margin-top: -9px;
  }
`;
