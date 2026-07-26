import css from 'styled-jsx/css';

export default css`
  .container {
    border-radius: 16px;
    width: 320px;
    margin-right: 20px;
  }
  .coach-container {
    max-width: 320px;
    height: 250px;
  }
  .coach {
    width: 100%;
    z-index: 1;
    position: relative;
  }
  .coach-shadow {
    width: 90%;
    position: absolute;
    left: 0;
    top: 20px;
    filter: blur(20px);
    left: 50%;
    transform: translate(-50%, 0px);
  }
`;
