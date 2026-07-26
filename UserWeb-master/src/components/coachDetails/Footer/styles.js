import css from 'styled-jsx/css';

export default css`
  .main {
    margin: 0px 150px;
  }
  .footer-container {
    margin-bottom: 70px;
  }
  .text-container {
    justify-content: space-between;
    margin-top: 28px;
  }
  .hr {
    width: 100%;
    margin-top: 0px;
    margin-bottom: 0px;
    border: none;
    height: 1px;
    background: #9092a3;
    opacity: 0.2;
  }
  @media screen and (max-width: 1024px) {
    .main {
      margin: 0px 50px;
    }
  }
  @media screen and (max-width: 576px) {
    .main {
      margin: 0px 31px;
    }
    .footer-container {
      margin-bottom: 60px;
    }
    .text-container {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;
