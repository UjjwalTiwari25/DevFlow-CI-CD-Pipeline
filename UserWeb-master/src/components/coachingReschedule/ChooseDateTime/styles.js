import css from 'styled-jsx/css';

export default css`
  .coach-row-info {
    padding-top: 42px;
    margin-left: 0px;
    position: relative;
    z-index: 1;
    padding-bottom: 20px;
    max-width: 375px;
    min-height: 90vh;
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
  .coach-image {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    z-index: 1;
  }
  .session-info {
    margin-top: 14px;
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
    height: 100%;
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
  }
  .single-date-selected {
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 0.81%,
        #f4f5ff 28.06%,
        #ecf8ff 69%,
        #eefffc 100%
      );
    box-shadow: 0px 12px 50px rgba(43, 42, 107, 0.2);
    border-radius: 4px;
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
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    position: relative;
    z-index: 1;
  }
  .coach-container {
    width: 131px;
    height: 131px;
  }
  .rainbow {
    position: absolute;
    width: 60%;
  }
`;
