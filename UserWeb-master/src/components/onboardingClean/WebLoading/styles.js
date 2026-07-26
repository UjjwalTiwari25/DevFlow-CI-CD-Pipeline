import css from 'styled-jsx/css';

export default css`
  .item-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    min-height: 72vh;
  }
  @media screen and (max-width: 576px) {
    .item-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin-top: 5vh;
      align-items: center;
      min-height: 72vh;
    }
  }
`;
