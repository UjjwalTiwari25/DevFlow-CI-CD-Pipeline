import css from 'styled-jsx/css';

export default css`
  .card {
    background: none;
    border: none;
    padding: 32px 20px;
  }
  .tracks-topics {
    width: 95%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .animation {
    animation: fadeIn ease 11s;
    -moz-animation: fadeIn ease 11s;
    -o-animation: fadeIn ease 11s;
    -ms-animation: fadeIn ease 11s;
  }
  .card-3 {
    margin-top: 20px;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    60% {
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
    60% {
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
    60% {
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
    60% {
      opacity: 0;
    }
    70%: {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  @media screen and (max-width: 576px) {
    .tracks-topics {
      max-width: 370px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .card {
      padding: 24px 0px;
    }
    .card-2 {
      padding: 20px;
    }
  }

  @media screen and (max-width: 320px) {
    .tracks-topics {
      max-width: 315px;
    }
  }
`;
