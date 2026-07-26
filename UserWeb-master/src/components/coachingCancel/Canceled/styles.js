import css from 'styled-jsx/css';

export default css`
  .container {
    padding-top: 48px;
    position: relative;
    width: 100%;
  }
  #btn-card {
    height: 68px;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 12px;
    padding: 0px 24px;
  }
  .button-shadow {
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.1);
  }
  .coach-image {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    z-index: 1;
  }
  .check {
    width: 180px;
    height: 190px;
    margin-top: 42px;
    margin-bottom: -20px;
  }
  .coach-container {
    width: 131px;
    height: 131px;
  }
  .rainbow {
    position: absolute;
    width: 60%;
  }
`;
