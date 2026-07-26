import css from 'styled-jsx/css';

export default css`
  .main {
    margin-top: 47px;
  }
  .topics-container {
    display: inline-flex;
    justify-content: space-between;
    margin-top: 20px;
    width: 100%;
  }
  .container {
    position: relative;
    display: flex;
    flex: 0 48%;
  }
  .single-topic {
    display: flex;
    flex: 0 100%;
    position: relative;
    justify-content: center;
    align-items: center;
    height: 92px;
    margin-bottom: 12px;
    border-radius: 8px;
    background-color: #a9a9a9;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .blur-background {
    width: 156px;
    position: absolute;
    top: 28px;
    height: 70px;
    left: 50%;
    transform: translate(-50%, 0%);
    filter: blur(7px);
  }
  .coach-container {
    display: flex;
    justify-content: center;
    position: relative;
    max-width: fit-content;
    margin-top: 24px;
    margin-left: 42px;
  }
  .coach-image {
    border-radius: 50%;
    width: 29px;
    position: absolute;
    left: -42px;
    top: -13px;
    z-index: 1;
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
    padding: 18px 38px 18px 8px;
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
  .wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width: 576px) {
    .blur-background {
      width: 110px;
      position: absolute;
      top: 28px;
      height: 70px;
      left: 50%;
      transform: translate(-50%, 0%);
      filter: blur(7px);
    }
  }
`;
