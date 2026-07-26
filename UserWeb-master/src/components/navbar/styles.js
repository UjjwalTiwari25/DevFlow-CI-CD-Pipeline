import css from 'styled-jsx/css';

export default css`
  .discount-button {
    display: block;
  }
  .nav-icons {
    color: rgba(0, 0, 0, 0.7);
    font-size: 20px;
    text-align: center;
  }
  .nav-icons-search {
    color: rgba(0, 0, 0, 0.7);
    font-size: 24px;
    text-align: center;
    margin-left: -2px;
  }
  .nav-main {
    background: rgba(255, 255, 255, 0.4);
    border: 0.6px solid rgb(180, 180, 180);
    height: 100%;
    width: 180px;
    position: fixed;
  }
  .margin {
    margin-top: 22px;
    margin-left: 16px;
    display: inline-flex;
  }
  .nav-text {
    margin-left: 16px;
    margin-top: 6px;
  }
  .nav-text-search {
    margin-left: 14px;
    margin-top: 6px;
  }
  .nav-text-home {
    margin-left: 12px;
    margin-top: 6px;
  }
  .nav-list-container {
    padding-left: 16px;
    margin-top: 26px;
    display: flex;
    flex-direction: column;
  }
  .list {
    display: flex;
    margin-top: 16px;
    line-height: 34px;
  }
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 6px;
  }
  .list-last {
    display: flex;
    margin-top: 16px;
    line-height: 36px;
  }
  .home-button {
    margin-left: -2px;
  }
  @media screen and (max-width: 767px) {
    .discount-button {
      display: none;
    }
    .nav-icons-search {
      margin-bottom: -1px;
      margin-left: 0px;
      font-size: 26px;
    }
    .nav-main {
      z-index: 2;
      overflow: hidden;
      position: fixed;
      border: none;
      bottom: 0;
      width: 100%;
      background: rgba(255, 255, 255, 255);
      display: flex;
      flex-direction: column;
      align-items: center;
      height: auto;
      border-radius: 16px 16px 0 0;
    }
    .nav-list-container {
      padding: 16px;
      display: inline-flex;
      flex-direction: row;
      margin-top: auto;
      text-align: center;
    }
    .list {
      display: grid;
      margin-right: 28px;
      flex-direction: inherit;
      align-items: center;
      margin-top: auto;
    }
    .list-last {
      display: block;
      flex-direction: inherit;
      align-items: center;
      margin-top: auto;
    }
    .margin {
      display: none;
    }
    .home-button {
      margin: 0 6px -4px auto;
    }
    .nav-text {
      margin-left: 0px;
    }
    .nav-text-search {
      margin-left: 0px;
    }
    .nav-text-home {
      margin-left: 0px;
    }
  }
`;
