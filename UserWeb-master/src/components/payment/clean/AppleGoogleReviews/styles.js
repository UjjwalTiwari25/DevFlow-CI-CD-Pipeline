import css from 'styled-jsx/css';

export default css`
  .card {
    background: none;
    background-size: cover;
    border: none;
    border-radius: 6px;
    max-width: 420px;
    padding: 28px 0px 20px 0px;
  }
  .is-no-top-padding {
    padding-top: 0;
  }
  .values-wrapper {
    display: flex;
    align-items: flex-start;
    width: 100%;
    flex-wrap: wrap;
    position: relative;
  }
  .value-contanier {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
    width: 47%;
    height: 148px;
    border-radius: 6px;
  }
  .margin-right {
    margin-right: 20px;
  }
  .background-dark {
    background: rgba(255, 255, 255, 0.1);
  }
  .background-light {
    background: rgba(255, 255, 255, 0.75);
  }
  .icon-apple {
    width: 20px;
    height: 24px;
  }
  .icon-group {
    width: 46px;
    height: 30px;
  }
  .icon-thumb {
    width: 40px;
    height: 36px;
  }
  .icon-playstore {
    width: 20px;
    height: 24px;
    margin-left: 10px;
  }
  .image-div {
    display: inline-flex;
  }
  .stars {
    width: 118px;
    margin-top: 6px;
  }
  .background-image {
    position: absolute;
    left: 0;
  }
  .reduce-padding {
    padding: 0 0 20px 0;
  }
  @media screen and (max-width: 576px) {
    .value-contanier {
      width: 46%;
      height: 148px;
    }
  }
`;
