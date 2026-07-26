import css from 'styled-jsx/css';

export default css`
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    margin-top: 24px;
    margin-bottom: 72px;
  }
  .text-area {
    width: 100%;
    outline: none;
    border: none;
    border-radius: 8px;
    resize: none;
    font-family: Proxima !important;
    padding: 10px;
    border: 1px solid rgba(47, 50, 55, 0.15);
  }
  .text-area-container {
    width: 100%;
    padding: 8px 8px 3px 8px;
    background: #fff;
    border-radius: 8px;
    position: relative;
  }
  .close-button {
    position: absolute;
    right: 16px;
    top: 16px;
    font-size: 10px;
    cursor: pointer;
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
`;
