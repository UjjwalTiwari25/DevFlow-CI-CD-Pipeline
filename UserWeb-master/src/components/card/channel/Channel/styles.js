import css from 'styled-jsx/css';

export default css`
  .channel-item-container {
    display: flex;
    padding: 14px;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: flex-end;
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, cover;
  }
  .wrapper {
    position: relative;
    height: 308px;
  }
  .blur-background {
    position: absolute;
    top: 0px;
    filter: blur(10px);
    border-radius: 40px;
    z-index: -2;
    height: 93%;
    width: 430px;
    overflow: hidden;
  }
  .root {
    border-radius: 16px;
    height: 278px;
    margin-right: 18px;
    overflow: hidden;
    width: 430px;
    background-color: #a9a9a9;
  }
  a {
    color: white;
    text-decoration: none;
  }
  a:hover {
    opacity: 0.9;
    color: white;
    text-decoration: none;
  }
  .subscriber-icon {
    color: rgb(128, 128, 128, 0.77);
    margin-right: 4px;
    margin-top: 2px;
    font-size: 16px;
  }
  @media screen and (max-width: 1440px) {
    .root {
      width: 378px;
      height: 248px;
    }
    .wrapper {
      height: 278px;
      z-index: 0;
      position: relative;
    }
    .blur-background {
      width: 378px;
    }
  }
  @media screen and (max-width: 1024px) {
    .root {
      width: 302px;
      height: 218px;
    }
    .wrapper {
      height: 248px;
    }
    .blur-background {
      width: 302px;
    }
  }
  @media screen and (max-width: 576px) {
    .root {
      width: 288px;
      height: 208px;
      margin-right: 16px;
    }
    .wrapper {
      height: 230px;
    }
    .blur-background {
      width: 288px;
    }
  }
  @media screen and (max-width: 320px) {
    .root {
      width: 248px;
      height: 190px;
      margin-right: 12px;
    }
    .wrapper {
      height: 215px;
    }
    .blur-background {
      width: 248px;
    }
  }
`;
