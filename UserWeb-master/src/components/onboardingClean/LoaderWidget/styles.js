import css from 'styled-jsx/css';

export default css`
  .loader-widget-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .box-shadow {
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.1);
  }
  #ring-loader {
    width: 240px;
    height: 240px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('/static/images/icons/auraRingClean2x.png') center/contain;
  }
  #plan-item-text {
    display: inline-flex;
    max-width: 375px;
    align-items: center;
    min-height: 150px;
  }

  .loading-item-active {
    background-color: #fff;
    height: 47px;
    padding: 12px 22px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 14px;
    min-width: 186px;
  }
  .loading-item-inactive {
    background-color: #fff;
    height: 37px;
    padding: 12px 22px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 14px;
    min-width: 186px;
  }
  .animation1 {
    animation: fadein 12.5s forwards;
  }
  @keyframes fadein {
    0% {
      transform: translateX(25%);
    }
    20% {
      transform: translateX(25%);
    }
    40% {
      transform: translateX(-25%);
    }
    60% {
      transform: translateX(-80%);
    }
    80% {
      transform: translateX(-130%);
    }
  }
`;
