import css from 'styled-jsx/css';

export default css`
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  a {
    color: white;
    text-decoration: none;
  }
  .get-app-button {
    display: flex;
    align-items: center;
  }
  .logo-container {
    background: #fff;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 7px;
  }
  .play-store-logo {
    width: 16px;
    height: 16px;
    margin-left: 4px;
  }
  .apple-store-logo {
    width: 16px;
    height: 16px;
    margin-bottom: 2px;
  }
  @media only screen and (max-width: 576px) {
    .container {
      min-height: 80vh;
      padding: 0 30px;
    }
  }
`;
