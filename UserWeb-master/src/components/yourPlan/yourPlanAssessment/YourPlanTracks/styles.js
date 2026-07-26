import css from 'styled-jsx/css';

export default css`
  .custom-tracks-container {
    margin-bottom: 54px;
    width: 100%;
  }
  .card-header {
    display: flex;
  }
  .space-between {
    justify-content: space-between;
    align-items: center;
  }
  @media screen and (max-width: 576px) {
    .custom-tracks-container {
      margin-bottom: 48px;
    }
    .margin-low {
      margin-bottom: 20px;
      height: 300px;
    }
  }
`;
