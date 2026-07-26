import css from 'styled-jsx/css';

export default css`
  .custom-list-container {
    margin-bottom: 48px;
  }
  .card-header {
    display: flex;
  }
  .card-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  @media screen and (max-width: 576px) {
    .card-content {
      justify-content: space-between;
    }
  }
`;
