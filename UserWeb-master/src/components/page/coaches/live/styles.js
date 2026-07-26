import css from 'styled-jsx/css';

export default css`
  .outer-wrap {
    margin: 0px 150px;
    padding-top: 40px;
    z-index: 1;
  }
  .main {
    position: relative;
    background: #f7fbfc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .optical-background {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
  }
  .signin-button {
    display: flex;
    justify-content: flex-end;
    position: relative;
    z-index: 2;
  }
  .background-congrats {
    position: fixed;
    height: 100vh;
  }
  .arrow {
    width: 7px;
    height: 13px;
    margin-top: 5px;
  }
  .row-container {
    position: absolute;
    bottom: -50px;
    left: 10px;
    z-index: 3;
  }
  .aura {
    position: relative;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width: 1024px) {
    .outer-wrap {
      margin: 0px 50px;
    }
  }
  @media screen and (max-width: 768px) {
    .outer-wrap {
      margin: 0px 20px;
    }
  }
  @media screen and (max-width: 576px) {
    .outer-wrap {
      padding-top: 10px;
    }
    .aura {
      flex-direction: row;
      align-items: center;
    }
    .row-container {
      position: relative;
      margin-left: 20px;
      bottom: 0px;
      left: 0px;
    }
  }
`;
