import css from 'styled-jsx/css';

export default css`
  .discount-button {
    display: none;
  }
  @media (max-width: 767px) {
    .button {
      display: flex;
      justify-content: space-between;
    }
    .discount-button {
      display: block;
    }
  }
`;
