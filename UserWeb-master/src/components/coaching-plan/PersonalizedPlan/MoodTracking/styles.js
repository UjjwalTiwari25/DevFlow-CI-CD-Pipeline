import css from 'styled-jsx/css';

export default css`
  .container {
    margin-top: 70px;
  }
  .mood-tracking {
    display: flex;
    margin-top: 28px;
    align-items: center;
    margin-bottom: 34px;
  }
  .mood-graph {
    width: 111px;
  }
  .chart-container {
    margin-top: 22px;
    display: flex;
    align-items: center;
  }
  .coach-container {
    display: flex;
    justify-content: center;
    position: relative;
    max-width: fit-content;
    margin-left: 15px;
  }
  .coach-image {
    border-radius: 50%;
    width: 29px;
    position: absolute;
    left: -34px;
    top: -13px;
  }
  .tri-right.border.left-top:before {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: -40px;
    right: auto;
    top: -8px;
    bottom: auto;
    border: 32px solid;
    border-color: #666 transparent transparent transparent;
  }
  .tri-right.left-top:after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: -9px;
    right: auto;
    top: 0px;
    bottom: auto;
    border: 22px solid;
    border-color: white transparent transparent transparent;
  }
  .talktext {
    padding: 18px 8px 18px 8px;
    text-align: left;
    background-color: white;
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 3.53%,
        #f4f5ff 16.43%,
        #ecf8ff 35.79%,
        #eefffc 50.45%
      );
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.15);
    border-radius: 8px;
  }
  .talk-bubble {
    position: relative;
  }
  @media screen and (max-width: 576px) {
    .mood-text {
      max-width: 190px;
    }
  }
`;
