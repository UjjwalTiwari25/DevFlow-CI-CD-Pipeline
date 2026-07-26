import css from 'styled-jsx/css';

export default css`
  .header-container {
    z-index: 10;
  }
  .item-container-exp {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: flex-start;
    overflow: scroll;
  }
  ::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  .button-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .inactive-dot {
    width: 8px;
    height: 8px;
    background-color: #9092a3;
    border-radius: 50%;
    margin-right: 10px;
    opacity: 0.4;
  }
  .active-dot {
    background: linear-gradient(41.27deg, #4ec8ff 7.79%, #1df4ed 76.38%);
    box-shadow: inset 0px -1px 0px rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    width: 12px;
    height: 12px;
    margin-right: 10px;
  }
  .dot-container {
    display: flex;
    align-items: center;
  }
  .single-dot-container {
    position: relative;
  }
  .dot-shadow {
    width: 10px;
    height: 10px;
    background: linear-gradient(41.27deg, #4ec8ff 7.79%, #1df4ed 76.38%);
    filter: blur(10px);
    border-radius: 99px;
    transform: matrix(-1, 0, 0, 1, 0, 0);
    position: absolute;
    top: 4px;
    left: 1px;
  }
  .wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 72px;
  }
  .margin-zero {
    height: 400px;
  }
  .background-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  }
`;
