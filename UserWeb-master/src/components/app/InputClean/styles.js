import css from 'styled-jsx/css';

export default css`
  .input-container {
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: center;
    border-radius: 30px;
    width: 270px;
    height: 50px;
  }
  .input-container-border {
    display: flex;
    align-items: center;
    min-height: 50px;
    padding: 0 12px;
    overflow: hidden;
  }
  .custom-input {
    width: 100%;
    height: 100%;
    display: block;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    padding: 18px;
    background: rgba(61, 65, 103, 0.05);
    border: 1px solid rgba(81, 105, 167, 0.1);
    box-sizing: border-box;
    border-radius: 6px;
  }
  .light-placeholder::placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
  }
  .custom-input::placeholder {
    color: rgba(78, 84, 95, 0.5);
  }
  .custom-input-dark {
    width: 100%;
    height: 100%;
    display: block;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    padding: 18px;
    background: rgba(61, 65, 103, 0.05);
    border: 1px solid rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-radius: 6px;
  }
  .custom-input-dark::placeholder {
    color: rgba(255, 255, 255, 1);
  }
  .error-input {
    border-color: #f227 !important;
    background-color: #f221;
    color: #f22 !important;
  }
  .error-input-white {
    border-color: #f227 !important;
    background-color: #f221;
    color: #fff !important;
  }
  .check-image {
    position: absolute;
    top: 10px;
    right: 6px;
    width: 34px;
  }
  .change-border-color {
    background: rgba(255, 255, 255, 0.2);
    opacity: 0.9;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
  }
  .change-border-color::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;
