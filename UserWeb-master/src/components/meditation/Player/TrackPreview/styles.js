import css from 'styled-jsx/css';

export default css`
  .fa-btn-2-minute {
    display: inline-flex;
    margin: 0 10px;
    color: #ffffff;
    font-size: 30px;
    line-height: 1;
    width: 20px;
  }
  .button-container {
    width: 144px;
    background: rgb(255, 255, 255, 0.22);
    border-radius: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
    margin-left: 6px;
    height: 37px;
  }
  @media screen and (max-width: 576px) {
    .button-container {
      width: 120px;
      margin-left: 2px;
    }
    .fa-btn-2-minute {
      margin: 0 1px 0px 7px;
    }
  }
`;
