import css from 'styled-jsx/css';

export default css`
  .selection-container {
    background: #ffffff;
    box-shadow: 0px 4px 20px rgba(43, 42, 107, 0.15);
    border-radius: 8px;
    padding: 10px;
    margin-right: 13px;
  }
  .container {
    background: rgba(255, 255, 255);
    border-radius: 6px;
    position: absolute;
    width: fit-content;
    min-width: calc(100% - 13px);
    top: 39px;
    z-index: 7;
    padding: 5px 2px;
    overflow: hidden;
  }
  .hr {
    border: none;
    height: 1px;
    background: rgba(0, 0, 0, 0.4);
    margin-top: 4px;
    margin-bottom: 4px;
    width: 100%;
  }
`;
