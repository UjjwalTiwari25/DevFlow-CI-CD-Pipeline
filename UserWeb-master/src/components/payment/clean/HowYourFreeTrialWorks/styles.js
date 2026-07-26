import css from 'styled-jsx/css';

export default css`
  .card {
    background: rgba(255, 255, 255, 0.5);
    background-size: cover;
    border: none;
    border-radius: 6px;
    max-width: 420px;
    display: flex;
    align-items: center;
    padding: 24px;
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-width: 425px;
    height: 100%;
    padding-bottom: 42px;
  }
  .low-opacity {
    background: rgba(255, 255, 255, 0.1);
  }
  .free-trial {
    height: 317px;
  }
  .free-trial-container {
    justify-content: flex-start;
    width: 100%;
    margin-top: 25px;
    padding-bottom: 20px;
  }
  .content-container {
    position: absolute;
    left: 65px;
  }
  .increase-margin {
    margin-top: 20px;
  }
  hr {
    position: absolute;
    width: 100%;
    top: 3.5px;
    height: 2px;
    background: #4ccaff;
    border: 0.5px solid #ffffff;
  }
  .hr-container {
    max-width: fit-content;
  }
  .margin-top {
    margin-top: 40px;
  }
  .margin-bottom {
    margin-bottom: 40px;
  }
  @media only screen and (max-width: 600px) {
    .card {
      min-width: 325px;
    }
  }
`;
