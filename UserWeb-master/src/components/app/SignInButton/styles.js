import css from 'styled-jsx/css';

export default css`
  .btn-default {
    border-radius: 20px;
    border: 0.5px solid rgb(0 0 0 / 0.3);
    min-height: 36px;
    max-width: 80px;
    width: 100%;
    margin: 0px 5px 0px 7px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (min-width: 577px) {
    .btn-default {
      max-width: 144px;
      margin: 0 5px;
    }
  }
`;
