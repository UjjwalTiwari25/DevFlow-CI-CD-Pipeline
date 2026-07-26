import css from 'styled-jsx/css';

export default css`
  .root {
    width: 190px;
    margin-right: 24px;
    margin-top: 24px;
    height: 278px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #a9a9a9;
  }
  .coach-container-is-fixed {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 20px;
    left: 10px;
  }
  .wrapper {
    position: relative;
    z-index: 0;
  }
  .wrapper-is-fixed {
    position: relative;
    height: 250px;
  }
  .blur-background {
    position: absolute;
    top: 0px;
    filter: blur(10px);
    border-radius: 40px;
    z-index: -2;
    height: 93%;
    width: 216px;
    opacity: 0.6;
  }
  .item-container {
    text-decoration: none;
    width: 100%;
    height: 100%;
    padding: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, cover;
    position: relative;
  }
  .track-type {
    margin-top: 12px;
    margin-bottom: 10px;
  }
  .track-type-down {
    margin-top: 12px;
  }
  .coach-container {
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 20px;
    left: 10px;
  }
  .coach-thumbnail {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    margin-right: 6px;
  }
  .coach-information {
    margin-left: 4px;
    display: block;
    max-width: 150px;
  }
  .coach-information-new-yp {
    margin-left: 4px;
    display: block;
    max-width: 100%;
  }
  .coach-alignment {
    height: 100%;
    display: flex;
    align-items: flex-end;
  }
  .margin-right {
    margin-right: 12px;
  }
  .wide-card {
    width: 180px;
  }
  .icon {
    height: 12px;
    margin-right: 6px;
    filter: brightness(0) invert(1);
  }
  @media (max-width: 1440px) {
    .root {
      width: 190px;
      height: 238px;
    }
    .blur-background {
      width: 176px;
    }
    .coach-information {
      max-width: 100px;
    }
  }
  @media screen and (max-width: 1024px) {
    .root {
      width: 190px;
      height: 242px;
    }
    .blur-background {
      width: 156px;
    }
  }
  @media screen and (max-width: 576px) {
    .root {
      width: 166px;
      height: 224px;
      margin-right: 12px;
      margin-top: 12px;
    }
    .track-type {
      margin-top: 0px;
    }
    .coach-information {
      max-width: 90px;
    }
    .coach-container {
      bottom: 15px;
    }
    .root-coach-plan {
      width: 141px;
      height: 172px;
    }
  }
  @media screen and (max-width: 360px) {
    .root {
      width: 154px;
      height: 214px;
    }
  }
  @media screen and (max-width: 320px) {
    .root {
      width: 138px;
      height: 196px;
    }
  }
`;
