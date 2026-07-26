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
  .select-border-white {
    border: 1px solid #fff;
  }
  .check-mark {
    position: absolute;
    top: 5%;
    right: 5%;
    color: white;
  }
  .content-icons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
  }
  .content-icons {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .content-icons2 {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 20px;
  }
  .label-container {
    position: absolute;
    z-index: 1;
    padding: 2px 12px;
    border-radius: 99px;
  }
  .label-conatiner-top-right {
    right: 5px;
    top: 7px;
  }
  .green-background {
    background: linear-gradient(90deg, #00ff75 0%, #9fea00 100%);
  }
  .gray-background {
    background: rgba(91, 101, 122, 1);
  }
  .blue-background {
    background: linear-gradient(270deg, #1df5ed -3.23%, #4ccaff 95.81%);
  }
`;
