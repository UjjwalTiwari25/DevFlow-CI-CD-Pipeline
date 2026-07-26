import css from 'styled-jsx/css';

export default css`
  .plan-items-container {
    position: relative;
  }
  .background {
    min-width: 410px;
    height: 1156px;
  }
  .background-short {
    min-width: 410px;
    height: auto;
  }
  .align-center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px 0px;
    padding-bottom: 96px;
    position: relative;
    z-index: 3;
  }
  .ring-title {
    max-width: 420px;
    min-width: 420px;
  }
  .plan-items-container {
    margin-left: 20px;
    margin-right: 20px;
  }
  .your-plan-item {
    max-width: 420px;
    min-width: 420px;
    margin-bottom: 16px;
  }
  .your-plan-item-exp {
    max-width: 420px;
    min-width: 420px;
    margin-bottom: 40px;
  }
  .animation {
    animation: fadeIn ease 2s;
    -moz-animation: fadeIn ease 2s;
    -o-animation: fadeIn ease 2s;
    -ms-animation: fadeIn ease 2s;
  }
  .container-menu {
    align-items: center;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @media only screen and (max-width: 576px) {
    .your-plan-item {
      min-width: 0px;
      max-width: 346px;
    }
    .container {
      min-height: 80vh;
      width: 100%;
    }
    .background {
      min-width: 355px;
    }
  }
  @media only screen and (max-width: 375px) {
    .your-plan-item {
      min-width: 0px;
      max-width: 331px;
    }
    .container {
      min-height: 80vh;
    }
    .background {
      min-width: 330px;
    }
  }
  @media only screen and (max-width: 360px) {
    .your-plan-item {
      min-width: 0px;
      max-width: 334px;
    }
    .background {
      min-width: 324px;
    }
  }
  @media only screen and (max-width: 320px) {
    .your-plan-item {
      min-width: 0px;
      max-width: 300px;
    }
    .background {
      min-width: 290px;
    }
  }
  @media only screen and (max-width: 280px) {
    .your-plan-item {
      min-width: 0px;
      max-width: 280px;
    }
    .background {
      min-width: 270px;
    }
  }
`;
