import css from 'styled-jsx/css';

export default css`
  .root {
    width: 238px;
    height: 124px;
    margin-right: 12px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #a9a9a9;
  }
  .wrapper {
    position: relative;
    height: 144px;
    z-index: 0;
  }
  .blur-background {
    position: absolute;
    top: 0px;
    filter: blur(7px);
    border-radius: 40px;
    z-index: -2;
    height: 93%;
    width: 238px;
    opacity: 0.8;
  }
  .content-item-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, cover;
  }
  @media screen and (max-width: 1440px) {
    .root {
      width: 212px;
      height: 110px;
    }
    .wrapper {
      height: 130px;
    }
    .blur-background {
      width: 212px;
    }
  }
  @media screen and (max-width: 1024px) {
    .root {
      width: 188px;
    }
    .blur-background {
      width: 188px;
    }
  }
  @media screen and (max-width: 576px) {
    .root {
      width: 172px;
    }
    .blur-background {
      width: 172px;
    }
  }
`;
