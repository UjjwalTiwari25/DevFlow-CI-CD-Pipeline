import css from 'styled-jsx/css';

export default css`
  .container {
    margin-top: 70px;
  }
  .track-container {
    display: flex;
    margin-top: 10px;
  }
  .root {
    width: 166px;
    margin-right: 24px;
    height: 200px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #fff;
    position: relative;
    box-shadow: 0px 20.5722px 24.6866px 8.22888px rgba(134, 216, 255, 0.1);
  }
  .position {
    position: relative;
  }
  .track-shadow {
    position: absolute;
    top: 14px;
    width: 160px;
    left: 4px;
    filter: blur(12px);
  }
  .shadow {
    box-shadow: 0px 9.87466px 32.9155px rgba(0, 0, 0, 0.1);
  }
  .blur-image {
    position: absolute;
    width: 130px;
    height: 140px;
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
    box-shadow: 0px 20.5722px 24.6866px 8.22888px rgba(134, 216, 255, 0.1);
  }
  .article-container {
    text-decoration: none;
    width: 100%;
    height: 100%;
    padding: 14px;
    display: flex;
    flex-direction: column;
    align-items: left;
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, cover;
    position: relative;
    box-shadow: 0px 9.87466px 32.9155px rgba(0, 0, 0, 0.1);
  }
  .track-type {
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
  .coach-alignment {
    height: 100%;
    display: flex;
    align-items: flex-end;
  }
  .medium {
    width: 100px;
  }
  .medium-image {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  @media (max-width: 1440px) {
    .root {
      width: 176px;
      height: 200px;
    }
    .track-shadow {
      position: absolute;
      top: 3px;
      width: 168px;
      left: 4px;
      filter: blur(12px);
    }
    .wrapper {
      height: 278px;
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
      width: 156px;
      height: 200px;
    }
    .track-shadow {
      top: 30px;
      width: 148px;
      left: 4px;
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
      width: 141px;
      height: 172px;
      margin-right: 12px;
    }
    .track-shadow {
      top: 22px;
      width: 130px;
      left: 4px;
    }
    .wrapper {
      height: 215px;
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
    .coach-container {
      bottom: 15px;
    }
    .root-coach-plan {
      width: 141px;
      height: 172px;
    }
    .medium {
      width: 62px;
    }
  }
`;
