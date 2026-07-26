import css from 'styled-jsx/css';

export default css`
  .card {
    background: none;
    background-size: cover;
    border: none;
    border-radius: 6px;
    max-width: 420px;
    padding: 20px 0px;
  }
  .values-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  .value-contanier {
    display: inline-flex;
    align-items: center;
    margin-top: 20px;
  }
  .blue-check {
    width: 20px;
    margin-right: 13px;
  }
`;
