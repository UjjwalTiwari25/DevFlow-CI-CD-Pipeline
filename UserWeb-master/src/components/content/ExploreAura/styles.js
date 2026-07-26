import css from 'styled-jsx/css';

export default css`
  .custom-aura-container {
    margin-bottom: 54px;
    width: 100%;
  }
  .aura-header {
    display: flex;
  }
  .view-all {
    right: 4%;
    text-decoration: none;
    margin-left: auto;
    order: 2;
  }
  @media screen and (max-width: 576px) {
    .custom-aura-container {
      margin-bottom: 48px;
    }
  }
`;
