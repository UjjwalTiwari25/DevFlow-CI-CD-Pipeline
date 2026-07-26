import css from 'styled-jsx/css';

export default css`
  .card-normal {
    background: none;
    background-size: cover;
    border: none;
    border-radius: 6px;
    max-width: 420px;
    padding: 28px 0px;
  }
  .challenge-values-card {
    max-width: 800px;
  }
  .less-padding {
    padding: 15px 0px 28px 0px;
  }
  .values-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  .challenge-values-wrapper {
    flex-direction: row;
  }
  .value-contanier {
    display: inline-flex;
    align-items: center;
    margin-top: 20px;
  }
  .challenge-value-contanier {
    align-items: flex-start;
  }
  .blue-check {
    width: 16px;
    margin-right: 26px;
  }
  .less-padding {
    padding: 10px 0px 28px 0px;
  }

  @media only screen and (max-width: 767px) {
    .challenge-values-card {
      max-width: 420px;
    }
    .challenge-value-contanier {
      align-items: center;
    }
    .challenge-values-wrapper {
    flex-direction: column;
  
  }
`;
