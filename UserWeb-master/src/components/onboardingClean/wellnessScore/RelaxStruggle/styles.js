import css from 'styled-jsx/css';

export default css`
  .item-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 76px;
    position: relative;
  }
  .item {
    width: 51px;
    height: 66px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0px 3px 6px -2px #888888;
  }
  .text-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }
`;
