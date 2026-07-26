import css from 'styled-jsx/css';

export default css`
  .channel-container {
    margin-bottom: 54px;
  }
  .channel-list-header {
    display: flex;
  }
  .view-all {
    right: 4%;
    text-decoration: none;
    margin-left: auto;
    order: 2;
  }
  @media screen and (max-width: 576px) {
    .channel-container {
      margin-bottom: 48px;
    }
  }
`;
