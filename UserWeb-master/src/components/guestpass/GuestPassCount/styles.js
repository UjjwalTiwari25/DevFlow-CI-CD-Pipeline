import css from 'styled-jsx/css';

export default css`
  #count-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .divider {
    width: 2px;
    background-color: #ccc;
    height: 56px;
    margin: 0 32px;
  }
  @media (max-width: 375px) {
    .divider {
      margin: 0 24px;
    }
  }
`;
