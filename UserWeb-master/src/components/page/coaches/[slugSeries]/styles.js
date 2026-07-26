import css from 'styled-jsx/css';

export default css`
  .outer-wrap {
    display: inline-flex;
    margin-top: 50px;
    padding-left: 42px;
  }
  .photo {
    width: 177px;
    height: 177px;
    border-radius: 10px;
  }
  .series-info {
    margin-left: 31px;
  }
  .coach-container {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    width: 366px;
    padding: 18px;
    margin-top: 16px;
  }
  .background-series {
    display: none;
  }
  .coach {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    overflow: hidden;
  }
  .coach-info {
    margin-left: 26px;
  }
  .country-details {
    margin-top: 10px;
  }
  .flag {
    width: 12px;
    height: 8px;
    margin-right: 4px;
  }
  .subs {
    width: 13px;
    height: 11px;
    margin-right: 4px;
    margin-left: 12px;
  }
  .tracks-container {
    margin-top: 36px;
    position: relative;
    margin-bottom: 30px;
  }
  .track-container {
    margin-top: 20px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
  }
  .track-info {
    padding: 18px 21px 7px;
  }
  .track-photo {
    width: 86px;
    height: 116px;
    border-radius: 10px;
    margin-right: 23px;
  }
  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(144, 146, 163, 0.5);
    margin: 0 6px;
  }
  .intro {
    max-width: 580px;
    margin-top: 52px;
    z-index: 2;
  }
  .mobile-only {
    display: none;
  }
  .desktop-only {
    display: block;
  }

  @media screen and (max-width: 576px) {
    .mobile-only {
      display: block;
    }
    .desktop-only {
      display: none;
    }
    .only-desktop {
      display: none;
    }
    .series-info-mobile {
      position: absolute;
      top: 0px;
      left: 0px;
      padding: 20px 16px;
      min-height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
    }
    .photo-shadow {
      position: absolute;
      height: 177px;
      border-radius: 10px;
      bottom: -8px;
      width: 80%;
      left: 50%;
      transform: translate(-50%, 0px);
      filter: blur(24px);
    }
    .outer-wrap {
      margin-top: 0px;
      padding: 0 16px;
      margin-bottom: 46px;
      width: 100%;
    }
    .mobile-wrapper {
      flex-direction: column;
      align-items: center;
    }
    .series-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
      margin-left: 0px;
    }
    .tracks-container {
      margin-top: 20px;
    }
    .photo {
      width: 172px;
      height: 216px;
      border-radius: 10px;
      position: relative;
      z-index: 1;
    }
    .coach-container {
      z-index: 2;
      width: 100%;
    }
    .coach-information {
      margin-top: 48px;
    }
    .coach-mobile {
      min-width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }

    .background-series {
      display: block;
      position: absolute;
      top: 0px;
      width: 100%;
      height: 100%;
      filter: blur(100px);
      opacity: 0.6;
    }
  }
`;
