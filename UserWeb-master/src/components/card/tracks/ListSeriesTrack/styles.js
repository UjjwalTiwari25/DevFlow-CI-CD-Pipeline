import css from 'styled-jsx/css';

export default css`
  .track-container {
    margin-top: 20px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
  }
  .track-info {
    padding: 18px 21px 7px;
  }
  .track-photo-container {
    margin-right: 23px;
  }
  .duration-container {
    margin-top: 16px;
  }
  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #9092a3;
    margin: 0 6px;
  }
  .text {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .hr {
    border: none;
    height: 1px;
    background: #9092a3;
    margin-top: 10px;
    margin-bottom: 0px;
    opacity: 0.2;
  }
  .coach-info {
    padding: 18px 21px;
    justify-content: space-between;
  }
  .coach-photo {
    min-width: 41px;
    height: 41px;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    overflow: hidden;
  }
  .coach-name {
    margin-left: 14px;
  }
  .button {
    width: 99px;
    height: 39px;
    border-radius: 99px;
  }
  .green-background {
    background: linear-gradient(
      242.1deg,
      #5ce4b3 17.31%,
      #cbe975 82.69%,
      #9dd500 82.69%
    );
  }
  .blue-background {
    background: linear-gradient(277.58deg, #4ec8ff 5.87%, #1df4ed 94.13%);
  }
  .white {
    box-shadow: 0px 0px 11px 1px rgb(0 0 0 / 10%);
  }
  .played-icon {
    width: 10px;
    height: 7px;
    margin-left: 25px;
  }
  .invert {
    filter: invert(1);
  }
  .next {
    width: 14px;
    height: 13px;
    margin-left: 25px;
  }
  .background-series {
    display: none;
  }
  @media screen and (max-width: 576px) {
    .next {
      margin-left: 10px;
    }
    .played-icon {
      margin-left: 10px;
    }
    .duration-container {
      margin-top: 10px;
    }
  }
`;
