import css from 'styled-jsx/css';

export default css`
  .header {
    padding: 35px 0 0 150px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .guest-pass-card {
    max-width: 350px;
  }
  .page-background-image {
    background-image: url('/static/images/referNew/new-reffer-lp-hero.png');
    background-repeat: no-repeat;
    transition: opacity 200ms ease;
    width: 100%;
    background-size: contain;
  }
  .page-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .best-of-apple {
    width: 155px;
    object-fit: contain;
    margin: 16px 0px 42px;
    filter: invert(100%);
  }
  @media (max-width: 768px) {
    .header {
      padding: 23px 0 0 23px;
    }
  }
  @media (max-width: 576px) {
    .page-background-image {
      height: 100vh;
      background-image: url('/static/images/referNew/new-reffer-lp-hero-mob.png');
      background-size: cover;
    }
    .guest-pass-card {
      margin-top: 23px;
      max-width: 230px;
    }
  }
`;
