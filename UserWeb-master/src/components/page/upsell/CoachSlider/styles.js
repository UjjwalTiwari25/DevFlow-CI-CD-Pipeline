import css from 'styled-jsx/css';

export default css`
  .box {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    margin-top: 21px;
    padding: 15px 20px 0px 20px;
  }
  .bar {
    background: rgba(144, 146, 163, 0.3);
    width: 70px;
    height: 4px;
    border-radius: 99px;
  }
  .bar-container {
    justify-content: space-between;
  }
  .bar-filled {
    height: 4px;
    border-radius: 99px;
    position: absolute;
    background: rgba(144, 146, 163);
    width: 100%;
  }
  .bar-filled-width {
    width: 100%;
  }
  .mobile-frame {
    margin-top: 20px;
    height: 400px;
    width: 300px;
  }
  .frame {
    height: 400px;
    width: 256px;
  }
  .left-overlay {
    width: 150px;
    cursor: pointer;
    z-index: 2;
    height: 400px;
  }
  .right-overlay {
    width: 150px;
    cursor: pointer;
    z-index: 2;
    height: 400px;
    outline: none;
  }
  .overlay-conatiner {
    position: absolute;
  }
  .frame-background {
    position: absolute;
    height: 100%;
    width: 220px;
  }
`;
