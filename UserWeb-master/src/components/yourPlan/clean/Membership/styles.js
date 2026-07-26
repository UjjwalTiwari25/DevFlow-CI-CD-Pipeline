import css from 'styled-jsx/css';

export default css`
  .card {
    background: none;
    background-size: cover;
    border: none;
    border-radius: 6px;
  }
  .padding-normal {
    padding: 20px;
  }
  .values-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  .value-contanier {
    display: inline-flex;
    margin-top: 16px;
  }
  .blue-check {
    width: 22px;
    height: 22px;
    margin-right: 16px;
  }
  .social-proof-container {
    margin-top: 52px;
    display: flex;
    justify-content: center;
  }
  .social-proof {
    filter: brightness(0.8);
  }
  .animation {
    animation: fadeIn ease 5s;
    -moz-animation: fadeIn ease 5s;
    -o-animation: fadeIn ease 5s;
    -ms-animation: fadeIn ease 5s;
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
`;
