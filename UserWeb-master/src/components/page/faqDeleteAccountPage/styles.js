import css from 'styled-jsx/css';

export default css`
  .faq-container {
    max-width: 1240px;
    margin: 0 auto;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 20px;
    background: rgba(255, 255, 255, 255);
  }
  .content-wrapper {
    padding: 30px 60px;
    padding-left: 10vw;
    padding-right: 10vw;
  }
  .step-list {
    display: flex;
    gap: 20px;
    flex-direction: column;
  }

  @media screen and (max-width: 576px) {
    .content-wrapper {
      padding: 30px;
    }
  }
`;
