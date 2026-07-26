import css from 'styled-jsx/css';

export default css`
  .info-container {
    border-radius: 16.8571px;
    background: rgba(255, 255, 255, 0.5);
    padding: 22px 28px;
    width: 328px;
    margin-right: 15px;
  }
  .info-container-horizontal {
    border-radius: 16.8571px;
    background: rgba(255, 255, 255, 0.5);
    padding: 22px 28px;
    width: 328px;
    margin-right: 15px;
  }
  .icon-list {
    margin-top: 12px;
  }
  .icon {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
  @media screen and (max-width: 576px) {
    .info-container {
      margin-right: 0px;
      margin-top: 20px;
      width: 100%;
    }
    .info-container-horizontal {
      width: 288px;
    }
  }
`;
