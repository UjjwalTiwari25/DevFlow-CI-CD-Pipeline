import css from 'styled-jsx/css';

export default css`
  .time-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .time-wrapper {
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    width: 148px;
    align-items: center;
  }
  .stream-url {
    display: inline-block;
    padding: 2px 12px;
    width: 100%;
  }
  .duration7-active-stream {
    background-color: rgba(227, 226, 226, 0.5);
    border-radius: 0 16px 16px 0;
    border: 2px solid transparent;
  }
  .inactive-stream {
    color: rgba(227, 226, 226, 0.9);
    cursor: pointer;
  }
  .active-stream-single {
    background-color: rgba(227, 226, 226, 0.5);
    border-radius: 16px;
    border: 2px solid transparent;
  }
  .active-stream-multiple {
    background-color: rgba(227, 226, 226, 0.5);
    border-radius: 16px 0 0 16px;
    border: 2px solid transparent;
  }
`;
