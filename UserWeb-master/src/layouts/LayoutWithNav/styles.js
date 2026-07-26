import css from 'styled-jsx/css';

export default css`
  .margin-t-70 {
    margin-top: 0px;
  }
  .main {
    display: flex;
  }
  .nav {
    width: 180px;
  }
  .child {
    width: calc(100% - 180px);
    margin-top: 38px;
  }
  @media screen and (max-width: 767px) {
    .nav {
      width: 0px;
    }
    .child {
      width: 100%;
      margin-bottom: 28px;
      margin-top: 46px;
    }
  }
  @media screen and (max-width: 576px) {
    .margin-t-70 {
      margin-top: 70px;
    }
  }
`;
