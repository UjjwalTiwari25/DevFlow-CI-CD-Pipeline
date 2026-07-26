import css from 'styled-jsx/css';

export default css`
  .input-container {
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: center;
    border-radius: 30px;
    background: #eef2f3;
    overflow: hidden;
    padding-left: 30px;
  }
  .input-container-border {
    display: flex;
    align-items: center;
    min-height: 48px;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(151, 151, 151);
    padding: 0 12px;
    border-radius: 8px;
    overflow: hidden;
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
  .error-input {
    border-color: #f227 !important;
    background-color: #f221;
    color: #f22 !important;
  }
  .white-theme-input {
    background-color: rgba(61, 65, 103, 0.05);
    border: 1px solid rgba(81, 105, 167, 0.1);
    height: 45px;
    border-radius: 8px;
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    padding-left: 30px;
    background-clip: padding-box;
    transition:
      border-color 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;
  }
  .white-theme-input:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;
