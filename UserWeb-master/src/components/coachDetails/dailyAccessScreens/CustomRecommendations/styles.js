import css from 'styled-jsx/css';

export default css`
  .chat {
    position: relative;
    overflow: hidden;
  }
  .mobile {
    width: 400px;
  }
  .detail-container {
    position: absolute;
    top: 66px;
    left: 124px;
    width: 235px;
    overflow: hidden;
  }
  .coach-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .margin-top {
    margin-top: 8px;
  }
  .chat-box-white {
    border-radius: 10.3114px;
    padding: 9px 3px 12px 14px;
    max-width: 169px;
    background: #fff;
    height: 240px;
  }
  .mobile-background {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 90%;
  }

  .track-container {
    display: flex;
    margin-top: 10px;
    position: absolute;
  }
  .root {
    width: 110px;
    margin-right: 10px;
    height: 142px;
    border-radius: 6px;
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
    width: 100px;
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
  .blur-background {
    position: absolute;
    top: 0px;
    filter: blur(10px);
    border-radius: 40px;
    z-index: -2;
    height: 93%;
    width: 100px;
    opacity: 0.6;
  }
  .item-container {
    text-decoration: none;
    width: 100%;
    height: 100%;
    padding: 6px;
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
    width: 110px;
    height: 100%;
    padding: 6px;
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
    margin-top: 6px;
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
    width: 21px;
    height: 21px;
    margin-right: 5px;
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
    width: 60px;
  }
  .medium-image {
    margin-top: 5px;
    margin-bottom: 6px;
  }
  @media screen and (max-width: 768px) {
    .chat {
      margin-left: -76px;
    }
  }
`;
