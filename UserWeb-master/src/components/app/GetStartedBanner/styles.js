import css from 'styled-jsx/css';

export default css`
  .drop-down-icon {
    margin-top: 4px;
    margin-left: 4px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
  }
  .aura-ring-text {
    display: inline-flex;
    margin-top: 4px;
  }
  .player-controls-seo-view {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
  }
  .button-holder {
    flex: 5;
    display: flex;
    justify-content: flex-end;
  }
  .nav-top {
    width: 100%;
    position: fixed;
    z-index: 3;
    background: rgba(255, 255, 255, 255);
    height: 70px;
    padding: 20px 14px 18px 36px;
    left: 0px;
  }

  @media (min-width: 577px) {
    .nav-top {
      width: calc(100vw - 182px);
      left: 182px;
    }
  }
  @media (max-width: 576px) {
    .nav-top {
      padding: 20px 14px 18px 20px;
    }
  }
  @media (max-width: 320px) {
    .nav-top {
      padding-right: 0;
    }
  }
`;
