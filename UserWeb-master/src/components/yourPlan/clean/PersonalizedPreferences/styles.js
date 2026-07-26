import css from 'styled-jsx/css';

export default css`
  .card {
    background-image: url('/static/images/yourplan-background.png');
    background-size: cover;
    border: none;
    border-radius: 6px;
    padding: 20px;
  }
  .card-short {
    background: transparent;
    border: none;
    border-radius: 6px;
    margin-top: 10px;
  }
  .card-white {
    border: none;
    border-radius: 6px;
    background: #fff;
    margin-top: 10px;
  }
  .card-dark {
    background-size: cover;
    border: none;
    border-radius: 6px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
  }
  .topics-container {
    display: inline-flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .container {
    position: relative;
    display: flex;
    flex: 0 48%;
  }
  .single-topic {
    display: flex;
    flex: 0 100%;
    position: relative;
    justify-content: center;
    align-items: center;
    height: 90px;
    margin-bottom: 12px;
    border-radius: 8px;
    background-color: #a9a9a9;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 6px;
  }
  .blur-background {
    width: 156px;
    position: absolute;
    top: 28px;
    height: 70px;
    left: 50%;
    transform: translate(-50%, 0%);
    filter: blur(7px);
  }
  .animation {
    animation: fadeIn ease 2s;
    -moz-animation: fadeIn ease 2s;
    -o-animation: fadeIn ease 2s;
    -ms-animation: fadeIn ease 2s;
  }

  .aura-will-help-you-to {
    margin-top: 4px;
  }

  .aura-will-help-you-to-topics {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin-top: 16px;
  }

  .aura-will-help-you-to-topic {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @media screen and (max-width: 576px) {
    .blur-background {
      width: 130px;
      height: 70px;
    }
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    70%: {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    70%: {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    70%: {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    70%: {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
`;
