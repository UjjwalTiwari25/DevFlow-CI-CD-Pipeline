import css from 'styled-jsx/css';

export default css`
  @property --c-0 {
    syntax: '<number>';
    initial-value: 1;
    inherits: false;
  }
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    margin-top: 32px;
    position: relative;
  }
  .graph-container {
    position: relative;
  }
  .header-container {
    width: 100%;
  }
  .graph {
    width: 100%;
  }
  .good-text-block {
    position: absolute;
    bottom: 64px;
    left: 13px;
  }
  .target-text-block {
    position: absolute;
    right: 92px;
    top: 39px;
  }
  .target-text-block-exp {
    position: absolute;
    right: 125px;
    top: 42px;
  }
  .aura-help-text {
    margin-top: 20px;
    margin-bottom: 90px;
  }
  .sun-icon {
    width: 42px;
    height: 36px;
    margin-right: 22px;
  }
  .list-container {
    display: flex;
    margin-top: 20px;
    align-items: center;
  }
  .button {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width: 576px) {
    .line-graph-wrapper {
      width: 100vw;
    }
  }
  .list-container2 {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
  }
  .icon-container {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 8px;
  }
  .icon {
    padding: 10px 10px 6px;
  }
`;
