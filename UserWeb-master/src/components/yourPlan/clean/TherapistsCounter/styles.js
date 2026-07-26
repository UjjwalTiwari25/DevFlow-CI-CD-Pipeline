import css from 'styled-jsx/css';

export default css`
  .card {
    background-image: url('/static/images/yourplan-background.png');
    background-size: cover;
    border: none;
    border-radius: 6px;
    padding: 20px;
  }
  .card-dark {
    background-size: cover;
    border: none;
    border-radius: 6px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
  }
  .counter-container {
    display: flex;
    justify-content: space-between;
    margin-top: 29px;
  }
  .therapists_counter {
    font-weight: 700;
    font-size: 32px;
    line-height: 39px;
    color: #2f3237;
    mix-blend-mode: normal;
    display: flex;
  }
  .tracks_counter {
    font-weight: 700;
    font-size: 32px;
    line-height: 39px;
    color: #2f3237;
    mix-blend-mode: normal;
    display: inline-flex;
  }

  .animation {
    animation: fadeIn ease 4s;
    -moz-animation: fadeIn ease 4s;
    -o-animation: fadeIn ease 4s;
    -ms-animation: fadeIn ease 4s;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    12% {
      opacity: 0;
    }
    50% {
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
    12% {
      opacity: 0;
    }
    50% {
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
    12% {
      opacity: 0;
    }
    50% {
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
    12% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
`;
