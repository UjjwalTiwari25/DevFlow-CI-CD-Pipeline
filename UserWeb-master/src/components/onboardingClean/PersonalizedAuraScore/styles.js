import css from 'styled-jsx/css';

export default css`
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 32px;
    border-radius: 8px;
    position: relative;
    justify-content: center;
  }
  .w100 {
    width: 100%;
  }
  .progress-bar-grey {
    height: 8px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.08);
  }
  .progress-bar-shaded {
    width: 85%;
    height: 8px;
    border-radius: 16px;
    opacity: 0.2;
    position: absolute;
    top: 0;
  }
  .current-progress {
    width: 66%;
    height: 8px;
    border-radius: 16px;
    position: absolute;
    top: 0;
  }
  .aura-gradient {
    background: linear-gradient(
      90deg,
      #f3ff69 -1.89%,
      #ff9473 28.53%,
      #ffadf7 58.94%,
      #84bcff 89.36%,
      #65ff3f 119.78%
    );
  }
  .target {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    position: absolute;
    top: -19px;
    right: 36px;
  }
  .target-icon {
    margin-bottom: 17px;
  }
  .scores {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 16px;
    margin-top: 16px;
    padding-bottom: 20px;
  }
  .target2 {
    position: absolute;
    top: -19px;
    right: 45px;
  }
  .wellness-gradient {
    background: linear-gradient(90deg, #ffffff 0%, #e42db1 100%);
  }
  .sleep-gradient {
    background: linear-gradient(90deg, #ffffff 0%, #7cd175 100%);
  }
  .productivity-gradient {
    background: linear-gradient(90deg, #ffffff 0%, #8934f5 100%);
  }
  .meditation-gradient {
    background: linear-gradient(90deg, #ffffff 0%, #ffd976 100%);
  }
  .positivity-gradient {
    background: linear-gradient(90deg, #ffffff 0%, #46cbf5 100%);
  }
  .relationship-gradient {
    background: linear-gradient(90deg, #ffffff 0%, #ff511b 100%);
  }
  .social-proof-container {
    margin-top: 63px;
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 90px;
  }
`;
