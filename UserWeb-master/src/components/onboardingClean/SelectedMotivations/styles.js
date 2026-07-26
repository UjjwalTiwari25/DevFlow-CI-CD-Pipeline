import css from 'styled-jsx/css';

export default css`
  .item-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;
    margin-top: 24px;
    margin-bottom: 72px;
  }
  .avatar {
    width: 44px;
    border-radius: 50%;
    height: 44px;
  }
  .plus-icon {
    filter: invert(1);
    width: 16px;
    height: 16px;
    margin-left: 2px;
  }
  .avatar-large {
    width: 50px;
    height: 50px;
  }
  .text-bottom {
    position: absolute;
    bottom: 100px;
    max-width: 300px;
  }
  .plus-topics {
    cursor: pointer;
    display: flex;
  }
  .plus-benfits-container {
    display: flex;
    justify-content: center;
  }
  .plus-benefits {
    display: flex;
    margin-top: 24px;
    background: rgba(255, 255, 255, 0.16);
    padding: 16px;
    justify-content: center;
    align-items: center;
    border-radius: 32px;
    cursor: pointer;
  }
  @media screen and (max-width: 320px) {
    .text-bottom {
      position: relative;
      margin-top: 40px;
      bottom: 0px;
    }
  }
  @media screen and (max-height: 750px) {
    .text-bottom {
      position: relative;
      margin-top: 40px;
      bottom: 0px;
    }
  }
`;
