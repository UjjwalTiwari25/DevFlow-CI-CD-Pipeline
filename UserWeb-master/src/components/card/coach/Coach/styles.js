import css from 'styled-jsx/css';

export default css`
  .row {
    justify-content: center;
  }
  .coach-item-container {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 14px;
    flex-direction: column;
    justify-content: flex-end;
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, cover;
  }
  .wrapper {
    position: relative;
    height: 308px;
    z-index: 0;
  }
  .root {
    width: 448px;
    height: 278px;
    border-radius: 16px;
    margin-right: 18px;
    overflow: hidden;
    background-color: #a9a9a9;
  }
  @media screen and (max-width: 1440px) {
    .root {
      width: 378px;
      height: 248px;
    }
    .wrapper {
      height: 278px;
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
  }
  @media screen and (max-width: 576px) {
    .root {
      width: 100%;
      height: 208px;
      margin-right: 16px;
    }
    .wrapper {
      height: 238px;
      width: 45%;
    }
  }
  @media screen and (max-width: 375px) {
    .root {
      height: 190px;
      margin-right: 12px;
    }
    .wrapper {
      height: 215px;
    }
  }
  @media screen and (max-width: 280px) {
    .root {
      width: 100%;
    }
  }
`;
