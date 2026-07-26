import css from 'styled-jsx/css';

export default css`
  .custom-tracks-container {
    margin-bottom: 54px;
    width: 100%;
  }
  .custom-tracks-coach {
    width: 100%;
  }
  .card-header {
    display: flex;
  }
  .view-all {
    right: 4%;
    text-decoration: none;
    margin-left: auto;
    order: 2;
  }
  .meditation-container {
    margin-bottom: 5vh;
  }
  .meditation-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  @media screen and (max-width: 576px) {
    .custom-tracks-container {
      margin-bottom: 48px;
    }
  }
`;
