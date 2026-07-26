import css from 'styled-jsx/css';

export default css`
  .coach-row-info {
    margin-top: 0px;
    margin-left: 0px;
    position: relative;
    z-index: 1;
  }
  .hr {
    width: 100%;
    margin-top: 17px;
    margin-bottom: 0px;
    border: none;
    height: 1px;
    background: #9092a3;
    opacity: 0.2;
  }
  .hr2 {
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
    width: 100vw;
    left: -20px;
    filter: blur(50px);
    top: -44px;
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
  .date-container {
    padding-left: 34px;
    padding-right: 10px;
    width: 100%;
    overflow: scroll;
    padding-top: 12px;
    padding-bottom: 12px;
    z-index: 1;
  }
  .single-date {
    min-width: fit-content;
    margin-right: 10px;
    height: 32px;
    padding: 0px 8px;
    color: rgba(47, 50, 55, 1);
  }
  .single-date-selected {
    background: linear-gradient(270deg, #48f2f4, #04aaf4 100%);
    box-shadow: 0px 12px 50px rgba(43, 42, 107, 0.2);
    border-radius: 4px;
    color: #fff !important;
  }
  ::-webkit-scrollbar {
    display: none;
    background: transparent; /* Chrome/Safari/Webkit */
  }
  .time-container {
    margin-top: 12px;
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-gap: 10px;
  }
  .time {
    width: 100px;
    height: 50px;
    background: #9092a314;
    border-radius: 8px;
    position: relative;
    z-index: 1;
    color: #4e545f;
  }
  .availbility-header {
    margin-top: 45px;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .spot-left {
    background: linear-gradient(
      89.96deg,
      #ff4c4c 0.03%,
      #ff00b8 99.97%,
      #fc323e 99.97%,
      #fc323e 99.97%
    );
    padding: 3px 8px;
    opacity: 0.6;
    color: #fff;
    border-radius: 50px;
  }
  .timing-slots-container-video {
    margin: 0;
    max-width: 400px;
  }
`;
