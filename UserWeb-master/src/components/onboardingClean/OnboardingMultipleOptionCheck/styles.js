import css from 'styled-jsx/css';

export default css`
  .option-div {
    position: relative;
    width: 100%;
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
    background-color: #e4e4e4;
  }
  .check {
    width: 14px;
    height: 12px;
  }
`;
