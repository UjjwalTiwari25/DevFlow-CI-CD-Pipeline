import css from 'styled-jsx/css';

export default css`
  .render-btn {
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .guest-pass-card {
    max-width: 296px;
    background: rgb(255, 255, 255);
    border-radius: 10.01px;
    height: 180px;
    box-shadow: 0px 22px 36px 0px rgba(0, 0, 0, 0.1);
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .page-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 24px 24px 24px 24px;
    height: 100vh;
  }
  .avatar {
    vertical-align: middle;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    margin-right: 10px;
    box-shadow: 4px 14px 22px -4px rgba(0, 0, 0, 0.25);
    object-fit: cover;
  }
  #best-of-apple {
    width: 240px;
    object-fit: contain;
    margin: 12px 0px;
    filter: invert(100%);
  }
  .logo {
    position: absolute;
    top: 13px;
    left: 20px;
  }
  @media (max-width: 320px) {
    .guest-pass-card {
      height: 154px;
      width: 250px;
    }
    .page-content {
      padding: 24px 14px;
    }
    .avatar {
      width: 50px;
      height: 50px;
    }
  }
  @media only screen and (min-width: 321px) and (max-width: 600px) {
    .border {
      border: 1px solid rgb(0, 0, 0, 0);
    }
    .render-btn {
      margin-top: 38px;
    }
    .avatar {
      width: 70px;
      height: 70px;
    }
  }
`;

export const renderCTAStyle = css`
  .btn-primary {
    background: linear-gradient(
      -180deg,
      rgb(69, 239, 244) 0%,
      rgb(3, 169, 244) 100%
    );
    border-radius: 32px;
    min-height: 66px;
    max-width: 235px;
    width: 100%;
    margin: 0 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
