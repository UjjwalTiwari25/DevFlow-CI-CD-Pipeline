import css from 'styled-jsx/css';

export default css`
  .back-button {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 20px;
    z-index: 2;
  }
  .left-arrow {
    position: absolute;
    left: 20px;
    top: 48px;
    font-size: 28px;
    color: #fff;
    z-index: 2;
  }
  .block-container {
    max-width: 420px;
    width: 100%;
  }
  .aura-background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    opacity: 0.4;
  }
  .aura-background-2 {
    display: none;
  }
  @media screen and (max-width: 576px) {
    .aura-background {
      height: auto;
    }
    .aura-background-2 {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0px;
    }
  }
`;
