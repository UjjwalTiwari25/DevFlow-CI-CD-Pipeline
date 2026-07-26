import css from 'styled-jsx/css';

export default css`
  .main-wrapper {
    position: relative;
    z-index: 1;
    overflow: hidden;
    min-height: 100vh;
    /* padding-bottom: 40px; */
  }
  .aura-background {
    position: absolute;
    width: 100%;
    top: 0px;
    height: 100%;
  }
  .main {
    max-width: 420px;
    padding: 40px 16px;
    position: relative;
    overflow: hidden;
  }
  .star {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  .star-container {
    margin-top: 30px;
  }
  .coach-cards {
    width: 90%;
    padding-left: 14px;
    justify-content: flex-start;
  }
  .coach-cards-wrapper {
    justify-content: center;
    width: 100%;
  }
  .left-icon {
    color: #fff;
    font-size: 20px;
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .search-wrapper {
    width: 100%;
    padding: 0 16px;
    margin-top: 48px;
    max-width: 420px;
  }
  .search-icon {
    width: 14px;
    height: 14px;
    margin-right: 10px;
  }
  .search-icon-wrapper {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    padding: 12px;
    width: 100%;
    margin-top: 27px;
  }
  .search-input {
    background: transparent;
    border: none;
    outline: none;
    color: rgba(255, 255, 255, 0.64);
  }
  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.64);
  }
  .coach-container {
    margin-top: 28px;
  }
  .coach-photo {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
  }
  .coach-shadow {
    position: absolute;
  }
  .skip-button {
    position: absolute;
    right: 54px;
    top: 43px;
    z-index: 2;
    font-size: 30px;
    color: #fff;
  }
  .skip-button-2 {
    position: absolute;
    right: 40px;
    top: 43px;
    z-index: 2;
    width: 70px;
    height: 24px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.1);
  }
  .close-button {
    width: 13px;
    height: 16px;
  }
  .br {
    width: 100%;
    border: none;
    height: 1px;
    background: rgba(255, 255, 255, 0.75);
    position: absolute;
    bottom: 3px;
  }
  @media screen and (max-width: 576px) {
    .aura-background {
      height: auto;
    }
  }
`;
