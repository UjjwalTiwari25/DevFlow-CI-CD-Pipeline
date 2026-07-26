import css from 'styled-jsx/css';

export default css`
  .btn-primary {
    background: linear-gradient(
      -225deg,
      rgb(1, 248, 239) 0%,
      rgb(3, 169, 244) 100%
    );
    border-radius: 20px;
    min-height: 37px;
    max-width: 120px;
    width: 100%;
    margin: 0 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (min-width: 577px) {
    .btn-primary {
      max-width: 144px;
      margin: 0 5px;
    }
  }
`;
