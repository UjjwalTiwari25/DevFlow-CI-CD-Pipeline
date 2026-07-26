import css from 'styled-jsx/css';

export default css`
  .google-btn {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: rgb(255, 255, 255);
    border-radius: 6px;
    white-space: nowrap;
    overflow: hidden;
    background-clip: padding-box;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 15%);
  }
  #google-icon {
    width: 22px;
    height: 22px;
    object-fit: contain;
  }
  .low-opacity {
    background: rgba(255, 255, 255, 0.1);
  }
  .custom-google-btn {
    height: 50px;
    border-radius: 99px;
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.1);
  }
  .logo {
    width: 25px;
    height: 25px;
  }
  .logo-background {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.1);
    background: rgba(255, 255, 255, 0.8);
  }
`;
