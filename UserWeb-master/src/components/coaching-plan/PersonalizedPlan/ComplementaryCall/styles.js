import css from 'styled-jsx/css';

export default css`
  .main-container {
    margin-top: 70px;
  }
  .call-container {
    position: relative;
    overflow: hidden;
    height: 292px;
  }
  .coach-image {
    position: absolute;
    width: 218px;
    right: 82px;
    top: 32px;
  }
  .phone {
    position: relative;
    z-index: 1;
    width: 333px;
  }
  .person-vector {
    width: 66px;
    height: 88px;
    background-color: #4e545f;
    border-radius: 8px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1;
    top: 53px;
    right: 88px;
  }
  @media screen and (max-width: 576px) {
    .coach-image {
      position: absolute;
      width: 175px;
      right: 28px;
      top: 20px;
      border-radius: 27px;
    }
    .phone {
      width: 270px;
    }
    .call-container {
      overflow: hidden;
      height: 236px;
      width: 270px;
    }
    .person-vector {
      top: 47px;
      right: 35px;
    }
  }
  @media screen and (max-width: 320px) {
    .coach-image {
      top: 21px;
    }
    .call-container {
      height: 227px;
    }
  }
`;
