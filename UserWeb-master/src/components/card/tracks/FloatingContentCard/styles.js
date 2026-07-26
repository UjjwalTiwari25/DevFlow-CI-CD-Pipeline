import css from 'styled-jsx/css';

export default css`
  .root {
    width: 216px;
    height: 278px;
    margin-right: 24px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #a9a9a9;
  }
  .grid-root {
    width: 186px;
    height: 250px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #a9a9a9;
    margin-right: 24px;
  }
  .content-preview-root {
    width: 250px;
    margin-right: 24px;
    height: 274px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #a9a9a9;
  }
  .root-is-fixed {
    width: 172px;
    margin-right: 24px;
    height: 216px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #a9a9a9;
    margin-top: 16px;
  }
  .root-coach-plan {
    width: 172px;
    margin-right: 24px;
    height: 216px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #a9a9a9;
    margin-top: 16px;
  }
  .root-vp-copy {
    width: 172px;
    margin-right: 12px;
    height: 216px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #a9a9a9;
    margin-top: 16px;
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
    height: 318px;
    z-index: 0;
  }
  .content-wrapper {
    position: relative;
    height: 318px;
    z-index: 0;
  }
  .grid-wrapper {
    position: relative;
    height: 272px;
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
  .blur-background-short {
    position: absolute;
    border-radius: 40px;
    z-index: -2;
    opacity: 0.6;
    width: 140px;
    left: 50%;
    transform: translate(-50%, 0%);
    filter: blur(12px);
    height: 90%;
    top: 5px;
  }
  .blur-background-fixed {
    width: 140px;
    height: 190px;
    position: absolute;
    top: 32px;
    mix-blend-mode: multiply;
    filter: blur(14px);
    border-radius: 9px;
    left: 22px;
  }
  .blur-background-vp {
    width: 140px;
    height: 190px;
    position: absolute;
    top: 32px;
    mix-blend-mode: multiply;
    filter: blur(14px);
    border-radius: 9px;
    left: 22px;
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
  }
  .track-type-down {
    margin-bottom: 10px;
  }
  .coach-container {
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 20px;
    left: 10px;
  }
  .align-end {
    align-items: flex-end;
  }
  .coach-thumbnail {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    margin-right: 6px;
    position: relative;
    overflow: hidden;
  }
  .coach-information {
    margin-left: 4px;
    display: block;
    max-width: 150px;
  }
  .content-coach-info {
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
  @media (max-width: 1440px) {
    .root {
      width: 176px;
      height: 238px;
    }
    .content-preview-root {
      width: 206px;
      height: 230px;
    }
    .wrapper {
      height: 278px;
    }
    .content-wrapper {
      height: 232px;
    }
    .blur-background {
      width: 176px;
    }
    .coach-information {
      max-width: 100px;
    }
    .content-coach-info {
      max-width: 120px;
    }
  }
  @media screen and (max-width: 1024px) {
    .root {
      width: 156px;
      height: 218px;
    }
    .wrapper {
      height: 238px;
    }
    .blur-background {
      width: 156px;
    }
  }
  @media screen and (max-width: 576px) {
    .root {
      width: 144px;
      height: 190px;
      margin-right: 12px;
    }
    .grid-root {
      width: 170px;
      height: 206px;
      margin-right: 12px;
    }
    .content-preview-root {
      width: 210px;
      height: 216px;
    }
    .wrapper {
      height: 215px;
    }
    .grid-wrapper {
      height: 224px;
    }
    .blur-background {
      width: 144px;
    }
    .track-type {
      margin-top: 0px;
    }
    .coach-information {
      max-width: 90px;
    }
    .content-coach-info {
      max-width: 120px;
    }
    .coach-container {
      bottom: 15px;
    }
    .root-coach-plan {
      width: 141px;
      height: 172px;
    }
  }
  @media screen and (max-width: 376px) {
    .content-preview-root {
      width: 200px;
      height: 214px;
    }
    .grid-root {
      width: 164px;
    }
  }
  @media screen and (max-width: 360px) {
    .blur-background-vp {
      width: 120px;
    }
    .grid-root {
      width: 144px;
      height: 184px;
    }
    .grid-wrapper {
      height: 204px;
    }
    .root-vp-copy {
      width: 152px;
    }
  }
  @media screen and (max-width: 320px) {
    .content-preview-root {
      width: 180px;
      height: 190px;
    }
    .blur-background-vp {
      width: 110px;
    }
    .root-vp-copy {
      width: 142px;
    }
    .grid-root {
      width: 126px;
      height: 184px;
    }
  }
`;
