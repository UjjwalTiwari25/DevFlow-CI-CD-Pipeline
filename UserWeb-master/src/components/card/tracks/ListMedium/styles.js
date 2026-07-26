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
  .item-container {
    text-decoration: none;
    width: 100%;
    height: 100%;
    padding: 14px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, cover;
  }
  .wrapper {
    position: relative;
    height: 318px;
    z-index: 0;
  }
  .blur-background {
    position: absolute;
    top: 0px;
    filter: blur(10px);
    border-radius: 40px;
    z-index: -2;
    height: 93%;
    width: 216px;
  }
  @media (max-width: 1440px) {
    .root {
      width: 176px;
      height: 238px;
    }
    .wrapper {
      height: 278px;
    }
    .blur-background {
      width: 176px;
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
    .wrapper {
      height: 215px;
    }
    .blur-background {
      width: 144px;
    }
  }
`;
