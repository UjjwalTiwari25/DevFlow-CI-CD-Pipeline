import css from 'styled-jsx/css';

export default css`
  .coach-row-info {
    margin-top: 0px;
    margin-left: 0px;
    position: relative;
    z-index: 2;
  }
  .hr {
    width: 100%;
    margin-top: 0px;
    margin-bottom: 0px;
    border: none;
    height: 1px;
    background: #9092a3;
    opacity: 0.2;
  }
  .coach-image-container {
    overflow: hidden;
    margin-right: 0px;
    width: 169px;
    height: 121px;
  }
  .coach-image {
    width: 100%;
  }
  .session-info {
    margin-top: 20px;
    align-items: center;
  }
  .timing-slots-container {
    margin-top: 45px;
    position: relative;
    width: 100%;
  }
  .background-slots {
    position: absolute;
    height: 400px;
    border-radius: 52px;
    bottom: -140px;
    width: 100vw;
  }
  .timing {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.5);
    position: relative;
    padding: 22px 22px;
    width: 100%;
    justify-content: space-between;
    margin-top: 9px;
  }
`;
