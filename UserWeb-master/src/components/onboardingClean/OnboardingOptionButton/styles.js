import css from 'styled-jsx/css';

export default css`
  #btn-card {
    height: 68px;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 8px;
    padding: 0px 34px;
  }
  #btn-card-short {
    height: 58px;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 8px;
    padding: 0px 34px;
  }
  .button-shadow {
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.1);
  }
  .select-border-blue {
    border: 2px solid #5ac8fa !important;
  }
  .rainbow-color {
    background: linear-gradient(
      90deg,
      #ffebfb 0.81%,
      #cfd3ff 28.06%,
      #d2edfd 69%,
      #e5fef9 100%
    ) !important;
    border: 1px solid #000000;
    box-shadow: 0px 7px 40px rgba(125, 133, 153, 0.1) !important;
    animation: mymove 0.7s linear;
  }
  .rainbow-button-shadow:hover {
    background: linear-gradient(
      90deg,
      #ffebfb 0.81%,
      #cfd3ff 28.06%,
      #d2edfd 69%,
      #e5fef9 100%
    ) !important;
    border: 1px solid #000000;
    box-shadow: 0px 7px 40px rgba(125, 133, 153, 0.1) !important;
  }

  @keyframes mymove {
    from {
      opacity: 0.1;
    }
    to {
      opacity: 1;
    }
  }
`;
