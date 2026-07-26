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
  .card-short {
    background: none;
    background-size: cover;
    border: none;
    border-radius: 6px;
    padding: 20px 20px 20px 0px;
  }
  .animation {
    animation: fadeIn ease 6s;
    -moz-animation: fadeIn ease 6s;
    -o-animation: fadeIn ease 6s;
    -ms-animation: fadeIn ease 6s;
  }
  .width {
    width: 310px;
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
