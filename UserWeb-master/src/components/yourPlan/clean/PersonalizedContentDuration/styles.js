import css from 'styled-jsx/css';

export default css`
  .card {
    background-image: url('/static/images/yourplan-background.png');
    background-size: cover;
    border: none;
    border-radius: 6px;
    padding: 20px;
  }
  .card-white-short {
    border: none;
    border-radius: 6px;
    background: transparent;
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
  .duration {
    display: flex;
    align-items: center;
  }
  .duration-icon {
    width: 43px;
    height: 43px;
    margin-right: 22px;
  }
  .duration-container {
    display: block;
    margin-top: 30px;
  }
  .single-duration {
    display: flex;
    flex: 0 100%;
    position: relative;
    align-items: center;
    height: 92px;
    border-radius: 8px;
  }
  .animation {
    animation: fadeIn ease 3.5s;
    -moz-animation: fadeIn ease 3.5s;
    -o-animation: fadeIn ease 3.5s;
    -ms-animation: fadeIn ease 3.5s;
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
