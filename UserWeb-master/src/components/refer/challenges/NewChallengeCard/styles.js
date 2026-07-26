import css from 'styled-jsx/css';

export default css`
  .content-wrapper {
    width: 360px;
  }

  .card-bg {
    background: url('/static/images/referNew/cardBg.png');
    opacity: 1;
    height: 660px;
    position: absolute;
    z-index: -1;
    width: 350px;
  }

  .new-challenge-card {
    width: 100%;
    border-radius: 16px;
    border: 1px solid #fff;
    background: rgba(255, 255, 255, 0.5);
  }

  .new-challenge-content {
    padding: 20px 30px 30px;
  }

  .coach-challenge-content {
    padding: 16px 20px;
  }

  .challenge-card {
    padding: 25px 0 40px;
    width: 100%;
    display: flex;
    /* justify-content: center; */
    flex-direction: column;
    align-items: center;
    height: auto;
    border-radius: 16px;
    background-position: center;
    background-size: cover;
    margin-bottom: 10px;
  }

  .coach-challenge-card {
    padding: 16px 16px 7px;
    align-items: flex-start;
    height: 192px;
    background-position: center;
    justify-content: center;
  }

  .social-proof-wrapper {
    display: flex;
    margin-top: 28px;
    gap: 42px;
    flex-direction: column;
  }

  .coach-challenge-icon-wrapper {
    border-radius: 42px;
    background: rgba(255, 255, 255, 0.32);
    backdrop-filter: blur(5px);
    padding: 4px 8px;
    flex-direction: row;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 4px;
  }

  .social-proof-icons {
    display: flex;
    align-items: center;
    gap: 36px;
    justify-content: center;
  }

  .star-rating {
    display: flex;
    gap: 7px;
    align-items: center;
    width: 100%;
    justify-content: center;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .content-wrapper {
      max-width: 100%;
      margin-top: -13px;
    }
    .card-bg {
      height: 650px;
      position: absolute;
      width: 610px;
      z-index: -1;
      filter: blur(40px);
      margin-left: -40px;
      opacity: 1;
    }
    .challenge-card {
      margin-bottom: 16px;
    }
  }

  @media (max-width: 576px) {
    .card-bg {
      height: 670px;
      width: 100vw;
      position: absolute;
      margin-left: -40px;
      filter: blur(4px);
      max-width: 90vw;
    }
    .new-challenge-content {
      padding: 25px 20px 30px;
    }
    .coach-challenge-content {
      padding: 16px;
    }
    .coach-challenge-card {
      background-position: right !important;
      height: 150px;
    }
    .star-rating {
      flex-direction: column;
      gap: 5px;
      width: auto;
      justify-content: center;
    }
  }
  @media (max-width: 479px) {
    .card-bg {
      margin-left: -20px;
    }
  }
`;
