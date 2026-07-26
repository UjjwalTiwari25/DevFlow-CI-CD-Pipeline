import css from 'styled-jsx/css';

export default css`
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    margin-top: 32px;
    margin-bottom: 72px;
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
    color: white;
    font-size: 16px;
  }
  .select-border-white {
    border: 1px solid #fff;
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
  .select-background-blue {
    background: linear-gradient(
      -225deg,
      rgb(1, 248, 239) 0%,
      rgb(3, 169, 244) 100%
    );
    box-shadow: 0px 3px 8px -1px rgb(3, 169, 244);
  }
  .unselect-background {
    background-color: rgba(255, 255, 255, 0.2);
  }
  .check {
    width: 22px;
    height: 18px;
  }
`;
