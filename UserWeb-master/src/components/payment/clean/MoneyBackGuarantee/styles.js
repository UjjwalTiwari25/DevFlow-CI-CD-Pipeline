import css from 'styled-jsx/css';

export default css`
  .card {
    background: rgba(255, 255, 255, 0.5);
    background-size: cover;
    background-image: url('/static/images/guaranteeBackground.png');
    border: none;
    border-radius: 6px;
    max-width: 420px;
    display: flex;
    align-items: center;
    padding: 24px;
    backdrop-filter: blur(5px);
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .support-others {
    width: 67px;
    height: 67px;
  }
  .padding {
    padding: 20px;
  }
  .guarantee1 {
    position: absolute;
    width: 18px;
    bottom: 4px;
    left: -7px;
  }
  .guarantee2 {
    position: absolute;
    width: 36px;
  }
  .circle {
    height: 74px;
    width: 74px;
    background: #fff;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon {
    position: relative;
    width: 36px;
    height: 36px;
    margin-left: 5px;
    margin-top: 5px;
  }
  .low-opacity {
    background: rgba(255, 255, 255, 0.1);
  }
`;
