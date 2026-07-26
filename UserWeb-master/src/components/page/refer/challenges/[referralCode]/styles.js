import css from 'styled-jsx/css';

export default css`
  .guest-pass-card {
    max-width: 350px;
  }

  .page-content {
    display: flex;
    gap: 80px;
    justify-content: center;
  }

  .page-content-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
  }

  .best-of-apple {
    width: 155px;
    object-fit: contain;
    margin: 16px 0px 38px;
  }

  @media (max-width: 768px) {
    .page-content {
      flex-direction: column;
      margin-top: 30px;
      width: 80%;
      gap: 0px;
      align-items: center;
    }
    .page-content-left {
      width: 100%;
    }
    .best-of-apple {
      margin: 0 0 16px;
      height: 30px;
      width: auto;
    }
  }
  @media (max-width: 576px) {
    .page-content {
      gap: 0;
      width: 100%;
    }
    .guest-pass-card {
      margin-top: 0;
      max-width: 250px;
    }
  }
`;
