import css from 'styled-jsx/css';

export default css`
  .outer-wrap {
    display: inline-flex;
    margin-top: 50px;
  }
  .aura-title {
    margin-bottom: auto;
    display: inline-flex;
  }
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 6px;
  }
  .margin-b-6 {
    margin-bottom: 6px;
  }
  .coach-cover {
    display: flex;
    flex-direction: column;
    padding-left: 26px;
    width: calc(100% - 230px);
  }
  .coach-image {
    height: 230px;
    width: 230px;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
  }
  .coach-image img {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .coach-content {
    padding: 26px 0 26px 26px;
  }
  .content-padding {
    padding: 40px;
  }
  @media (min-width: 767px) {
    .coach-content {
      padding-right: 32px;
    }
  }
  @media screen and (max-width: 768px) and (min-width: 767px) {
    .coach-cover {
      padding-left: 20px;
    }
  }
  @media (max-width: 767px) {
    .track-width {
      width: 100%;
    }
    .coach-cover {
      width: 100%;
    }
    .outer-wrap {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
    }
    .coach-cover {
      padding-left: 0px;
      margin-top: 20px;
      align-items: center;
    }
    .content-padding {
      padding: 10px 16px;
    }
    .coach-content {
      padding: 26px 0 26px 16px;
    }
  }
`;
