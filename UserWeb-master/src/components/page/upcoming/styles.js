import css from 'styled-jsx/css';

export default css`
  .optical-background {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100%;
  }
  .outer-wrap {
    display: flex;
    justify-content: center;
  }
  .container {
    margin: 0px 150px;
    padding-top: 40px;
  }
  .aura-logo {
    position: relative;
    z-index: 1;
  }
  .main {
    position: relative;
    background: #f7fbfc;
    min-height: 100vh;
  }
  .nav {
    width: 100%;
    max-width: 1170px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .signin-button {
    display: flex;
    justify-content: flex-end;
    position: relative;
    z-index: 2;
  }
  .list-container {
    max-width: 692px;
  }
  @media screen and (max-width: 1024px) {
    .container {
      margin: 0px 50px;
    }
  }
  @media screen and (max-width: 768px) {
    .outer-wrap {
      margin: 0px 20px;
    }
  }
  @media screen and (max-width: 576px) {
    .container {
      padding-top: 10px;
      margin: 0px 32px;
    }
  }
`;
