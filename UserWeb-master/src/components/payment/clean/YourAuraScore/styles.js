import css from 'styled-jsx/css';

export default css`
  .aura-score-card {
    background: rgba(255, 255, 255, 0.5);
    background-size: cover;
    background-image: url('/static/images/guaranteeBackground.png');
    border: none;
    border-radius: 6px;
    max-width: 420px;
    display: flex;
    align-items: center;
    backdrop-filter: blur(5px);
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .less-margin {
    margin-top: 0px;
    margin-bottom: 40px;
  }
  .low-opacity {
    background: rgba(255, 255, 255, 0.1);
  }
  .header {
    padding: 24px 24px 0 24px;
    width: 100%;
  }
  .based-on-text {
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    -webkit-text-fill-color: transparent;
    text-fill-color: transparent;
  }
  .sleep-text {
    background: linear-gradient(69.13deg, #08caff -14.01%, #fb4cff 107.43%);
    background-clip: text;
    -webkit-background-clip: text;
  }
  .wellness-text {
    background: linear-gradient(244.21deg, #ff9e34 -6.51%, #ff2b3a 71.25%);
    background-clip: text;
    -webkit-background-clip: text;
  }
  .interest-text {
    background: linear-gradient(244.16deg, #fff974 34.48%, #00ff57 92.97%);
    background-clip: text;
    -webkit-background-clip: text;
  }
  .based-on-section {
    display: flex;
    width: 100%;
    gap: 12px;
    margin-top: 5px;
    margin-bottom: 35px;
  }
  .based-on-value {
    display: flex;
    align-item: center;
  }
  .dot-icon {
    height: 10px;
    width: 10px;
    margin-left: 5px;
    margin-top: 2px;
  }
  .graph-container {
    position: relative;
  }
  .graph {
    width: 100%;
  }

  @media screen and (min-width: 576px) {
    .based-on-section {
      justify-content: center;
    }
  }
`;
