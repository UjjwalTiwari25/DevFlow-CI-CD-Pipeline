import css from 'styled-jsx/css';

export default css`
  .plan-items-container {
    position: relative;
  }
  .background {
    min-width: 410px;
    height: 1156px;
  }
  .background-short {
    min-width: 410px;
    height: auto;
  }
  .align-center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 24px 0px;
    padding-bottom: 96px;
  }
  .ring-title {
    max-width: 420px;
    min-width: 420px;
  }
  .plan-items-container {
    margin-left: 20px;
    margin-right: 20px;
  }
  .your-plan-item {
    max-width: 420px;
    min-width: 420px;
    margin-bottom: 16px;
  }
  @media only screen and (max-width: 576px) {
    .your-plan-item {
      min-width: 0px;
      max-width: 365px;
    }
    .container {
      min-height: 80vh;
    }
    .background {
      min-width: 355px;
    }
  }
  @media only screen and (max-width: 375px) {
    .your-plan-item {
      min-width: 0px;
      max-width: 340px;
    }
    .container {
      min-height: 80vh;
    }
    .background {
      min-width: 330px;
    }
  }
  @media only screen and (max-width: 360px) {
    .your-plan-item {
      min-width: 0px;
      max-width: 334px;
    }
    .background {
      min-width: 324px;
    }
  }
  @media only screen and (max-width: 320px) {
    .your-plan-item {
      min-width: 0px;
      max-width: 300px;
    }
    .background {
      min-width: 290px;
    }
  }
  @media only screen and (max-width: 280px) {
    .your-plan-item {
      min-width: 0px;
      max-width: 280px;
    }
    .background {
      min-width: 270px;
    }
  }
`;
