import css from 'styled-jsx/css';

export default css`
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 32px;
    border-radius: 8px;
    position: relative;
    justify-content: center;
  }
  .w100 {
    width: 100%;
  }
  .relative {
    position: relative;
  }
  .progress-bar {
    margin-left: -12px;
    width: 100%;
  }
  .traget-progress {
    display: flex;
    position: absolute;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: -34px;
    right: 58px;
  }
  .score-container {
    position: absolute;
    top: 11px;
    left: 11px;
  }
  .progress-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.08);
    display: flex;
  }
  .white-dot {
    background: #fff;
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }
  .scores {
    display: flex;
    flex-direction: column;
    background: rgba(2s55, 255, 255, 0.08);
    border-radius: 12px;
    padding: 12px;
    margin-top: 16px;
    margin-bottom: 120px;
  }

  .button-center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translate(-50%, 0%);
  }
`;
