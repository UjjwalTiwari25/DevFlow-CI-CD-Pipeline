import css from 'styled-jsx/css';

export default css`
  .root {
    width: 216px;
    margin-right: 24px;
    height: 278px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #a9a9a9;
  }
  .wrapper-is-fixed {
    position: relative;
    height: 250px;
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
  .root-is-fixed {
    width: 180px;
    margin-right: 24px;
    height: 216px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #a9a9a9;
    margin-top: 16px;
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
    position: relative;
    overflow: hidden;
  }
  .coach-information {
    margin-left: 4px;
    display: block;
    max-width: 150px;
  }
`;
