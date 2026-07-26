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
  .sounds-container {
    display: block;
    margin-top: 30px;
  }
  .single-sound {
    display: flex;
    flex: 0 100%;
    position: relative;
    justify-content: center;
    align-items: center;
    height: 92px;
    margin-bottom: 16px;
    border-radius: 8px;
    background-size: 380px 92px;
  }
  .prefernce-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .sound-icon {
    width: 22px;
    margin-bottom: 6px;
  }

  .animation {
    animation: fadeIn ease 3s;
    -moz-animation: fadeIn ease 3s;
    -o-animation: fadeIn ease 3s;
    -ms-animation: fadeIn ease 3s;
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
