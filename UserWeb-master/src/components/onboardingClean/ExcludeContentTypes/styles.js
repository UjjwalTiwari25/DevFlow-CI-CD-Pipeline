import css from 'styled-jsx/css';

export default css`
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    margin-top: 32px;
    margin-bottom: 92px;
  }
  .skip-button-center {
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

export const itemStyle = css`
  .item {
    display: flex;
    flex: 0 100%;
    position: relative;
    justify-content: center;
    align-items: center;
    height: 72px;
    margin-bottom: 16px;
    border-radius: 8px;
    background-color: #a9a9a9;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .check-mark {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 16px;
    color: white;
  }

  .check-icon-box {
    position: absolute;
    left: 22px;
    top: 50%;
    transform: translate(0%, -59%);
    width: 26px;
    height: 26px;
    color: #ffffff;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .select-background {
    background-color: #a4a4a4;
  }
  .unselect-background {
    background-color: rgba(255, 255, 255, 0.2);
  }
  .check {
    width: 100%;
    height: 100%;
  }
  .select-border-white {
    border: 1px solid #fff;
  }
`;
