import css from 'styled-jsx/css';

export default css`
  .disable-scrollbars::-webkit-scrollbar {
    display: none;
    background: transparent; /* Chrome/Safari/Webkit */
  }

  .disable-scrollbars {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  .scroll-wrapper {
    display: inline-flex;
    overflow-x: scroll;
    width: 100%;
    position: relative;
    scroll-behavior: smooth;
  }
  .wrapper {
    overflow: hidden;
  }
  button {
    outline: none;
  }
  .chevron-container {
    width: 7vh;
    height: 7vh;
    border-radius: 7vh;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 2px 8px 20px 4px #7777;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .chevron-container-props {
    width: 4vw;
    height: 4vw;
    border-radius: 7vh;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 2px 8px 20px 4px #7777;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .chevron-container-testimonial {
    width: 7vh;
    height: 7vh;
    border-radius: 7vh;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 2px 8px 20px 4px #7777;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.5;
  }
  .chevron-container-coach {
    width: 2vw;
    height: 2vw;
  }
  .chevron-right {
    z-index: 2;
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translate(0, -50%);
  }
  .chevron-right-coach {
    z-index: 2;
    position: absolute;
    right: -50px;
    top: 38%;
  }
  .chevron-right-coach-props {
    z-index: 2;
    position: absolute;
    right: -60px;
    top: 50%;
    transform: translate(0, -66%);
  }
  .chevron-left {
    z-index: 2;
    position: absolute;
    left: -18px;
    top: 50%;
    transform: translate(0, -50%);
  }
  .chevron-left-coach {
    z-index: 2;
    position: absolute;
    left: -50px;
    top: 38%;
  }
  .chevron-left-coach-props {
    z-index: 2;
    position: absolute;
    right: 320px;
    top: 50%;
    transform: translate(0, -66%);
  }
  .chevron-left-testimonial {
    z-index: 2;
    position: absolute;
    left: -3px;
    top: 50%;
    transform: translate(0, -50%);
  }
  .chevron-icon {
    margin: 4px;
    color: #8d8d8d;
    font-size: 32px;
  }
  .chevron-icon-low-opacity {
    margin: 4px;
    color: #9092a3;
    font-size: 32px;
    opacity: 0.5;
  }
  .chevron-icon-small {
    margin: 4px;
    color: #8d8d8d;
    font-size: 22px;
  }
  .container {
    width: 100%;
  }
  .position {
    position: relative;
  }
  .fixed-height {
    height: 274px;
  }
  @media screen and (min-width: 1440px) {
    .chevron-icon-small {
      font-size: 3vw;
    }
    .chevron-container-coach {
      width: 4vh;
      height: 4vh;
    }
    .chevron-right-coach {
      right: -70px;
    }
    .chevron-left-coach {
      left: -70px;
    }
    .chevron-container-props {
      width: 3vw;
      height: 3vw;
    }
    .chevron-right-coach-props {
      right: -70px;
    }
  }
  @media screen and (min-width: 1024px) {
    .chevron-icon {
      font-size: 42px;
    }
    .scroll-wrapper {
      overflow: auto;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
    .chevron-icon {
      font-size: 42px;
    }
    .scroll-wrapper {
      overflow: hidden;
    }
    .chevron-left-coach {
      left: -32px;
    }
  }
  @media screen and (max-width: 576px) {
    .chevron-container {
      display: none;
    }
    .chevron-container-testimonial {
      display: none;
    }
    .position-absolute {
      position: absolute;
      left: 0px;
    }
  }
`;
