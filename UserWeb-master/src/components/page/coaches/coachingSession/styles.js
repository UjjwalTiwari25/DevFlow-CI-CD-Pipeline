import css from 'styled-jsx/css';

export default css`
  .outer-wrap {
    padding-top: 40px;
    position: relative;
  }
  .main {
    max-width: 1079px;
    position: relative;
    width: 100%;
  }
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .default-background {
    background: linear-gradient(
      180deg,
      rgba(247, 251, 252, 0) 0%,
      #f7fbfc 100%
    );
    position: relative;
    padding-bottom: 50px;
    min-height: 100vh;
    overflow: hidden;
  }
  .optical-background {
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
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
      padding-bottom: 30px;
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
    .aura-text {
      display: none;
    }
  }
`;
