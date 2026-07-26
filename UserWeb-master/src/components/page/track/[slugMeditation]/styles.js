import css from 'styled-jsx/css';

export default css`
  .meditation-container {
    margin: 0;
    padding-top: 30px;
  }
  .track-content {
    padding: 30px;
  }
  .avatar {
    vertical-align: middle;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .meditation-stats {
    width: 100%;
    display: inline-flex;
  }
  @media screen and (max-width: 768px) and (min-width: 767px) {
    .track-content {
      padding: 40px 26px;
    }
  }
  @media screen and (min-width: 281px) and (max-width: 767px) {
    .meditation-stats {
      flex-wrap: wrap;
      max-width: 250px;
    }
  }
  @media (min-width: 769px) {
    .meditation-container {
      margin: 0 32px;
    }
    .track-content {
      padding: 40px;
    }
  }
`;
