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
    width: 360px;
  }

  .signup-card {
    width: 100%;
    border-radius: 16px;
    border: 1px solid #fff;
    background: rgba(255, 255, 255, 0.5);
  }

  .card-content {
    padding: 16px 20px;
  }

  .track-card {
    padding: 25px 20px 16px;
    width: 100%;
    display: flex;
    /* justify-content: center; */
    height: auto;
    border-radius: 16px;
    background-position: center;
    background-size: cover;
    margin-bottom: 10px;
    height: 215px;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .social-proof-wrapper {
    display: flex;
    margin-top: 28px;
    gap: 42px;
    flex-direction: column;
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
  }

  .track-info-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .coach-info-wrapper {
    display: flex;
    align-items: center;
    padding-top: 13px;
    border-top: 1px solid #ffffff4d;
    width: 100%;
    gap: 12px;
  }

  .type-wrapper {
    display: flex;
    gap: 5px;
    align-items: center;
    margin-bottom: 10px;
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
      width: 90vw;
      position: absolute;
      margin-left: -40px;
      filter: blur(4px);
    }
    .card-content {
      padding: 10px 16px;
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
