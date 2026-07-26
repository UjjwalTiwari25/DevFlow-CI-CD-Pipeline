import css from 'styled-jsx/css';

export default css`
  .page-content {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .page-content {
      margin-top: 30px;
      width: 80%;
    }
  }
  @media (max-width: 576px) {
    .page-content {
      width: 100%;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
`;
